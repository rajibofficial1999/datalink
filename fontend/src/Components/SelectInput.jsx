import { cn } from "../utils/index.js";

const SelectInput = ({className = '', error = null, children, ...props}) => {

  let border = error == null ? 'select-primary' : 'select-error !mb-0'

  return (
    <>
      <select
        {...props}
        className={cn("select w-full mt-2 " + border, className)}
      >
        {children}
      </select>
    </>
  )
}
export default SelectInput
