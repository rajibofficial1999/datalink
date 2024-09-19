import Button from "./Button.jsx";

const TableSection = ({heading, refreshButton = false, pageRefresh, children}) => {
  return (
    <>
      <div className="overflow-x-auto mt-5 bg-base-100 text-base-content p-6">
        <div className='flex justify-between items-center mb-5'>
          <h1 className='text-xl text-nowrap'>{heading}</h1>
          {
            refreshButton ? <Button className='px-16' onClick={pageRefresh}>Refresh</Button>: ''
          }
        </div>
        {children}
      </div>
    </>
  )
}
export default TableSection
