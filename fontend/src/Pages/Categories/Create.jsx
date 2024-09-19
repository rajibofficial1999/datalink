import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import From from "../../Components/From.jsx";
import Input from "../../Components/Input.jsx";
import { useState } from "react";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { useSelector } from "react-redux";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid/index.js";
import DefaultTooltip from "../../Components/DefaultTooltip.jsx";
import { DOMAINS } from "../../utils/api-endpoint.js";
import { successToast } from "../../utils/toasts/index.js";
import ClipboardData from "../../Components/ClipboardData.jsx";

const Create = () => {
  const user = useSelector((state) => state.auth?.user)
  const [errors, setErrors] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const [domain, setDomain] = useState('')
  const [skypeUrl, setSkypeUrl] = useState('')
  const [screenshot, setScreenshot] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)

    // Create a FormData object
    const formData = new FormData();
    formData.append('domain', domain);
    formData.append('skype_url', skypeUrl);

    if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    try {
      const { data } = await request.post(DOMAINS, formData);
      successToast(data.success)
      setDomain('')
      setSkypeUrl('')

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

  return (
    <>
      <Section>
        <Breadcrumbs>Create Domain</Breadcrumbs>
        <div className='bg-base-100 text-base-content w-full md:max-w-3xl mx-auto mt-5 p-10'>
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
                <ClipboardData value='ssssss'>
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
        </div>
      </Section>
    </>
  )
}
export default Create
