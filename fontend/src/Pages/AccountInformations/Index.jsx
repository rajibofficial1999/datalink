import Table from "../../Components/Table.jsx";
import { useEffect, useState } from "react";
import request from "../../utils/request.js";
import { DOMAIN_STATUS, DOMAINS, PENDING_DOMAINS } from "../../utils/api-endpoint.js";
import Section from "../../Components/Section.jsx";
import Processing from "../../Components/Processing.jsx";
import ShowDataIfFound from "../../Components/ShowDataIfFound.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import { APP_URL } from "../../env/index.js";
import Action from "../../Components/Action.jsx";
import { routes } from "../../routes/index.js";
import { successToast } from "../../utils/toasts/index.js";
import TabContent from "../../Components/TabContent.jsx";
import TabItem from "../../Components/TabItem.jsx";
import WebsiteUrlModal from "../../Components/WebsiteUrlModal.jsx";
import BadgeLarge from "../../Components/BadgeLarge.jsx";


const Index = () => {

const [domains, setDomains] = useState([]);
const [status, setStatus] = useState([]);
const [isProcessing, setIsProcessing] = useState(false)
const [approveDomain, setApproveDomain] = useState(null)


const tableColumns = [
  'Domain',
  'Payment Screenshot',
  'Amount',
  'User',
  'Status',
  'Action'
]

  const fetchDomains = async () => {
    setIsProcessing(true)
    try {
      const { data } = await request.get(PENDING_DOMAINS)
      setDomains(data.domains)
      setStatus(data.status)
    }catch (error){
      console.log(error)
    }finally {
      setIsProcessing(false)
    }
  }


  const handleDelete = async (domainId) => {
    setIsProcessing(true)
    try {
      const {data} = await request.delete(`${DOMAINS}/${domainId}`)
      successToast(data.success)
      fetchDomains()
    }catch (error){
      console.log(error)
    }finally {
      setIsProcessing(true)
    }
  }

  const handleStatus = async (domain, value) => {

    if(domain.status === value){
      return false
    }

    if(value === 'approved'){
      setApproveDomain(domain)
      document.getElementById('modal-lg').showModal()
      return false
    }

    setIsProcessing(true)
    try {
      const { data } = await request.put(`${DOMAIN_STATUS}/${domain.id}`, {
        status : value
      })

      successToast(data.success)

      fetchDomains()
    }catch (error){
      console.log(error)
      setIsProcessing(false)
    }
  }

const pageRefresh = () => {
  fetchDomains()
}

  useEffect(() => {
    fetchDomains()

  }, []);


  return (
    <Section>
      <Breadcrumbs>Domains</Breadcrumbs>

      <WebsiteUrlModal domain={approveDomain} pageRefresh={pageRefresh}/>

      <div className="overflow-x-auto bg-base-100 text-base-content p-6">
        <Processing processing={isProcessing}>
          <ShowDataIfFound data={domains?.data}>
            <Table tableColumns={tableColumns}>
              {domains?.data?.map(domain => (
                <tr key={domain.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox"/>
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{domain.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <img className='size-14 rounded-md' src={`${APP_URL}/storage/${domain.screenshot}`} alt="screenshot"/>
                  </td>
                  <td>
                    $<span>{domain.amount}</span>
                  </td>
                  <td>
                    <BadgeLarge>{domain?.user.name}</BadgeLarge>
                  </td>
                  <td>
                    <TabContent>
                      {
                        status.map((item, index) => <TabItem onClick={() => handleStatus(domain, item)} key={index} isSelected={item == domain.status} text={item}/>)
                      }
                    </TabContent>
                  </td>
                  <td>
                    <Action data={domain} url={routes.domains} handleDelete={handleDelete}/>
                  </td>
                </tr>
              ))}
            </Table>
          </ShowDataIfFound>
        </Processing>
      </div>
    </Section>
  )
}
export default Index
