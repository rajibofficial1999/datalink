import Table from "../../Components/Table.jsx";
import { useEffect, useState } from "react";
import request from "../../utils/request.js";
import { DOMAINS, USERS } from "../../utils/api-endpoint.js";
import Badge from "../../Components/Badge.jsx";
import Dropdown from "../../Components/Dropdown.jsx";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid/index.js";
import DropdownItem from "../../Components/DropdownItem.jsx";
import Section from "../../Components/Section.jsx";
import Processing from "../../Components/Processing.jsx";
import ShowDataIfFound from "../../Components/ShowDataIfFound.jsx";
import Status from "../../Components/Status.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import { APP_URL } from "../../env/index.js";
import Action from "../../Components/Action.jsx";
import { routes } from "../../routes/index.js";

const Index = () => {
const [domains, setDomains] = useState([]);
const [isProcessing, setIsProcessing] = useState(false)

const tableColumns = [
  'Domain',
  'Screenshot',
  'Amount',
  'Status',
  'Action'
]

  const fetchDomains = async () => {
    setIsProcessing(true)
    try {
      const { data } = await request.get(DOMAINS)
      setDomains(data)
    }catch (error){
      console.log(error)
    }finally {
      setIsProcessing(false)
    }
  }


  const handleDelete = async (domainId) => {
    try {
      const {data} = await request.delete(`${DOMAINS}/${domainId}`)
      console.log(data)
      fetchDomains()
    }catch (error){
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDomains()

  }, []);


  return (
    <Section>
      <Breadcrumbs>Domains</Breadcrumbs>

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
                    <Status data={domain}/>
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
