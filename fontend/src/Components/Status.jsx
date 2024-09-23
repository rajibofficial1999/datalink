import Badge from "./Badge.jsx";

const Status = ({data}) => {
  return (
    <>
      {data?.status === 'pending' && <Badge className='badge-warning'>{data.status}</Badge>}
      {data.status === 'approved' && <Badge className='badge-success'>{data.status}</Badge>}
      {data.status === 'suspended' && <Badge className='badge-error'>{data.status}</Badge>}
      {data.status === 'rejected' && <Badge className='badge-error'>{data.status}</Badge>}
    </>
  )
}
export default Status
