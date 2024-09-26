import Button from "./Button.jsx";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid/index.js";
import { cn } from "../utils/index.js";

const Pagination = ({data, handlePagination, currentPage}) => {

  const visitPage = (link) => {

    let page = link.label;

    if(link.active) return false

    if(!link.url) return false

    if(nextButton(link.label)){
      page = parseInt(currentPage) + 1
    }

    if(previousButton(link.label)){
      page = parseInt(currentPage) - 1
    }

    handlePagination(page)
  }

  const handleLabel = (label) => {

    if(previousButton(label)) return <ChevronDoubleLeftIcon className='size-3'/>;

    if(nextButton(label)) return <ChevronDoubleRightIcon className='size-3'/>;

    return label
  }

  const nextButton = (label) => label.toLowerCase().includes('next')

  const previousButton = (label) => label.toLowerCase().includes('previous')

  return (
    <>
      {
        data?.total > data?.per_page &&
        <div className="flex items-center justify-center">
          <div className="flex gap-3 flex-wrap p-6 py-12">
            <ul className="flex gap-2">
              {
                data?.links?.map((link, index) => (
                  <li key={link.label}>
                    <Button
                      onClick={() => visitPage(link)}
                      className={
                        cn('size-10 hover:bg-blue-900',
                          link.active ? 'bg-blue-900 cursor-auto' : '',
                          link.url ? '' : 'cursor-auto hover:bg-blue-600',
                        )
                      }
                    >
                      {handleLabel(link.label)}
                    </Button>
                  </li>
                ))
              }

            </ul>
          </div>
        </div>
      }
    </>
  )
}
export default Pagination
