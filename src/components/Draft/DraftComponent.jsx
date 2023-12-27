import "./DraftComponent.css"
import { useState, useRef, useEffect } from "react"
import { CiImageOn } from "react-icons/ci";
import { useAuth0, } from "@auth0/auth0-react";
import { getUser, generateUuid, getBlog, getCloudinaryImgUrl } from "../../js/utils";
import { toast } from "react-toastify";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Loader from "../Loader/Loader"

const DraftComponent = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [alreadyHasCover, setAlreadyHasCover] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const location = useLocation()
  const isEditingDraft = location.pathname.substring(6).length > 2
  const { post_id } = useParams();


  useEffect(() => {
    async function getBlogData() {
      const blogData = await getBlog(post_id, true, "getDraftById")
      const data = blogData.response.items[0]
      setTitle(data?.title)
      setContent(data?.content)
      if (data?.image_id && data?.image_id !== "%!s(<nil>)") {
        const img = getCloudinaryImgUrl(data?.image_id)
        setAlreadyHasCover(true)
        setCoverImage(img)
      }
      window.scrollTo(0, 0)
    }

    if (isEditingDraft) {
      getBlogData()
    }
  }, [post_id])

  const navigate = useNavigate()
  useTextareaResize(titleRef)
  useTextareaResize(contentRef)

  const { user } = useAuth0();

  function handleImgChange(e) {
    setCoverImage(e.target.files[0]);
  }

  // EDIT DRAFT FUNCTION

  async function handleEditDraft() {
    setIsPosting(true)
    if (title.length < 2) {
      toast.error("Please write a valid title!", {
        position: toast.POSITION.TOP_RIGHT
      })
      setIsPosting(false)
      return
    }

    if (content.length < 5) {
      toast.error("Please write a longer content!", {
        position: toast.POSITION.TOP_RIGHT
      })
      setIsPosting(false)
      return
    }

    const image_id = await uploadImage()
      .then((res) => {
        return res.public_id
      })
      .catch((err) => {
        setIsPosting(false)
        console.error(err)
      })
    try {
      fetch(`https://wasteful-brown.cmd.outerbase.io/editDraft?post_id=${post_id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          content: content,
          image_id: image_id,
        }),
      })
      navigate("/")
    }
    catch (error) {
      toast.error("An error occured, please try again later", {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    finally {
      setIsPosting(false)
    }
  }

  async function handlePublish(publish=true) {
    setIsPosting(true)

    if (title.length < 2) {
      toast.error("Please write a valid title!", {
        position: toast.POSITION.TOP_RIGHT
      })
      setIsPosting(false)
      return
    }

    if (content.length < 5) {
      toast.error("Please write a longer content!", {
        position: toast.POSITION.TOP_RIGHT
      })
      setIsPosting(false)
      return
    }

    const url = publish ? "https://wasteful-brown.cmd.outerbase.io/createBlog" : "https://wasteful-brown.cmd.outerbase.io/createDraft"

    const user_id = await getUser(user?.email)
      .then((res) => {
        return res.response.items[0].user_id
      })
      .catch((err) => {
        setIsPosting(false)
        console.error(err)
      })

      console.log(user_id, "user_id")

    const image_id = await uploadImage()
      .then((res) => {
        return res.public_id
      })
      .catch((err) => {
        setIsPosting(false)
        console.error(err)
      })

    if (user_id) {
      const generatedUuid = generateUuid(coverImage?.name ? coverImage.name : "")
      console.log("user id present")
      async function publishBlog() {
        try {
          console.log("publishing blog...")
          await fetch(url, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              post_id: generatedUuid,
              user_id: user_id,
              title: title,
              content: content,
              image_id: image_id,
            }),
          });

          const publish_msg = publish ? "Blog published successfully!" : "Saved as draft successfully!"

          // RESET STATE 
          if (!isEditingDraft) {
            console.log("success")
            setTitle("")
            setContent("")
            setCoverImage("")

            toast.success(publish_msg, {
              position: toast.POSITION.TOP_RIGHT
            })

            navigate("/")
          }
          else {
            await deleteDraft()
          }
        } catch (error) {
          console.error(error)
          toast.error("An error occured, please try again later", {
            position: toast.POSITION.TOP_RIGHT
          })
        }

        finally {
          () => {
            setIsPosting(false)
          }
        }
      }

      await publishBlog()
    }

  }

  async function uploadImage() {
    if (!coverImage?.name) return { public_id: null }

    // Create a FormData object to hold the image data and other parameters
    const formData = new FormData();
    formData.append("file", coverImage);
    formData.append("upload_preset", "zbisdwoj");

    let imgData = "";

    // Define the Cloudinary API URL
    const url = "https://api.cloudinary.com/v1_1/dxzo4ug5i/image/upload";

    await fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(function (data) {
        imgData = data;
      })
      .catch(function (error) {
        toast.error("There was an error while uploading image!", {
          position: toast.POSITION.TOP_RIGHT
        })
      });

    return imgData;
  }

  async function deleteDraft() {
    try {
      fetch(`https://wasteful-brown.cmd.outerbase.io/deleteDraft?post_id=${post_id}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json'
        },
      })
      setTitle("")
      setContent("")
      setCoverImage("")

      toast.success("Blog published successfully", {
        position: toast.POSITION.TOP_RIGHT
      })

      navigate("/")
    }
    catch (error) {
      toast.error("There was an error removing Draft!", {
        position: toast.POSITION.TOP_RIGHT
      })
      console.log(error, "err")
    }
    finally {
      setIsPosting(false)
    }
  }


  return (
    <div className="draft_container" style={{ position: "relative" }}>
      <div className="draft_cover_image_container">
        <label htmlFor="cover_image" className="draft_add_cover_btn">
          <CiImageOn />
          <span>
            Add cover
          </span>
        </label>
        <input
          type="file"
          name="cover_image"
          id="cover_image"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImgChange}
        />
        {(coverImage.name || alreadyHasCover) && (
          <img src={alreadyHasCover? coverImage : URL.createObjectURL(coverImage)} alt="" className="cover_image" />
        )}
      </div>

      <div style={{ position: "relative" }}>
        <textarea
          name="title"
          id=""
          cols="30"
          rows="1"
          value={title}
          ref={titleRef}
          onChange={(e) => setTitle(e.target.value)}
          className="draft_title draft_textarea"
          placeholder="Blog Title..."
          maxLength={160}
        ></textarea>
        <textarea
          name="title"
          id=""
          cols="30"
          rows="1"
          value={content}
          ref={contentRef}
          onChange={(e) => setContent(e.target.value)}
          className="draft_textarea draft_content"
          placeholder="Breate. | Write. | Reflect..."
        ></textarea>
      </div>
      {isPosting && <Loader />}
      <div className="blog_btn_container">
        <button
          className="save_draft_btn blog_btn"
          onClick={() => isEditingDraft ? handleEditDraft() : handlePublish(false)}
        >
          Save Draft
        </button>
        <button
          className="publish_blog_btn blog_btn"
          onClick={() => handlePublish(true)}
        >
          Publish
        </button>
      </div>
    </div>
  )
}

export default DraftComponent


function useTextareaResize(textareaRef) {
  useEffect(() => {
    textareaRef.current.addEventListener("input", autoResize, false);
    function autoResize() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 4 + 'px';
    }
    return () => textareaRef.current && textareaRef.current.removeEventListener("input", autoResize, false);
  }, [])

}

// Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque fuga laborum facilis iste. Recusandae excepturi odio iste provident dolores, necessitatibus est? Voluptates corporis mollitia voluptatibus inventore reprehenderit velit consectetur veritatis!