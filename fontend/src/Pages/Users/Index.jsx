import Table from "../../Components/Table.jsx";
import { useEffect, useState } from "react";
import request from "../../utils/request.js";
import { USERS } from "../../utils/api-endpoint.js";
import Badge from "../../Components/Badge.jsx";
import Dropdown from "../../Components/Dropdown.jsx";
import { MenuItem } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid/index.js";
import DropdownItem from "../../Components/DropdownItem.jsx";

const Index = () => {
const [users, setUsers] = useState([]);

const tableColumns = [
  'Name and Username',
  'Email',
  'Role',
  'Status',
  'Action'
]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await request.get(USERS)
        console.log(data)
        setUsers(data)
      }catch (error){
        console.log(error)
      }
    }

    fetchUsers()

  }, []);


  return (
    <div className="overflow-x-auto bg-base-300 p-6">
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
                        src={user.avatar}
                        alt="Avatar Tailwind CSS Component"/>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm opacity-50">{user.username}</div>
                  </div>
                </div>
              </td>
              <td>
                {user.email}
              </td>
              <td>user role</td>
              <td>
                {
                  user.status === 'pending' && <Badge className='badge-warning'>Pending</Badge>
                }
                {
                  user.status === 'approved' && <Badge className='badge-success'>Approved</Badge>
                }
                {
                  user.status === 'suspended' && <Badge className='badge-error'>Suspended</Badge>
                }
                {
                  user.status === 'rejected' && <Badge className='badge-error'>Rejected</Badge>
                }
              </td>
              <td>
                <Dropdown>
                  <DropdownItem href='/sdfdsfsdf'>
                    <PencilIcon className="size-4" />
                    Edit
                  </DropdownItem>
                  <DropdownItem as='button'>
                    <TrashIcon className="size-4" />
                    Delete
                  </DropdownItem>
                </Dropdown>
              </td>
            </tr>
          ))
        }
      </Table>
    </div>
  )
}
export default Index
