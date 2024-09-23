import { TrashIcon } from "@heroicons/react/24/solid/index.js";
import Button from "./Button.jsx";
import DefaultTooltip from "./DefaultTooltip.jsx";
import { cn } from "../utils/index.js";

const Table = ({className = '', tableColumns = [], showDeleteButton = true, handleCheckedItems, children}) => {

  return (
    <table className={cn("table", className)}>
      <thead>
      <tr>
        {
          showDeleteButton &&
          <td>
              <DefaultTooltip value='Delete'>
                <Button
                  type='button'
                  className='bg-red-600 hover:bg-red-700 duration-200'
                  onClick={handleCheckedItems}
                >
                  <TrashIcon className='size-4'/>
                </Button>
              </DefaultTooltip>
          </td>
        }

        {
          tableColumns.map((column, index) => <th className='text-[14px] font-bold uppercase' key={index}>{column}</th>)
        }
      </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}
export default Table
