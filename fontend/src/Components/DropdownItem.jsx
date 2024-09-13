import { MenuItem } from "@headlessui/react";
import { Link } from "react-router-dom";

const DropdownItem = ({children, as = 'link', ...props}) => {
  return (
    <>
      {
        as === 'button' && <MenuItem>
          <button {...props} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3">
            {children}
          </button>
        </MenuItem>
      }
      {
        as === 'link' && <MenuItem>
          <Link {...props} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3">
            {children}
          </Link>
        </MenuItem>
      }
    </>
  )
}
export default DropdownItem
