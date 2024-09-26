import { cn } from "../utils/index.js";

const DefaultTooltip = ({className = '', value, children, ...props}) => {
  return (
    <>
      <div {...props} className={cn("tooltip tooltip-info tooltip-bottom", className)} data-tip={value}>
        {children}
      </div>
    </>
  )
}
export default DefaultTooltip
