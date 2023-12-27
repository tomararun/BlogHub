import React from 'react'
import { AiOutlineClose } from "react-icons/ai";
import { BiSolidUserCircle } from "react-icons/bi";
import { useAuth0, } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom"

function LoginBox({ setOpenLoginBox }) {
    const { loginWithPopup } = useAuth0();
    const navigate = useNavigate();

    async function handleLogin() {
        await loginWithPopup()
        .then(() => {
                localStorage.setItem("isAuthenticated", true)
                navigate("/profile")
            })
            .catch((err) => console.error(err, "err"))
        }
        
    return (
        <div className="login_box">
            <div className="login_sub_container" style={{ position: "relative" }}>
                <AiOutlineClose
                    className="login_close_icon"
                    onClick={() => setOpenLoginBox(false)}
                />
                <BiSolidUserCircle className="login_icon" />
                <p className="login_para">
                    LogIn into your BlogZen Account
                </p>
                <p className="login_sub_para">
                    Takes only a few seconds
                </p>
                <button className="login_btn" onClick={handleLogin}>
                    LogIn
                </button>
            </div>
        </div>
    )
}


export default LoginBox
