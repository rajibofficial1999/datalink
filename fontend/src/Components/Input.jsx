import { cn } from "../utils/index.js";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid/index.js";
import { useRef, useState } from "react";

const Input = ({ label = null, icon = null, className = '', error = null, ...props }) => {
  let border = error == null ? 'input-primary' : 'input-error !mb-0'

  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const input = useRef(null)

  const handlePassword = (type) => {
    setIsPasswordOpen(!isPasswordOpen)
    input.current.type = type
  }

  return (
    <>
      <label
        className={cn(label != null ? 'form-control w-full ' + className : border + ' input input-bordered flex items-center gap-2 ' + className)}>
        {
          label != null &&
          <div className="label">
            <span className="label-text">{label}</span>
          </div>
        }
        {
          icon != null ? <span>{icon}</span> : ''
        }

        <input ref={input} {...props}
               className={cn(label != null ? 'input input-bordered w-full ' + border : 'grow ')}/>

        {
          (label == null && props.type == 'password') && (
            isPasswordOpen ?
              <EyeSlashIcon onClick={() => handlePassword('password')} className='w-5 h-5 cursor-pointer'/> :
              <EyeIcon onClick={() => handlePassword('text')} className='w-5 h-5 cursor-pointer'/>
          )
        }
      </label>
      {error && <p className='text-red-500 mt-1 mb-3'>{error}</p>}
    </>
  )
}
export default Input
