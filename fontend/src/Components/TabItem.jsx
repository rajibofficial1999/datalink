import { CheckIcon } from "@heroicons/react/24/solid/index.js";
import { cn } from "../utils/index.js";

const TabItem = ({isSelected = false, text, ...props}) => {
  return (
    <>
      <div {...props} className={cn("badge gap- cursor-pointer text-base-content ", isSelected ? 'badge-info' : 'badge-outline hover:badge-info group')}>
        {isSelected && <CheckIcon className='size-4 text-white'/>}
          <span className={cn('group-hover:text-white capitalize ', isSelected ? 'text-white' : '')}>{text}</span>
      </div>
    </>
  )
}
export default TabItem
