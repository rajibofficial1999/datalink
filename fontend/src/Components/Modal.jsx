import { useEffect, useRef } from "react";
import { cn } from "../utils/index.js";

const Modal = ({modalDismiss, modalClose = false, children, className = ''}) => {
  const close = useRef(null)

  useEffect(() => {
    if(modalClose){
      close.current.click()
    }
  }, [modalClose]);
  return (
    <>
      <dialog id="primary_modal" className={cn("modal", className)}>
        <div className="modal-box">
          <form method="dialog">
            <button ref={close} onClick={modalDismiss} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          {children}
        </div>
      </dialog>
    </>
  )
}
export default Modal
