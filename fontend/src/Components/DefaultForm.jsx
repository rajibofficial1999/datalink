const DefaultForm = ({ children, ...props }) => {
  return (
    <form {...props}>
      {children}
    </form>
  )
}
export default DefaultForm
