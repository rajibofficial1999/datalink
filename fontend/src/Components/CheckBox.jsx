import { cn } from "../utils/index.js";

const CheckBox = ({className = '', children, ...props}) => {
  return (
    <div className={cn('form-control flex justify-start items-start ' + className)}>
      <label className="label cursor-pointer">
        <input {...props} type="checkbox" className="checkbox checkbox-primary"/>
        <span className="label-text ml-2">{children}</span>
      </label>
    </div>
  )
}
export default CheckBox
