import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid/index.js";
import Button from "./Button.jsx";
import { cn } from "../utils/index.js";

const Action = ({url, proccessing = false, editLink = true, deleteButton = true, data, handleDelete, className = '', children}) => {
  return (
    <>
      <div className={cn('flex gap-2 items-center justify-start', className)}>
        {children}

        {
          editLink &&
          <div className="tooltip tooltip-info tooltip-bottom" data-tip="Edit">
            <Link to={`${url}/${data.id}`}
                  className='bg-blue-600 flex justify-center items-center text-white hover:bg-blue-800 duration-200 rounded-md p-2'>
              <PencilIcon className='size-4'/>
            </Link>
          </div>
        }

        {
          deleteButton &&
          <div className="tooltip tooltip-error tooltip-bottom" data-tip="Delete">
            <Button disabled={proccessing} type='button' className='bg-red-600 hover:bg-red-700 duration-200'
                    onClick={() => handleDelete(data?.id)}>
              {
                proccessing ? <span className="loading loading-spinner"></span> : <TrashIcon className='size-4'/>
              }

            </Button>
          </div>
        }
      </div>
    </>
  )
}
export default Action
