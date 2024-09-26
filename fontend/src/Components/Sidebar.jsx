import SidebarLink from "./SidebarLink.jsx";
import { useEffect, useState } from "react";
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/solid'
import { routes } from "../routes/index.js";
import { useLocation } from "react-router-dom";
import { cn } from "../utils/index.js";
import { useSelector } from "react-redux";

const Sidebar = () => {

  const authUser = useSelector(state => state.auth.user)

  const location = useLocation()

  const [sidebarLinks, setSidebarLinks] = useState([
    {
      'Dashboard': [
        {
          name: 'Dashboard',
          path: routes.home,
          icon: <HomeIcon className='w-4 h-4'/>
        },
        {
          name: 'Overview',
          path: routes.overview,
          icon: <HomeIcon className='w-4 h-4'/>
        }
      ]
    },
    {
      name: 'Information',
      path: routes.accountInformation,
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      'Users' : [
        {
          name: 'Lists',
          path: routes.users,
          icon: <UserGroupIcon className='w-4 h-4'/>,
          normalUserCanNotAccess: true,
        },
        {
          name: 'Create',
          path: routes.createUser,
          icon: <UserGroupIcon className='w-4 h-4'/>,
          normalUserCanNotAccess: true,
        }
      ]
    },
    {
      'Pending Requests' : [
        {
          name: 'Users',
          path: routes.pendingUsers,
          icon: <UserGroupIcon className='w-4 h-4'/>,
          normalUserCanNotAccess: true,
        },
        {
          name: 'Domains',
          path: routes.pendingDomains,
          icon: <UserGroupIcon className='w-4 h-4'/>,
          normalUserCanNotAccess: true,
        }
      ]
    },
    {
      'Domains' : [
        {
          name: 'Lists',
          path: routes.domains,
          icon: <UserGroupIcon className='w-4 h-4'/>,
          normalUserCanNotAccess: true,
        },
        {
          name: 'Add Domain',
          path: routes.createDomain,
          icon: <UserGroupIcon className='w-4 h-4'/>,
          normalUserCanNotAccess: true,
        }
      ]
    },
    {
      name: 'Shortener',
      path: '/shortener',
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      name: 'Website Urls',
      path: routes.websiteUrls,
      icon: <HomeIcon className='w-4 h-4'/>,
    },
    {
      name: 'Notices',
      path: routes.notices,
      icon: <HomeIcon className='w-4 h-4'/>
    },
    {
      name: 'Supports',
      path: routes.supports,
      icon: <HomeIcon className='w-4 h-4'/>,
    }
  ])


  const filteredSidebarLinks = sidebarLinks.map(section => {
    if (Array.isArray(Object.values(section)[0])) {
      const sectionKey = Object.keys(section)[0];
      const links = section[sectionKey].filter(link => {
        if(authUser.is_user){
          if(link.normalUserCanNotAccess) {

            return false
          }
        }

        if(authUser.is_admin){
          if(link.adminCanNotAccess) {

            return false
          }
        }

        return true
      });
      return links.length ? { [sectionKey]: links } : null;
    }
    else {
      if(authUser.is_user){
        if(section.normalUserCanNotAccess) {

          return false
        }
      }

      return section;
    }
  }).filter(Boolean);


  useEffect(() => {
    setSidebarLinks(filteredSidebarLinks);
  }, []);


  return (
    <div className="drawer lg:drawer-open fixed w-72 shadow-md">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>
      <div className="drawer-side">
        <ul className="menu bg-base-100 text-base-content min-h-full w-72 p-4 pt-28">
          <li className='uppercase ml-4 font-bold text-[12px] mb-2'>Menu</li>
          {
            sidebarLinks.map((link, index) => (
              link?.name ? (
                <li key={index} className='my-1'>
                  <SidebarLink to={link.path} className={cn(location.pathname === link.path ? 'bg-base-300' : '')}>
                    {link?.icon}
                    {link?.name}
                  </SidebarLink>
                </li>
              ) : <li key={index} className='my-1'>
                <details>
                  <summary className='text-[16px] font-semibold'>
                    {Object.values(link)[0][0]?.icon}
                    {Object.keys(link)[0]}
                  </summary>
                  <ul>
                    {
                      Object.values(link)[0].map((item, ind) => (
                        <li key={ind} className='my-1'>
                          <SidebarLink to={item.path} className={cn(location.pathname === item.path ? 'bg-base-300' : '')}>
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
