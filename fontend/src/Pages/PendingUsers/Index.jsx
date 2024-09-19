import Table from "../../Components/Table.jsx";
import { useEffect, useState } from "react";
import request from "../../utils/request.js";
import { USERS } from "../../utils/api-endpoint.js";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid/index.js";
import Section from "../../Components/Section.jsx";
import Status from "../../Components/Status.jsx";
import ShowDataIfFound from "../../Components/ShowDataIfFound.jsx";
import Processing from "../../Components/Processing.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import { APP_URL } from "../../env/index.js";
import { Link } from "react-router-dom";
import Button from "../../Components/Button.jsx";
import { routes } from "../../routes/index.js";
import Action from "../../Components/Action.jsx";

const Index = () => {
const [users, setUsers] = useState([]);
const [isProcessing, setIsProcessing] = useState(false)

const tableColumns = [
  'Name',
  'Email',
  'Role',
  'Team',
  'Status',
  'Action'
]

  const fetchUsers = async () => {
    setIsProcessing(true)
    try {
      const { data } = await request.get(USERS)
      setUsers(data)
    }catch (error){
      console.log(error)
    }finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, []);

  const handleDelete = async (userId) => {
    try {
      const {data} = await request.delete(`${USERS}/${userId}`)
      console.log(data)
      fetchUsers()
    }catch (error){
      console.log(error)
    }
  }


  return (
    <Section>

      <Breadcrumbs>Users</Breadcrumbs>

      <div className="overflow-x-auto bg-base-100 text-base-content p-6">
        <Processing processing={isProcessing}>
          <ShowDataIfFound data={users?.data}>
            <Table tableColumns={tableColumns}>
              {
                users?.data?.map(user => (
                  <tr key={user.id}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox"/>
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={`${APP_URL}/storage/${user.avatar}`}
                              alt="Avatar Tailwind CSS Component"/>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {user.email}
                    </td>
                    <td>{user?.roles[0]?.name ?? 'N/A'}</td>
                    <td>
                      {user?.team?.name ?
                        <div className="badge badge-primary badge-outline">{user?.team?.name}</div>
                        :
                        <div className="badge badge-accent badge-outline">N/A</div>}
                    </td>
                    <td>
                    <Status data={user}/>
                    </td>
                    <td>
                      <Action data={user} url={routes.users} handleDelete={handleDelete}/>
                    </td>
                  </tr>
                ))
              }
            </Table>
          </ShowDataIfFound>
        </Processing>

      </div>
    </Section>
  )
}
export default Index
