import ShowDataIfFound from "./ShowDataIfFound.jsx";
import Table from "./Table.jsx";
import TableCheckbox from "./TableCheckbox.jsx";
import BadgeLarge from "./BadgeLarge.jsx";
import TabContent from "./TabContent.jsx";
import TabItem from "./TabItem.jsx";
import Action from "./Action.jsx";
import { routes } from "../routes/index.js";
import Pagination from "./Pagination.jsx";
import Processing from "./Processing.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import request from "../utils/request.js";
import { ORDERS, ORDERS_STATUS } from "../utils/api-endpoint.js";
import { successToast } from "../utils/toasts/index.js";
import LoadImage from "./LoadImage.jsx";
import ForSuperAdmin from "./ForSuperAdmin.jsx";
import Badge from "./Badge.jsx";
import { cn, handleMultipleDelete } from "../utils/index.js";

const OrderInfo = ({ fetchPendingOrder }) => {
  const APP_URL = import.meta.env.VITE_API_URL;
  const authUser = useSelector(state => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableColumns, setTableColumns] = useState([
    'Package',
    'Payment Screenshot',
    'Amount',
    'period',
    'User',
    'Status',
    'Date',
    'Action'
  ]);
  

  useEffect(() => {
    if (!authUser.is_super_admin) {
      setTableColumns(prevStates => prevStates.filter(item => item.toLowerCase() !== 'user' && item.toLowerCase() !== 'role'));
    }
  }, [authUser]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    setIsProcessing(true);
    let url = fetchPendingOrder === true ? `${ORDERS}/pending?page=${page}` : `${ORDERS}?page=${page}`
    try {
      const { data } = await request.get(url);
      setOrders(data.orders);
      setStatus(data.status);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (orderId) => {
    setIsProcessing(true);
    try {
      const { data } = await request.delete(`${ORDERS}/${orderId}`);
      successToast(data.success);
      await fetchOrders(currentPage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (order, value) => {
    if (order.status === value) return;

    setIsProcessing(true);
    try {
      const { data } = await request.put(`${ORDERS_STATUS}/${order.id}`, { status: value });
      successToast(data.success);
      await fetchOrders(currentPage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filterStatus = (status, orderStatus) => {

    if (orderStatus === 'confirmed') {
      return status.filter(item => item !== 'pending' && item !== 'rejected');
    }

    if (orderStatus === 'rejected') {
      return status.filter(item => item !== 'pending' && item !== 'confirmed');
    }
    
    return status;
    
  };

  const handleCheckedItems = async () => {
    setIsProcessing(true)
    await handleMultipleDelete('orders')
    await fetchOrders(currentPage)
    setIsProcessing(false)
  }

  const renderTableRows = () => {
    return orders?.data?.map(order => (
      <tr key={order.id}>
        <th>
          <TableCheckbox value={order.id}/>
        </th>
        <td>
          <div className="font-bold capitalize">{order.package}</div>
        </td>
        <td>
          <LoadImage className='size-14 rounded-md' src={`${APP_URL}/storage/${order.payment_screenshot}`} alt="payment_screenshot"/>
        </td>
        <td>
          <p className="text-nowrap">{order.amount} BDT</p>
        </td>
        <td>
          <p className="text-nowrap">{order.period} Month</p>
        </td>
        <ForSuperAdmin user={authUser}>
          <td>
            <BadgeLarge>{order.user.name}</BadgeLarge>
          </td>
          <td>
            {
              order.status === 'pending' ?

              <TabContent>
                {filterStatus(status, order.status).map((item, index) => (
                  <TabItem
                    key={index}
                    onClick={() => handleStatusChange(order, item)}
                    isSelected={item === order.status}
                    text={item}
                  />
                ))}
              </TabContent>
                :
                
                <Badge className={cn('badge-error !text-white', order.status === 'confirmed' && '!badge-info')}> {order.status} </Badge>
            }
          </td>
        </ForSuperAdmin>
        <td>
          <p className="text-nowrap">{order.placed_time}</p>
        </td>
        {
          (authUser.is_admin == true || authUser.is_user == true) &&
          <td>
            <Badge className={cn('badge-info text-white', order.status === 'pending' && 'badge-warning', order.status === 'rejected' && 'badge-error')}>
              {order.status}
            </Badge>
          </td>
        }
        <td>
          <Action editLink={false} data={order} url={routes.orders} handleDelete={handleDelete} />
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Processing processing={isProcessing}>
        <ShowDataIfFound data={orders?.data}>
          <Table tableColumns={tableColumns} handleCheckedItems={handleCheckedItems}>
            {renderTableRows()}
          </Table>
          <Pagination
            data={orders}
            handlePagination={setCurrentPage}
            currentPage={currentPage}
          />
        </ShowDataIfFound>
      </Processing>
    </>
  );
};

export default OrderInfo;
