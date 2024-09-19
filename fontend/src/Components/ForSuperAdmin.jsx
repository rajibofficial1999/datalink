const ForSuperAdmin = ({user, children}) => {
  return (
    <>
      {
        user?.is_super_admin && children
      }
    </>
  )
}
export default ForSuperAdmin
