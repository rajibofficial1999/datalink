import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { routes } from "../routes/index.js";

const GuestLayout = () => {
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      navigate(routes.home)
    }
  },[user, navigate])

  if (user) {
    return null;
  }

  return (
    <>
        <div className='h-screen overflow-x-hidden bg-base-300/2 flex justify-center items-center px-4'>
          <Outlet/>
        </div>
    </>
  )
}
export default GuestLayout
