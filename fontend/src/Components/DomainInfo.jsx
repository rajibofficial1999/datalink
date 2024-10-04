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
import { DOMAIN_STATUS, DOMAINS } from "../utils/api-endpoint.js";
import { successToast } from "../utils/toasts/index.js";
import LoadImage from "./LoadImage.jsx";
import ForSuperAdmin from "./ForSuperAdmin.jsx";
import Badge from "./Badge.jsx";
import { cn, handleMultipleDelete } from "../utils/index.js";
import ForAdminUser from "./ForAdminUser.jsx";
import Modal from "./Modal.jsx";

const DomainInfo = ({ fetchPendingDomain }) => {
  const APP_URL = import.meta.env.VITE_API_URL;
  const authUser = useSelector(state => state.auth.user);
  const [domains, setDomains] = useState([]);
  const [status, setStatus] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImageSrc, setselectedImageSrc] = useState(null)
  const [tableColumns, setTableColumns] = useState([
    'Domain',
    'Payment Screenshot',
    'Amount',
    'User',
    'Status',
    'Action'
  ]);

  useEffect(() => {
    if (!authUser.is_super_admin) {
      setTableColumns(prevStates => prevStates.filter(item => item.toLowerCase() !== 'user' && item.toLowerCase() !== 'role'));
    }
  }, [authUser]);

  useEffect(() => {
    fetchDomains(currentPage);
  }, [currentPage]);

  const fetchDomains = async (page) => {
    setIsProcessing(true);
    let url = fetchPendingDomain === true ? `${DOMAINS}/pending?page=${page}` : `${DOMAINS}?page=${page}`
    try {
      const { data } = await request.get(url);
      setDomains(data.domains);
      setStatus(data.status);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (domainId) => {
    setIsProcessing(true);
    try {
      const { data } = await request.delete(`${DOMAINS}/${domainId}`);
      successToast(data.success);
      await fetchDomains(currentPage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (domain, value) => {
    if (domain.status === value) return;

    setIsProcessing(true);
    try {
      const { data } = await request.put(`${DOMAIN_STATUS}/${domain.id}`, { status: value });
      successToast(data.success);
      await fetchDomains(currentPage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filterStatus = (status, domainStatus) => {
    return (domainStatus === 'approved' || domainStatus === 'rejected')
      ? status.filter(item => item !== 'pending')
      : status;
  };

  const handleCheckedItems = async () => {
    setIsProcessing(true)
    await handleMultipleDelete('domains')
    await fetchDomains(currentPage)
    setIsProcessing(false)
  }

  const handleViewImage = (src) => {
    setselectedImageSrc(src);
    document.querySelector('.imageModal').showModal();
  };

  const modalDismiss = () => {
    setselectedImageSrc(null);
  };

  const renderTableRows = () => {
    return domains?.data?.map(domain => (
      <tr key={domain.id}>
        <th>
          <TableCheckbox value={domain.id} />
        </th>
        <td>
          <div className="font-bold">{domain.name}</div>
        </td>
        <td>
          <LoadImage
            className='size-14 rounded-md cursor-pointer'
            onClick={() => handleViewImage(`${APP_URL}/storage/${domain.screenshot}`)}
            src={`${APP_URL}/storage/${domain.screenshot}`}
            alt="screenshot"
          />
        </td>
        <td>
          ${domain.amount ?? 0}
        </td>
        <ForSuperAdmin user={authUser}>
          <td>
            <BadgeLarge>{domain.user.name}</BadgeLarge>
          </td>
          <td>
            <TabContent>
              {filterStatus(status, domain.status).map((item, index) => (
                <TabItem
                  key={index}
                  onClick={() => handleStatusChange(domain, item)}
                  isSelected={item === domain.status}
                  text={item}
                />
              ))}
            </TabContent>
          </td>
        </ForSuperAdmin>
        <ForAdminUser user={authUser}>
          <td>
            <Badge className={cn('badge-info text-white', domain.status === 'pending' && 'badge-warning')}>
              {domain.status}
            </Badge>
          </td>
        </ForAdminUser>
        <td>
          <Action data={domain} url={routes.domains} handleDelete={handleDelete} />
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Modal className='imageModal' modalDismiss={modalDismiss}>
        <div className="py-7">
          <LoadImage
            className=' max-h-[70vh]'
            src={selectedImageSrc}
            alt="payment screenshot"
          />
        </div>  
      </Modal>
      <Processing processing={isProcessing}>
        <ShowDataIfFound data={domains?.data}>
          <Table tableColumns={tableColumns} handleCheckedItems={handleCheckedItems}>
            {renderTableRows()}
          </Table>
          <Pagination
            data={domains}
            handlePagination={setCurrentPage}
            currentPage={currentPage}
          />
        </ShowDataIfFound>
      </Processing>
    </>
  );
};

export default DomainInfo;
