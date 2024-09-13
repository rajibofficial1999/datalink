import { cn } from "../utils/index.js";

const Button = ({children, proccessing = false, className = '', ...props}) => {
  return (
    <button {...props} disabled={proccessing} className={cn('btn btn-square primary-btn ' + className)}>
      {
        proccessing ? <span className="loading loading-spinner"></span> : ''
      }

      {proccessing ? '' : children}
    </button>
  )
}
export default Button
