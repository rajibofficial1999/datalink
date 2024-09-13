import { themeChange } from 'theme-change'
import { useEffect } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import Navbar from "../Components/Navbar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routes } from "../routes/index.js";

function AppLayout() {
  const user = useSelector((state) => state.auth?.user)
  const navigate = useNavigate();

  useEffect(() => {
    if(!user){
      navigate(routes.login)
    }
    themeChange(false)
  },[user, navigate])

  if (!user) {
    return null;
  }

  return (
    <>
      <div className='h-screen overflow-x-hidden bg-base-300/2'>
        <Navbar/>
        <Sidebar/>
        <div className='ml-0 lg:ml-72 mt-20 px-6 pt-1'>
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default AppLayout
