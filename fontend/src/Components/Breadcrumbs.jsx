import { Link } from "react-router-dom";
import { routes } from "../routes/index.js";
import { cn } from "../utils/index.js";

const Breadcrumbs = ({className = '', children}) => {
  return (
    <div className={cn('breadcrumbs text-sm mt-5 mb-2 ' + className)}>
      <ul>
        <li>
          <Link className='text-sm' to={routes.dashboard}>Dashboard</Link>
        </li>
        <li>
          <h1 className='font-bold text-lg'>{children}</h1>
        </li>
      </ul>
    </div>
  )
}
export default Breadcrumbs
