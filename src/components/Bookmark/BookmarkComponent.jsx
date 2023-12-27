import "./BookmarkComponent.css"
import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { toast } from "react-toastify";
import { getBlog, getUser, formatTimestamp, getCloudinaryImgUrl } from '../../js/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { user as userImg } from '../../assets';
import Loader from "../Loader/Loader";

import { PiChatsCircleLight } from "react-icons/pi";

const BookmarkComponent = () => {
  const [loading, setLoading] = useState(true)
  const [bookmarks, setBookmarks] = useAllBookmarks(setLoading)
  const navigate = useNavigate()

  let mappedBlogs = bookmarks.map((blog) => {
    // 2023-09-22T11:42:51Z
    const cover_img_url = getCloudinaryImgUrl(blog?.image_id)
    const timestamp = formatTimestamp(blog?.timestamp)
    return (
        <div className="hb_container" key={blog.post_id}> 
            <div className="hb_user_details">
                <img src={blog?.user?.picture ? blog.user.picture : userImg}
                    alt={blog?.user?.name}
                    className="hb_user_image"
                />
                <div>
                    <h3 className="hb_user_name blog_user_name">{blog.user.name}</h3>
                    <p className="hb_post_date">{timestamp}</p>
                </div>
            </div>
            <div className="hb_blog_details" onClick={() => navigate(`/blog/${blog.post_id}`)}>
                {blog.image_id !== "%!s(<nil>)" && (
                    <div className="hb_cover_image_container">
                        <img src={cover_img_url} alt={blog.title} className="hb_cover_image" />
                    </div>
                )}
                <div>
                    <h2 className="hb_title blog_title">
                        {blog.title}
                    </h2>
                    <p className="hb_content">
                        {blog.content.substring(0, 250)}...
                    </p>
                </div>
            </div>
            <div className="hb_footer">
                <button className="hb_footer_btn" onClick={() => navigate(`/blog/${blog.post_id}`)}>
                    <PiChatsCircleLight className="hb_footer_icon"/> Discuss
                </button>
            </div>
        </div>
    )
})


  return (
    <div className="bookmarks_container">
      {loading? <Loader /> : mappedBlogs}
    </div>
  )
}

export default BookmarkComponent


function useAllBookmarks(setLoading) {
  const [bookmarks, setBookmarks] = useState([])
  const { user } = useAuth0();
  const email = user?.email;

  useEffect(() => {
    async function getBookmarks() {
      try {
        const response = await fetch(`https://wasteful-brown.cmd.outerbase.io/getBookmark?email=${email}`, {
          'method': 'GET',
          'headers': {
              'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const bookmarksData = await response.json(); // Parse the response body as JSON
        const bookmarksArr = bookmarksData.response.items

        const allBookmarks = await Promise.all(bookmarksArr.map(async (bookmark) => {
          const post_id = bookmark.post_id
          const res = await getBlog(post_id, true)
          const blog = res.response.items[0]
          console.log(blog.user_id)
          const user = await getUser(blog?.user_id, false);
          console.log(user, "user")
          return {
            ...blog,
            user: user.response.items[0],
          }
        }))


        setBookmarks(allBookmarks)
      }
      catch (error) {
        toast.error("There was an error getting bookmarks!", {
          position: toast.POSITION.TOP_RIGHT
        })
      }

      finally {
        setLoading(false)
      }
    }

    getBookmarks()
  }, [])

  return [bookmarks, setBookmarks]
}