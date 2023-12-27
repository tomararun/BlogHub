import "./Navbar.css"
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { logo_transparent, B_logo } from "../../assets"
import { useAuth0 } from "@auth0/auth0-react";

import { CiSearch } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";
import { BiSolidUserCircle } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import LoginBox from "./LoginBox";

const Navbar = () => {
  const navigate = useNavigate();
  const [openLoginBox, setOpenLoginBox] = useState(false)

  const { isAuthenticated, user } = useAuth0();

  const navRef = useRef(null)
  useScroll(navRef)

  function handleProfile() {
    isAuthenticated ? navigate("/profile") : setOpenLoginBox(prev => !prev)
  }

  return (
    <>
      <div className="nav_main_container glass" ref={navRef}>
        <nav className="nav_container">
          <div className="nav_sub_container">
            {/* <FiMenu className="nav_icon menu_icon" /> */}
            <img src={logo_transparent} alt="BlogZen Logo" className="nav_logo" />
            <img src={B_logo} alt="BlogZen Logo" className="nav_logo_small" />
          </div>
          <ul className="nav_sub_container nav_center_part">
            <li onClick={() => navigate("/")}>
              My Feed
            </li>
            <li onClick={() => navigate("/bookmarks")}>
              Bookmarks
            </li>
          </ul>
          <ul className="nav_sub_container nav_right_part">
            {/* <li className="nav_icon">
              <CiSearch />
            </li> */}
            <li className="nav_write_btn" onClick={() => navigate("/draft")}>
              <BsPencil />
              <span
                className="nav_write_btn_text"
                
              >
                Write
              </span>
            </li>
            <li className="nav_icon profile_icon">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user?.name}
                  onClick={handleProfile}
                  className="user_image_nav"
                />
              ) : (
                <BiSolidUserCircle onClick={handleProfile} />
              )}
            </li>
          </ul>
        </nav>
      </div>
      {openLoginBox && !isAuthenticated && <LoginBox setOpenLoginBox={setOpenLoginBox} />}
    </>
  )
}

export default Navbar

function useScroll(navRef) {
  const lastScrollTop = useRef(0);
  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    navRef.current.style.top = scrollTop > lastScrollTop.current ? "-80px" : "0px";
    lastScrollTop.current = scrollTop
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
}
