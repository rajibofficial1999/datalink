import SidebarLink from "./SidebarLink.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "../utils/index.js";
import { useSelector } from "react-redux";
import sidebarlinks from "../utils/sidebarlinks.js";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  QueueListIcon,
  BellAlertIcon,
  GlobeAltIcon,
  ListBulletIcon,
  MegaphoneIcon,
  PaperClipIcon,
  PlusCircleIcon,
  ShieldExclamationIcon,
  SquaresPlusIcon,
  TableCellsIcon,
  UsersIcon,
  CreditCardIcon
} from '@heroicons/react/24/solid';

const Sidebar = () => {

  const authUser = useSelector(state => state.auth.user)

  const location = useLocation()

  const [sidebarLinks, setSidebarLinks] = useState(sidebarlinks)


  const icons = {
    HomeIcon: <HomeIcon className='size-4'/>,
    UsersIcon: <UsersIcon className='size-4'/>,
    QueueListIcon: <QueueListIcon className='size-4'/>,
    ClipboardDocumentListIcon: <ClipboardDocumentListIcon className='size-4'/>,
    GlobeAltIcon: <GlobeAltIcon className='size-4'/>,
    TableCellsIcon: <TableCellsIcon className='size-4'/>,
    ListBulletIcon: <ListBulletIcon className='size-4'/>,
    PaperClipIcon: <PaperClipIcon className='size-4'/>,
    BellAlertIcon: <BellAlertIcon className='size-4'/>,
    SquaresPlusIcon: <SquaresPlusIcon className='size-4'/>,
    MegaphoneIcon: <MegaphoneIcon className='size-4'/>,
    PlusCircleIcon: <PlusCircleIcon className='size-4'/>,
    ShieldExclamationIcon: <ShieldExclamationIcon className='size-4'/>,
    CreditCardIcon: <CreditCardIcon className='size-4'/>,
  };


  const canAccess = (linkOrSection, authUser) => {
    if (authUser.is_user && linkOrSection.normalUserCanNotAccess) {
      return false;
    }

    if (authUser.is_admin && linkOrSection.adminCanNotAccess) {
      return false;
    }

    if(authUser.is_admin || authUser.is_user){
      if (linkOrSection.needSubscription) {
        if (!authUser.subscription_details || authUser.subscription_details.is_expired) {
          return false;
        }
      }
    }

    return true;
  };

  const filteredSidebarLinks = sidebarLinks.map(section => {
    if (Array.isArray(Object.values(section)[0])) {
      const sectionKey = Object.keys(section)[0];
      const links = section[sectionKey].filter(link => canAccess(link, authUser));

      return links.length ? { [sectionKey]: links } : null;
    } else {
      return canAccess(section, authUser) ? section : null;
    }
  }).filter(Boolean); // Filter out any null values


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
                    {icons[link.icon] && icons[link.icon]}
                    {link?.name}
                  </SidebarLink>
                </li>
              ) : <li key={index} className='my-1'>
                <details>
                  <summary className='text-[16px] font-semibold'>
                    {icons[Object.values(link)[0][0]?.icon] && icons[Object.values(link)[0][0]?.icon]}
                    {Object.keys(link)[0]}
                  </summary>
                  <ul>
                    {
                      Object.values(link)[0].map((item, ind) => (
                        <li key={ind} className='my-1'>
                          <SidebarLink to={item.path} className={cn(location.pathname === item.path ? 'bg-base-300' : '')}>
                            {icons[item.icon] && icons[item.icon]}
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
