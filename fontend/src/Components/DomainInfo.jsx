import ShowDataIfFound from "./ShowDataIfFound.jsx";
import Table from "./Table.jsx";
import TableCheckbox from "./TableCheckbox.jsx";
import { APP_URL } from "../env/index.js";
import BadgeLarge from "./BadgeLarge.jsx";
import TabContent from "./TabContent.jsx";
import TabItem from "./TabItem.jsx";
import Action from "./Action.jsx";
import { routes } from "../routes/index.js";
import DefaultTooltip from "./DefaultTooltip.jsx";
import Button from "./Button.jsx";
import { PlusIcon } from "@heroicons/react/24/solid/index.js";
import Pagination from "./Pagination.jsx";
import Processing from "./Processing.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import request from "../utils/request.js";
import { DOMAIN_STATUS, DOMAINS } from "../utils/api-endpoint.js";
import { successToast } from "../utils/toasts/index.js";
import WebsiteUrlModal from "./WebsiteUrlModal.jsx";
import LoadImage from "./LoadImage.jsx";
import ForSuperAdmin from "./ForSuperAdmin.jsx";
import Badge from "./Badge.jsx";
import { handleMultipleDelete } from "../utils/index.js";

const DomainInfo = ({ url }) => {
  const authUser = useSelector(state => state.auth.user);
  const [domains, setDomains] = useState([]);
  const [status, setStatus] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [approveDomain, setApproveDomain] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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
    try {
      const { data } = await request.get(`${url}?page=${page}`);
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

    if (value === 'approved') {
      handleWebsiteUrlModal(domain)
      return;
    }

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

  const handleWebsiteUrlModal = (domain) => {
    setApproveDomain(domain)
    document.getElementById('modal-lg').showModal()
  }

  const renderTableRows = () => {
    return domains?.data?.map(domain => (
      <tr key={domain.id}>
        <th>
          <TableCheckbox value={domain.id} />
        </th>
        <td>
          <div className="flex items-center gap-3">
            <div className="font-bold">{domain.name}</div>
          </div>
        </td>
        <td>
          <LoadImage className='size-14 rounded-md' src={`${APP_URL}/storage/${domain.screenshot}`} alt="screenshot" />
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
        {authUser?.is_admin && (
          <td>
            <Badge className={cn('badge-info text-white', domain.status === 'pending' && 'badge-warning')}>
              {domain.status}
            </Badge>
          </td>
        )}
        <td>
          <Action data={domain} url={routes.domains} handleDelete={handleDelete}>
            {domain.status === 'approved' && authUser.is_super_admin && (
              <DefaultTooltip value='Add Urls'>
                <Button onClick={() => handleWebsiteUrlModal(domain)} type='button' className='bg-green-600 hover:bg-green-700 duration-200'>
                  <PlusIcon className='size-4' />
                </Button>
              </DefaultTooltip>
            )}
          </Action>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <WebsiteUrlModal domain={approveDomain} pageRefresh={fetchDomains} />
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
