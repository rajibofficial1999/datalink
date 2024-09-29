import { useEffect } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import Navbar from "../Components/Navbar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routes } from "../routes/index.js";
import Toast from "../Components/Toast.jsx";

function AppLayout() {
  const user = useSelector((state) => state.auth?.user)
  const errors = useSelector((state) => state.errors?.value)
  const navigate = useNavigate();

  useEffect(() => {
    if(!user){
      navigate(routes.login)
    }
  },[user, navigate])

  useEffect(() => {
    if(errors.status === 403){
      navigate(routes.packages)
    }
  },[errors])

  if (!user) {
    return null;
  }

  return (
    <>
      <Toast/>
      <div className='h-screen overflow-x-hidden bg-base-300'>
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
