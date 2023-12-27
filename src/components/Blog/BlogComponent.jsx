import "./BlogComponent.css"
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlog, getCloudinaryImgUrl, getUser } from '../../js/utils'
import { logo, B_logo, user as userImg, default_cover_img } from "../../assets"
import { FaRegCommentDots } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { BiHeart } from "react-icons/bi";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react"


const BlogComponent = () => {
    const [blog, setBlog] = useBlog()
    const [comment, setComment] = useState("")
    const { post_id } = useParams()
    const navigate = useNavigate()
    const content = blog?.content?.split('\n');
    const blogImgSrc = getCloudinaryImgUrl(blog?.image_id)
    const user_id = blog?.user_id
    const [user, setUser] = useUser(blog?.user_id)
    const [suggestions, setSuggestions] = useSuggestions(blog?.user_id)
    const [comments, setComments] = useComments()
    const [isBookmarked, setIsBookmarked] = useBookmark()
    const { user: user_current } = useAuth0()


    async function handleComment() {
        if (!post_id || !user_id || comment.length === 0) return
        try {
            await fetch(`https://wasteful-brown.cmd.outerbase.io/createComment`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    post_id: post_id,
                    user_id: user_id,
                    comment_text: comment,
                }),
            });
            setComment("")
            toast.success("Comment sent successfully", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
        catch (error) {
            toast.error("There was an error sending comment", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const commentsArr = comments.map((comment, idx) => {
        const { comment_text, comment_id, user } = comment
        return (
            <div
                className={`comment ${idx === comments.length - 1 && "last_comment_border"}`}
                key={comment_id}
            >
                <div className="comment_header">
                    <div className="comment_doer_image">
                        <img
                            src={user?.image ? user.image : userImg}
                            alt={user.name}
                            className="bp_img"
                        />
                    </div>
                    <h3 className="comment_doer_name">
                        {user?.name}
                    </h3>
                </div>
                <p className="commment_doer_text">
                    {comment_text}
                </p>
            </div>
        )
    })

    const suggestionsArr = suggestions.map((suggestion) => {
        const cover_img = getCloudinaryImgUrl(suggestion?.image_id)
        return (
            <div
                className="bps_container"
                onClick={() => navigate(`/blog/${suggestion.post_id}`)}
                key={suggestion.post_id}
            >
                <div className="bps_header_container">
                    <div className="bpsh_image">
                        <img
                            src={user?.image ? user.image : userImg}
                            alt={user?.name}
                            className="bp_img"
                        />
                    </div>
                    <p className="bpsh_name">{user?.name}</p>
                </div>
                <div className="bps_content_container">
                    <div className="bpsc_cover_image">
                        <img
                            src={cover_img.length > 1 ? cover_img : default_cover_img}
                            alt=""
                            className="bp_img"
                        />
                    </div>
                    <div className="bpsc_text_container">
                        <h2 className="bpsc_title">
                            {suggestion.title}
                        </h2>
                        <p className="bpsc_content">
                            {suggestion.content.substr(0, 100)}
                            <span style={{ fontSize: "32px", lineHeight: 0 }}>...</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    })


    async function createBookmark() {
        try {
            await fetch(`https://wasteful-brown.cmd.outerbase.io/postBookmark`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    email: user_current?.email,
                    post_id: post_id,
                }),
            });

            toast.success("Bookmarked!", {
                position: toast.POSITION.TOP_RIGHT
            })

            setIsBookmarked(true)
        } catch (error) {
            toast.error("There was an error bookmarking!", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    async function deleteBookmark() {
        try {
            fetch(`https://wasteful-brown.cmd.outerbase.io/deleteBookmark?post_id=${post_id}&email=${user_current.email}`, {
                'method': 'DELETE',
                'headers': {
                    'content-type': 'application/json'
                },
            })

            setIsBookmarked(false)
        }
        catch (error) {
            toast.error("There was an error remove bookmarking!", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    return (
        <div className="blog_page_main_container">
            <div className="blog_page_blog_container">
                <div className="bp_image_container">
                    <img src={blogImgSrc} alt="" className="bp_image" />
                </div>
                <div className="bp_text_container">
                    <h1 className="bp_title">
                        {blog?.title}
                    </h1>
                    <div>
                        {content?.map((line, index) => {
                            return line === "" ? (
                                <br key={index} />
                            ) : (
                                <p key={index} className="bp_content">
                                    {line}
                                </p>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="extras_container">
                <div className="">
                    {isBookmarked ? (
                        <BsFillBookmarkFill
                            className="extras_icon filled_bookmarked"
                            onClick={deleteBookmark}
                        />
                    ) : (
                        <BsBookmark
                            className="extras_icon"
                            onClick={createBookmark}
                        />
                    )}
                </div>
            </div>

            <div className="comments_main_container">
                <div className="comments_header">
                    <FaRegCommentDots className="comment_heading_icon" />
                    <h2>Comments</h2>
                </div>
                <div>
                    <div className="comment_input_container">
                        <input
                            type="text"
                            placeholder="Add a comment"
                            className="comment_input"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <IoSend className="comment_send_icon" onClick={handleComment} />
                    </div>

                    <div className="comments_sub_container">
                        {comments.length === 0 ? (
                            <div className="no_comments">
                                <p>No comments yet...</p>
                            </div>
                        ) : (
                            commentsArr
                        )}
                    </div>
                </div>
            </div>

            <div className="bp_author_container">
                <div onClick={() => navigate(`/user/${user_id}`)}>
                    <img
                        src={user?.image ? user.image : userImg}
                        alt={user?.name}
                        className="bpa_image"
                    />
                </div>
                <div>
                    <h4 className="bpa_heading">WRITTEN BY</h4>
                    <p
                        className="bpa_name"
                        onClick={() => navigate(`/user/${user_id}`)}
                    >
                        {user?.name? user.name : "User"} 
                    </p>
                </div>
            </div>
            <div className="bp_suggestions_container">
                <h3 className="bps_heading">
                    More Articles
                </h3>
                <div className="bps_main_container">
                    {suggestionsArr}
                </div>
            </div>
        </div>
    )
}

export default BlogComponent


function useBlog() {
    const { post_id } = useParams()
    const [blog, setBlog] = useState({})

    useEffect(() => {
        async function getBlogData() {
            const blogData = await getBlog(post_id, true)
            setBlog(blogData?.response?.items[0])
            window.scrollTo(0, 0)
        }
        getBlogData()
    }, [post_id])

    return [blog, setBlog]
}


function useUser(user_id) {
    const [user, setUser] = useState({});
    const { post_id } = useParams();
     
    useEffect(() => {
        async function getUserData() {
            const userData = await getUser(user_id, false)
            setUser(userData?.response?.items[0])
        }
        getUserData()
    }, [user_id, post_id])

    return [user, setUser]
}

function useSuggestions(user_id) {
    const [suggestions, setSuggestions] = useState([])
    const { post_id } = useParams()

    useEffect(() => {
        async function getBlogData() {
            const blogData = await getBlog(user_id, false)
            setSuggestions(blogData?.response?.items)
        }
        getBlogData()
    }, [user_id, post_id])

    return [suggestions, setSuggestions]
}

function useComments() {
    const { post_id } = useParams();
    const [comments, setComments] = useState([])

    useEffect(() => {
        async function getComments() {
            try {
                const response = await fetch(`https://wasteful-brown.cmd.outerbase.io/getComments?post_id=${post_id}`, {
                    'method': 'GET',
                    'headers': {
                        'content-type': 'application/json'
                    },
                })

                if (!response.ok) {
                    toast.error("There was an error getting comments!", {
                        position: toast.POSITION.TOP_RIGHT
                    })
                    throw new Error(`HTTP Error! Status: ${response.status}`)
                }

                let data = await response.json();
                data = data.response.items
                data = await Promise.all(data.map(async (comment) => {
                    try {
                        const user = await getUser(comment.user_id, false);
                        return {
                            ...comment,
                            user: user.response.items[0],
                        };
                    } catch (error) {
                        toast.error("There was an error getting comments!", {
                            position: toast.POSITION.TOP_RIGHT
                        })
                        return comment; // Return the original blog item without the user information.
                    }
                }))

                setComments(data)
            }

            catch (error) {
                toast.error("There was an error getting comments!", {
                    position: toast.POSITION.TOP_RIGHT
                })
                throw error;
            }
        }

        getComments()
    }, [post_id])

    return [comments, setComments]
}


function useBookmark() {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { post_id } = useParams()
    const { user } = useAuth0()

    const email = user?.email

    useEffect(() => {
        async function getBookmark() {
            try {
                const response = await fetch(`https://wasteful-brown.cmd.outerbase.io/getBookmarkOfPost?post_id=${post_id}&email=${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }

                const bookmarkData = await response.json(); // Parse the response body as JSON
                const bookmarked = bookmarkData.response.items.length > 0;
                setIsBookmarked(bookmarked)
            } catch (error) {
                toast.error("There was an error while getting user!", {
                    position: toast.POSITION.TOP_RIGHT
                })
                throw error; // Rethrow the error to handle it elsewhere if needed
            }
        }

           getBookmark()
    }, [post_id])

    return [isBookmarked, setIsBookmarked]
}
