import "./Layout.css"
import { Outlet } from 'react-router-dom'
import { Navbar } from "../../components"

const Layout = () => {
  return (
    <div className="main_container">
    <div className="sub_container">
        <Navbar />
        <Outlet />
    </div>
</div>
  )
}

export default Layout
