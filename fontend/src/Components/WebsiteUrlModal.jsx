import HeadlessSelectInput from "./HeadlessSelectInput.jsx";
import { Input as HeadlessInput } from '@headlessui/react'
import { cn } from "../utils/index.js";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid/index.js";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, WEBSITE_URLS } from "../utils/api-endpoint.js";
import request from "../utils/request.js";
import { successToast } from "../utils/toasts/index.js";

const WebsiteUrlModal = ({domain, pageRefresh}) => {

  const [inputs, setInputs] = useState([''])
  const [isProcessing, setIsProcessing] = useState(false)
  const [services, setServices] = useState({})
  const [endpoints, setEndpoints] = useState({})
  const [categories, setCategories] = useState([])
  const modalDismissForm = useRef(null)
  const [errors, setErrors] = useState([])

  const fetchCategories = async () => {
    try {
      const { data } = await request.get(CATEGORIES)
      setCategories(data?.data)
    }catch (error){
      console.log(error)
    }
  }

  const handleInputs = (uid) => {
    if(uid === ''){
      let uniqueId = uuidv4();
      setInputs([...inputs, uniqueId])
    }else{
      setInputs((prevInputs) => prevInputs.filter((input) => uid !== input))

      setServices(prev => {
        const { [uid]: _, ...rest } = prev;
        return rest;
      });

      setEndpoints(prev => {
        const { [uid]: _, ...rest } = prev;
        return rest;
      });

    }
  }

  const handleServiceChange = (uid, value) => {
    setServices(prev => ({
      ...prev,
      [uid]: value
    }));
  };

  const handleEndpointChange = (uid, value) => {
    setEndpoints(prev => ({
      ...prev,
      [uid]: value
    }));
  };

  const modalDismiss = () => {
    setInputs([''])
    setServices({})
    setEndpoints({})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)

    let endpointValues = Object.values(endpoints);
    let servicesValues = Object.values(services);

    try {
      const { data } = await request.post(WEBSITE_URLS, {
        endpoints: endpointValues,
        categories: servicesValues,
        domain: domain?.id
      })
      successToast(data.success)
      modalDismissForm.current.submit()
      pageRefresh()
      modalDismiss()
    }catch (error){
      if(error.response){
        setErrors(Object.values(error.response.data.errors))
      }else {
        console.error('something wrong!')
      }
    }finally {
      setIsProcessing(false)
    }
  }

  const makeUrl = (domain, endpoint = null) => {

    if(endpoint){
      if(!endpoint.startsWith('/')){
        endpoint = "/" + endpoint
      }
    }else{
      endpoint = ''
    }

    return `https://${domain?.name + endpoint}/${domain?.user?.access_token}`
  }

  useEffect(() => {
    fetchCategories()
  }, []);

  return (
    <>
      <dialog id="modal-lg" className="modal">
        <div className="modal-box w-11/12 max-w-3xl">
          <h1 className='text-center mt-4 text-xl font-semibold'>Create Website URL</h1>
          <div className='p-5 md:p-10'>

            {
              errors.length > 0 &&
              <ul className='flex flex-col justify-center items-center mb-4 list-disc'>
                {
                  errors.map((error, index) => <li key={index} className='text-red-600'>{error[0]}</li>)
                }
              </ul>
            }

            {
              inputs.map((item) => (
                <div key={item} className='bg-base-100 text-base-content w-full mt-3 grid grid-cols-6 gap-2'>
                  <HeadlessSelectInput
                    options={categories}
                    className='col-span-2'
                    onChange={(e) => handleServiceChange(item, e.target.value)}
                  />
                  <HeadlessInput
                    placeholder='/endpoint'
                    className='border border-primary py-1 px-3 focus:outline-none w-full col-span-3 rounded-md '
                    type="text"
                    onChange={(e) => handleEndpointChange(item, e.target.value)}
                    value={endpoints[item] || ''}
                  />
                  <button
                    disabled={isProcessing}
                    className={cn('duration-200 flex justify-center items-center text-sm col-span-1 text-white rounded-md ', item === '' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-red-700 hover:bg-red-800')}
                    onClick={() => handleInputs(item)}
                  >
                    {item === '' ? <PlusIcon className='size-6'/> : <MinusIcon className='size-6'/>}
                  </button>
                  {
                    endpoints[item] ? <DemoUrl url={makeUrl(domain, endpoints[item])}/> : <DemoUrl url={makeUrl(domain)}/>
                  }
                </div>
              ))
            }

          </div>
          <div className="modal-action">
            <button disabled={isProcessing} className='btn bg-blue-700 text-white py-1 hover:bg-blue-800 duration-200'
                    onClick={handleSubmit}>
            {isProcessing ? <span className="loading loading-spinner"></span> : 'Submit'}
            </button>
            <form method="dialog" ref={modalDismissForm}>
              <button onClick={modalDismiss} className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

    </>
  )
}

const DemoUrl = ({url}) => {
  return (
    <small className='flex items-center gap-1 mb-2'>
      <span className='font-bold'>Ex: </span>
      <span className='italic font-semibold text-blue-500'>{url}</span>
    </small>
  )
}

export default WebsiteUrlModal
