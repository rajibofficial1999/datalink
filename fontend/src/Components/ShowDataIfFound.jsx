const ShowDataIfFound = ({data, children}) => {

  // console.log(data.length)

  return (
    <>
      {
        data?.length < 0 ? <p className='text-center'>No Data available.</p> : children
      }
    </>
  )
}
export default ShowDataIfFound
