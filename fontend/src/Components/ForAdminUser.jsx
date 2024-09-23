const ForAdminUser = ({user, children}) => {
  return (
    <>
      {
        user?.is_admin && children
      }
    </>
  )
}
export default ForAdminUser
