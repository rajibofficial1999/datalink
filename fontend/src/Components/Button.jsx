import { cn } from "../utils/index.js";
import { Link } from "react-router-dom";

const Button = ({as = 'button', proccessing = false, className = '', children, ...props}) => {
  return (
    <>
      {
        as === 'button' &&
        <button {...props} disabled={proccessing}
                className={cn('bg-blue-600 flex justify-center items-center text-white hover:bg-blue-800 duration-200 rounded-md p-2 ' + className)}>
          {
            proccessing ? <span className="loading loading-spinner"></span> : children
          }
        </button>
      }

      {
        as === 'link' &&
        <Link {...props}
                className={cn('bg-blue-600 flex justify-center items-center text-white hover:bg-blue-800 duration-200 rounded-md p-2 ' + className)}>
          {children}
        </Link>
      }
    </>
  )
}
export default Button
