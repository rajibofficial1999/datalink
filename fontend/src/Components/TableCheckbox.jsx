const TableCheckbox = ({...props}) => {
  return (
    <label>
      <input {...props} id='tableCheckBox' type="checkbox" className="checkbox"/>
    </label>
  )
}
export default TableCheckbox
