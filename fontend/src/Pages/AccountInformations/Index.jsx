import AccountInfo from "../../Components/AccountInfo.jsx";

const Index = () => {

  const tableColumns = [
    'Site',
    'Email',
    'Password',
    'Confirm Password',
    'NID info',
    'Agent',
    'Action',
    'Time'
  ]

  return (
   <>
     <AccountInfo
       heading='Accounts Information'
       tableColumns={tableColumns}
     />
   </>
  )
}
export default Index
