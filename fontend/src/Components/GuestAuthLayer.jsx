const GuestAuthLayer = ({heading = '', subHeading = '', children}) => {
  return (
    <>
      <div className='max-w-full sm:max-w-lg mx-auto w-full'>
        <div className='my-16 text-center'>
          <h1 className='sm:text-4xl text-2xl font-bold mb-5'>{heading}</h1>
          <p className='font-semibold text-lg'>{subHeading}</p>
        </div>
        {children}
      </div>
    </>
  )
}
export default GuestAuthLayer
