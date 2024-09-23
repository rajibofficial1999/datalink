import { cn } from "../utils/index.js";

const BadgeLarge = ({className = '', children}) => {
  return (
    <div className={cn('bg-blue-700 text-white rounded-md py-1 px-2 text-center text-nowrap', className)}>{children}</div>
  )
}
export default BadgeLarge
