const Table = ({children, tableColumns = []}) => {
  return (
    <table className="table">
      <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" className="checkbox"/>
          </label>
        </th>
        {
          tableColumns.map((column, index) => <th key={index}>{column}</th>)
        }
      </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}
export default Table
