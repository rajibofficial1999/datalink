import { cn } from "../utils/index.js";

const InnerSection = ({heading = '', headingButton = '', className = '', children}) => {
  return (
    <>
      <div className={cn("overflow-x-auto mt-5 bg-base-100 text-base-content p-6", className)}>
        <div className={cn('flex justify-between items-center mb-5', (heading === '' && headingButton === '') && 'mb-0')}>
          <h1 className='text-xl text-nowrap'>{heading}</h1>
          {headingButton ?? ''}
        </div>
        {children}
      </div>
    </>
  )
}
export default InnerSection
