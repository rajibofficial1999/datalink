import { themeChange } from "theme-change";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid/index.js";
import { BellIcon } from "@heroicons/react/24/outline/index.js";
import { useSelector, useDispatch } from 'react-redux'
import {changeTheme} from "../utils/store/themeSlice.js";
import request from "../utils/request.js";
import { ADMIN_LOGOUT, NOTIFICATIONS } from "../utils/api-endpoint.js";
import { clearAuthUser } from "../utils/store/authSlice.js";
import { routes } from "../routes/index.js";
import { Link, useNavigate } from "react-router-dom";
import { APP_URL } from "../env/index.js";
import LoadImage from "./LoadImage.jsx";
import { useEffect, useState } from "react";
import ShowDataIfFound from "./ShowDataIfFound.jsx";

const Navbar = () => {
  const theme = useSelector((state) => state.theme?.value)
  const user = useSelector((state) => state.auth?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])

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

  const fetchNotifications = async () => {
    try {
      const {data} = await request.get(NOTIFICATIONS)
      setNotifications(data)
    }catch (error){
      console.log(error)
    }
  }

  const filterText = (text) => {
    if(text.length > 80){

      return text.substring(0, 80) + '...'
    }

    return text
  }

  useEffect(() => {
    fetchNotifications()
  }, []);

    return (
      <div className="navbar bg-base-100 text-base-content fixed z-40">
        <div className="flex-1">
          <a className="text-xl pl-5 font-semibold">Admin Dashboard</a>
        </div>
        <div className="navbar-end">
          <label className="swap swap-rotate" data-key="front-page" data-set-theme="dark">
            <input type="checkbox" value={theme} onChange={manageTheme}/>
            <SunIcon className='swap-on size-5'/>
            <MoonIcon className='swap-off size-5'/>
          </label>


          <div className="dropdown dropdown-end">
            <button tabIndex={0} role="button" className="bg-base-300 text-base-content rounded-full size-8 flex justify-center items-center mx-5">
              <div className="indicator">
                <BellIcon className='size-5'/>
              </div>
            </button>

            <ul tabIndex={0} className="dropdown-content menu bg-base-100 mt-4 z-[1] w-72 min-h-80 overflow-hidden p-0 shadow border border-base-300">
              <p className='px-4 py-3 border-b border-base-300 text-md w-full font-bold'>Notifications</p>
              <div className=''>
                  {
                    notifications?.length > 0 ?
                      notifications.map(notification => (
                        <li key={notification.id}>
                          <Link to={routes.notices} className='rounded-none border-b border-base-300 px-4 py-4 flex flex-col justify-start items-start'>
                            <p className='font-semibold text-sm text-wrap'>
                              {filterText(notification.body)}
                              {
                                filterText(notification.body).length > 80 && <span className='text-blue-600 text-nowrap'> Read more</span>
                              }
                            </p>
                            <span className='italic '>{notification.human_time}</span>
                          </Link>
                        </li>
                      ))
                      :
                      <p className='text-center mt-3'>Empty!</p>
                  }

              </div>
            </ul>
          </div>

          <div className='sm:flex flex-col justify-end items-end mr-2 ml-4 hidden'>
            <h2 className='font-semibold text-[15px]'>{user?.name}</h2>
            <p className='text-[14px]'>{user?.email}</p>
          </div>
          <div className="dropdown dropdown-end ">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <LoadImage alt={user.name}
                           src={`${APP_URL}/storage/${user.avatar}`}/>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <Link to={routes.profile} className="justify-between text-[16px] py-2">
                  Profile
                </Link>
              </li>
              <li>
                <button className='text-[16px] py-2' type='button' onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
}

export default Navbar
