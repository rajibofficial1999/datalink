const From = ({ children, ...props }) => {
  return (
    <form {...props}>
      {children}
    </form>
  )
}
export default From
