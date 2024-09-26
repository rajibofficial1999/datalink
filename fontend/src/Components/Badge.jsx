import { cn } from "../utils/index.js";

const Badge = ({children, className}) => {
  return (
    <div className={cn('badge gap-2 text-nowrap  ', className)}>
      {children}
    </div>
  )
}
export default Badge
