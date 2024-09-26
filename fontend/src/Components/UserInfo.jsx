import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShowDataIfFound from "./ShowDataIfFound.jsx";
import Table from "./Table.jsx";
import TableCheckbox from "./TableCheckbox.jsx";
import { APP_URL } from "../env/index.js";
import TabContent from "./TabContent.jsx";
import TabItem from "./TabItem.jsx";
import Action from "./Action.jsx";
import { routes } from "../routes/index.js";
import Pagination from "./Pagination.jsx";
import Processing from "./Processing.jsx";
import LoadImage from "./LoadImage.jsx";
import request from "../utils/request.js";
import { USER_STATUS, USERS } from "../utils/api-endpoint.js";
import { successToast } from "../utils/toasts/index.js";
import ForSuperAdmin from "./ForSuperAdmin.jsx";
import { handleMultipleDelete } from "../utils/index.js";
import Badge from "./Badge.jsx";

const UserInfo = ({ fetchPendingUser }) => {
  const authUser = useSelector(state => state.auth.user);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const defaultTableColumns = ['Name', 'Email', 'Role', 'Team', 'Verified', 'Status', 'Action'];
  const [tableColumns, setTableColumns] = useState(defaultTableColumns);

  const fetchUsers = async (page = currentPage) => {
    let url = fetchPendingUser === true ? `${USERS}/pending?page=${page}` : `${USERS}?page=${page}`

    setIsProcessing(true);
    try {
      const { data } = await request.get(url);
      setUsers(data.users);
      setStatus(data.status);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const pageRefresh = async () => await fetchUsers(currentPage);

  const handleDelete = async (userId) => {
    setIsProcessing(true);
    try {
      const { data } = await request.delete(`${USERS}/${userId}`);
      successToast(data.success);
      await pageRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatus = async (user, value) => {
    if (user.status === value) return;

    setIsProcessing(true);
    try {
      const { data } = await request.put(`${USER_STATUS}/${user.id}`, { status: value });
      successToast(data.success);
      await pageRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePagination = async (page) => {
    setCurrentPage(page);
    await fetchUsers(page);
  };


  const handleCheckedItems = async () => {
    setIsProcessing(true)
    await handleMultipleDelete('users')
    await fetchUsers(currentPage)
    setIsProcessing(false)
  }

  const filterStatus = (domainStatus) => {
    switch (domainStatus) {
      case 'approved':
      case 'suspended':
        return status.filter(item => item !== 'pending' && item !== 'rejected');
      case 'rejected':
        return status.filter(item => item !== 'pending');
      case 'pending':
        return status.filter(item => item !== 'suspended');
      default:
        return status;
    }
  };

  useEffect(() => {
    pageRefresh();
  }, []);

  useEffect(() => {
    if (!authUser.is_super_admin) {
      setTableColumns(prev => prev.filter(col => col !== 'Team' && col !== 'Role'));
    }
  }, [authUser]);

  return (
    <Processing processing={isProcessing}>
      <ShowDataIfFound data={users?.data}>
        <Table tableColumns={tableColumns} handleCheckedItems={handleCheckedItems}>
          {users?.data?.map(user => (
            <tr key={user.id}>
              <th>
                <TableCheckbox value={user.id} />
              </th>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <LoadImage src={`${APP_URL}/storage/${user.avatar}`} alt={user.name} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-nowrap">{user.name}</div>
                  </div>
                </div>
              </td>
              <td>{user.email}</td>
              <ForSuperAdmin user={authUser}>
                <td className="text-nowrap">{user?.roles[0]?.name ?? 'N/A'}</td>
                <td>
                  {user?.team?.name ? (
                    <Badge className="badge-primary badge-outline">{user.team.name}</Badge>
                  ) : (
                    <div className="text-warning">N/A</div>
                  )}
                </td>
              </ForSuperAdmin>
              <td>
                {
                  user.email_verified_at ? <div className='badge badge-primary text-nowrap'>{user.verified_date}</div> :
                    <span className='badge badge-warning'>N/A</span>
                }
              </td>
              <td>
              <TabContent>
                  {filterStatus(user.status).map((item, index) => (
                    <TabItem
                      key={index}
                      isSelected={item === user.status}
                      text={item}
                      onClick={() => handleStatus(user, item)}
                    />
                  ))}
                </TabContent>
              </td>
              <td>
                <Action data={user} url={routes.users} handleDelete={handleDelete} />
              </td>
            </tr>
          ))}
        </Table>
        <Pagination
          data={users}
          handlePagination={handlePagination}
          currentPage={currentPage}
        />
      </ShowDataIfFound>
    </Processing>
  );
};

export default UserInfo;
