import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import Navbar from "../Components/Navbar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routes } from "../routes/index.js";
import Toast from "../Components/Toast.jsx";

// window.Pusher = Pusher;

// window.Echo = new Echo({
//   broadcaster: "reverb",
//   key: import.meta.env.VITE_REVERB_APP_KEY,
//   wsHost: import.meta.env.VITE_REVERB_HOST,
//   wsPort: import.meta.env.VITE_REVERB_PORT,
//   wssPort: import.meta.env.VITE_REVERB_PORT,
//   forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
//   encrypted: false,
//   enabledTransports: ["ws", "wss"],
//   authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
//   auth: {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   },
// });

// window.Echo.private(`AccountInfoPrivateChannel.User.${user?.id}`).listen(
//   `AccountInfoPrivateEvent`,
//   (e) => {
//     store.dispatch(addNotification(e.accountInformation));
//   }
// );


function AppLayout() {
  const user = useSelector((state) => state.auth?.user)
  const errors = useSelector((state) => state.errors?.value)
  const navigate = useNavigate();
  const [isDrawerOpen, setisDrawerOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate(routes.login)
    }
  }, [user, navigate])

  useEffect(() => {
    if (errors.status === 403) {
      navigate(routes.packages)
    }
  }, [errors])

  if (!user) {
    return null;
  }

  const handleDrawer = (value) => {
    setisDrawerOpen(value);
    
  }

  return (
    <>
      <Toast />
      <div className='h-screen overflow-x-hidden bg-base-300'>
        <Navbar handleDrawer={handleDrawer}/>
        <Sidebar isDrawerOpen={isDrawerOpen} />
        <div className='ml-0 lg:ml-72 mt-20 px-6 pt-1'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AppLayout