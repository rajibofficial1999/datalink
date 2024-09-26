import { cn } from "../utils/index.js";

const DefaultForm = ({ children, className = '', ...props }) => {
  return (
    <form {...props} className={cn(className)}>
      {children}
    </form>
  )
}
export default DefaultForm
