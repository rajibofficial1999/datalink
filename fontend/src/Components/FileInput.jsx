import { cn } from "../utils/index.js";
import { useRef } from "react";

const FileInput = ({className = '', error = null, fileInputRef, ...props}) => {

  let border = error == null ? 'input-primary' : 'input-error !mb-0'

  return (
    <>
      <input
        {...props}
        type="file"
        ref={fileInputRef}
        accept='image/*'
        className={cn("file-input file-input-bordered w-full input-primary mt-2 " + border, className)}
      />
    </>
  )
}
export default FileInput
