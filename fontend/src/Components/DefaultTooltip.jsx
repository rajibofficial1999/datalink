import { Link } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/24/solid/index.js";
import { cn } from "../utils/index.js";

const DefaultTooltip = ({className = '', value, children}) => {
  return (
    <>
      <div className={cn("tooltip tooltip-info tooltip-bottom", className)} data-tip={value}>
        {children}
      </div>
    </>
  )
}
export default DefaultTooltip
