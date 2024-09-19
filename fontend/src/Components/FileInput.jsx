import { cn } from "../utils/index.js";

const InputFile = ({className = '', error = null, ...props}) => {

  let border = error == null ? 'input-primary' : 'input-error !mb-0'

  return (
    <>
      <input
        {...props}
        type="file"
        className={cn("file-input file-input-bordered w-full input-primary mt-2 " + border, className)}
      />
    </>
  )
}
export default InputFile
