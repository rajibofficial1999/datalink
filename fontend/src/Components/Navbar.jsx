import { themeChange } from "theme-change";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid/index.js";
import { BellIcon } from "@heroicons/react/24/outline/index.js";
import { useSelector, useDispatch } from 'react-redux'
import {changeTheme} from "../utils/store/themeSlice.js";
import request from "../utils/request.js";
import { ADMIN_LOGOUT } from "../utils/api-endpoint.js";
import { clearAuthUser } from "../utils/store/authSlice.js";
import { routes } from "../routes/index.js";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const theme = useSelector((state) => state.theme?.value)
  const user = useSelector((state) => state.auth?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const manageTheme = (event) => {
    let theme = event.target.value === 'light' ? 'dark' : 'light'
    dispatch(changeTheme(theme))
    themeChange(false)
  }

  const logout = async () => {
    try {
      const { data } = await request.delete(ADMIN_LOGOUT);
      if(data.success){
        dispatch(clearAuthUser(data.user))
        navigate(routes.login)
      }
    } catch (error) {
      console.log(error)
    }
  }

    return (
      <div className="navbar bg-base-300 fixed z-40">
        <div className="flex-1">
          <a className="text-xl pl-5 font-semibold">Admin Dashboard</a>
        </div>
        <div className="navbar-end">
          <label className="swap swap-rotate" data-key="front-page" data-set-theme="dark">
            <input type="checkbox" value={theme} onChange={manageTheme}/>
              <SunIcon className='swap-on w-5 h-5'/>
              <MoonIcon className='swap-off w-5 h-5'/>
          </label>
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <BellIcon className='w-5 h-5'/>
            </div>
          </button>
          <div className='sm:flex flex-col justify-end items-end mr-2 ml-4 hidden'>
            <h2 className='font-semibold text-[15px]'>{user?.username}</h2>
            <p className='text-[14px]'>{user?.email}</p>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={user?.avatar ?? 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}/>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><button type='button' onClick={logout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    )
}

export default Navbar
