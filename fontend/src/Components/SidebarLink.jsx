import { cn } from "../utils/index.js";
import { Link } from "react-router-dom";

const SidebarLink = ({children, className = '', to}) => {
  return <Link to={to} className={cn('text-[16px] flex items-center gap-1 font-semibold ' + className)} href='/hello'>{children}</Link>
}
export default SidebarLink
