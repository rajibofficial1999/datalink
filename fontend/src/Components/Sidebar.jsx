import SidebarLink from "./SidebarLink.jsx";
import { useState } from "react";
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/solid'

const Sidebar = () => {
  const [sitebarlinks, setSitebarlinks] = useState([
    {
      'Dashboard': [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: <HomeIcon className='w-4 h-4'/>
        },
        {
          name: 'Overview',
          path: '/overview',
          icon: <HomeIcon className='w-4 h-4'/>
        }
      ]
    },
    {
      name: 'Informations',
      path: '/informations',
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      name: 'Manege Websites',
      path: '/manage-websites',
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      name: 'All Users',
      path: '/users',
      icon: <UserGroupIcon className='w-4 h-4'/>
    },
    {
      name: 'Pending Reequests',
      path: '/pending-requests',
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      name: 'Shortener',
      path: '/shortener',
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      name: 'Websites',
      path: '/websites',
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      name: 'Notices',
      path: '/notices',
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      name: 'Add Services',
      path: '/add-services',
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      name: 'Supports',
      path: '/supports',
      icon: <HomeIcon className='w-4 h-4'/>
    }
  ])

  return (
    <div className="drawer lg:drawer-open fixed w-72 shadow-md">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>
      <div className="drawer-side">
        <ul className="menu bg-base-300 text-base-content min-h-full w-72 p-4 pt-28">
          <li className='uppercase ml-4 font-bold text-[12px] mb-2'>Menu</li>
          {
            sitebarlinks.map((link, index) => (
              link?.name ? (
                <li key={index} className='my-1'>
                  <SidebarLink to={link.path}>
                    {link?.icon}
                    {link?.name}
                  </SidebarLink>
                </li>
              ) : <li key={index} className='my-1'>
                <details open>
                  <summary className='text-[15px] font-semibold'>
                    {Object.values(link)[0][0]?.icon}
                    {Object.keys(link)[0]}
                  </summary>
                  <ul>
                    {
                      Object.values(link)[0].map((item, ind) => (
                        <li key={ind} className='my-1'>
                          <SidebarLink to={item.path}>
                            {item.icon}
                            {item.name}
                          </SidebarLink>
                        </li>
                      ))
                    }

                  </ul>
                </details>
              </li>
            ))

          }
        </ul>
      </div>
    </div>
  )
}
export default Sidebar
