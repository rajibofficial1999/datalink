const Processing = ({ processing = false, children }) => {
  return (
    <>
      {processing ?
        <div className='text-center'>
          <span className="loading loading-spinner loading-md"></span>
        </div>
        : children}
    </>
  );
};

export default Processing;
