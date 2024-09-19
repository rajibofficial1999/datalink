import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import From from "../../Components/From.jsx";
import Input from "../../Components/Input.jsx";
import { useEffect, useState } from "react";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { useDispatch, useSelector } from "react-redux";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid/index.js";
import DefaultTooltip from "../../Components/DefaultTooltip.jsx";
import { DOMAIN_UPDATE, DOMAINS } from "../../utils/api-endpoint.js";
import { useParams } from "react-router-dom";
import Processing from "../../Components/Processing.jsx";
import { successToast } from "../../utils/toasts/index.js";
import ClipboardData from "../../Components/ClipboardData.jsx";

const Create = () => {
  const user = useSelector((state) => state.auth?.user)
  const [errors, setErrors] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDataProcessing, setDataProcessing] = useState(false)
  const [editDomain, setEditDomain] = useState(false)
  const params = useParams()

  const [domain, setDomain] = useState('')
  const [skypeUrl, setSkypeUrl] = useState('')
  const [screenshot, setScreenshot] = useState('')

  const getDomain = async () => {
    setDataProcessing(true)
    try {
      const {data} = await request.get(`${DOMAINS}/${params.id}`)
      setEditDomain(data)
      setDomain(data?.name)
      setSkypeUrl(data?.skype_url)
    }catch (error){
      console.log(error)
    }finally {
      setDataProcessing(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)

    // Create a FormData object
    const formData = new FormData();
    formData.append('domain', domain);
    formData.append('skype_url', skypeUrl);
    formData.append('domain_id', editDomain?.id);

    if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    try {
      const { data } = await request.post(DOMAIN_UPDATE, formData);
      successToast(data.success)

    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.errors);
      } else {
        console.log('An error occurred');
      }
    }finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    getDomain()
  }, []);


  return (
    <>
      <Section>
        <Breadcrumbs>Create Domain</Breadcrumbs>
        <div className='bg-base-100 text-base-content w-full md:max-w-3xl mx-auto mt-5 p-10'>
          <Processing processing={isDataProcessing}>
            <From onSubmit={handleSubmit}>
              <Input
                type='text'
                placeholder='www.example.com'
                label='Valid Domain'
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                error={errors?.domain ?? errors.error}
              />

              <Input
                type='text'
                placeholder='live:.cid.96776b7575454d5a'
                label='Skype ID'
                value={skypeUrl}
                onChange={(e) => setSkypeUrl(e.target.value)}
                error={errors?.skype_url ?? errors.error}
              />

              <div className='mt-2'>
                <label htmlFor='screenshot' className="text-sm">Binance ID (Click to copy)</label>
                <DefaultTooltip value='Copy Binance ID' className='w-full'>
                  <ClipboardData value='54221212'>
                    <button type='button'
                            className='mt-2 input input-bordered input-primary w-full flex justify-center items-center group'>
                      <DocumentDuplicateIcon className='size-8 text-blue-600 group-hover:scale-75 duration-200'/>
                    </button>
                  </ClipboardData>
                </DefaultTooltip>
              </div>

              <div className='mt-2'>
                <label htmlFor='screenshot' className="text-sm">Payment Screenshot</label>
                <input
                  id='screenshot'
                  type="file"
                  className="file-input file-input-bordered w-full input-primary mt-2"
                  onChange={(e) => setScreenshot(e.target.files[0])}
                />
                {errors?.screenshot && <p className='text-red-500 mt-1 mb-3'>{errors?.screenshot}</p>}
              </div>

              <div className='flex justify-end mt-4'>
                <Button type='submit' proccessing={isProcessing} className='w-24'>Submit</Button>
              </div>

            </From>
          </Processing>
        </div>
      </Section>
    </>
  )
}
export default Create
