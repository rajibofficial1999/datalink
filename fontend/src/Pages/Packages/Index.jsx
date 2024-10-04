import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import { CheckCircleIcon, DocumentDuplicateIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Button from "../../Components/Button.jsx";
import { ORDERS, PACKAGES } from "../../utils/api-endpoint.js";
import { useEffect, useRef, useState } from "react";
import request from "../../utils/request.js";
import ShowDataIfFound from "../../Components/ShowDataIfFound.jsx";
import Processing from "../../Components/Processing.jsx";
import { cn } from "../../utils/index.js";
import Badge from "../../Components/Badge.jsx";
import Modal from "../../Components/Modal.jsx";
import DefaultForm from "../../Components/DefaultForm.jsx";
import DefaultTooltip from "../../Components/DefaultTooltip.jsx";
import ClipboardData from "../../Components/ClipboardData.jsx";
import FileInput from "../../Components/FileInput.jsx";
import { useSelector } from "react-redux";
import SelectInput from "../../Components/SelectInput.jsx";
import { successToast } from "../../utils/toasts/index.js";

const Index = () => {

  const [packages, setPackages] = useState([])
  const [processing, setIsProcessing] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [periods, setPeriods] = useState([1,2,3,6])
  const [selectedPeriod, setSelectedPeriod] = useState(1)
  
  const fetchPackages = async () => {
    setIsProcessing(true);
    try {
      const { data } = await request.get(PACKAGES);
      setPackages(data);
      setSelectedPackage(data[0])
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

    const showOrderForm = () => {
    document.querySelector('.order-modal').showModal();
  };

  useEffect(() => {
    fetchPackages()
  }, [])

  return (
    <Section>

      <OrderModal selectedPackage={selectedPackage} selectedPeriod={ selectedPeriod} />
      
      <InnerSection heading='Packages'>
        <ShowDataIfFound data={packages}>
          <Processing processing={processing}>
            <div className="grid grid-cols-1 sm:grid-cols-3 border rounded-lg border-base-300">
              <div className="col-span-2 flex justify-start flex-col m-4">

                <h1 className="my-4 font-semibold">Choose a pricing plan:</h1>

                <div className="flex justify-start items-start">
                  {
                    packages?.map((pkg) => (
                      <button 
                        key={pkg.name} 
                        type="button" 
                        className={cn("py-2 px-2 md:py-3 md:px-4 w-full border-y border-l border-base-300 last:border-r last:rounded-r-xl first:rounded-l-xl capitalize", pkg.name === selectedPackage.name && 'bg-base-300')}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        {pkg.name}
                      </button>
                    ))
                  }
                </div>
                <ul className="mt-4">
                  <h1 className="my-1 font-semibold mb-2">Details: </h1>
                  <li className="flex justify-start items-center gap-1 mt-1">
                    <div className="flex justify-start items-center gap-1 max-w-[160px] w-full">
                      <CheckCircleIcon className="size-4 text-green-500" />
                      <span>Role: </span>
                    </div>
                    <Badge className='bg-blue-600 text-white'>{selectedPackage?.role}</Badge>
                  </li>
                  <li className="flex justify-start items-center gap-1 mt-1">
                    <div className="flex justify-start items-center gap-1 max-w-[160px] w-full">
                      <CheckCircleIcon className="size-4 text-green-500" />
                      <span>Sites: </span>
                    </div>
                    <div>
                      {
                        selectedPackage?.sites?.map(site => (
                          <Badge className="uppercase badge-info text-white mr-1" key={site}>{site}</Badge>
                        ))
                      }
                    </div>
                  </li>
                  <li className="flex justify-start items-center gap-1 mt-1">
                    <div className="flex justify-start items-center gap-1 max-w-[160px] w-full">

                      {
                        selectedPackage?.team ?
                          <CheckCircleIcon className="size-4 text-green-500" />
                          :
                          <XCircleIcon className="size-4 text-red-500" />
                      }
                      <span>Team: </span>
                    </div>

                      { selectedPackage?.team ? <p>{selectedPackage?.team} Members</p> : <Badge className='badge-warning'>No</Badge> }
                    
                  </li>
                  <li className="flex justify-start items-center gap-1 mt-1">
                    <div className="flex justify-start items-center gap-1 max-w-[160px] w-full">
                      {
                        selectedPackage?.custom_domain ?
                          <CheckCircleIcon className="size-4 text-green-500" />
                          :
                          <XCircleIcon className="size-4 text-red-500" />
                      }
                      <span>Custom Domains: </span>
                    </div>
                      { selectedPackage?.custom_domain ? <p>Yes</p> : <Badge className='badge-warning'>No</Badge> }
                  </li>
                </ul>
              </div>
              <div className="col-span-1 sm:border-l sm:border-base-300">
                  <div className="m-4">
                  <h1 className="text-2xl capitalize">{selectedPackage?.name }</h1>
                  <div className="my-4">
                    <p className="text-sm">Starts at</p>
                    <div className="flex items-end gap-2">
                      <h1 className="text-2xl font-bold">{(selectedPackage?.price * parseInt(selectedPeriod))} BDT</h1>
                      <span>/month</span>
                    </div>
                  </div>
                  <div>
                    <SelectInput
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                      {
                        periods.map(period => (
                          <option key={period} value={period}>{period} Month</option>
                        ))
                      } 
                    </SelectInput>
                  </div>
                    <Button onClick={showOrderForm} className="w-full mt-5">Buy Now</Button>
                  </div>
              </div>
            </div>
          </Processing>
        </ShowDataIfFound>
      </InnerSection>
    </Section>
  )
}

const OrderModal = ({selectedPackage, selectedPeriod}) => {
  const authUser = useSelector(state => state.auth.user)
  const [modalClose, setModalClose] = useState(false)
  const [paymentScreenshot, setPaymentScreenshot] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [binanceId] = useState(215454454514);
  const [errors, setErrors] = useState()
  const fileInputRef = useRef(null)

    

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    const formData = new FormData()
    formData.append('user_id', authUser.id)
    formData.append('package', selectedPackage.name)
    formData.append('amount', selectedPackage.price * parseInt(selectedPeriod))
    formData.append('period', selectedPeriod)
    formData.append('payment_screenshot', paymentScreenshot)

    try {
      const { data } = await request.post(ORDERS, formData);
      if (data.success) {
        setErrors({});
        setModalClose(true)
        successToast(data.success);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      if(error.response){
        setErrors(error.response.data.errors)
      }else{
        console.log(error)
      }
    }finally {
      setIsProcessing(false)
    }
  }  

  return (
    <Modal modalClose={modalClose} className='order-modal'>
      <DefaultForm onSubmit={handleSubmit}>
        <div className='mt-2'>
          <label htmlFor='screenshot' className="text-sm">Binance ID ({binanceId})</label>
          <DefaultTooltip value='Copy Binance ID' className='w-full'>
            <ClipboardData value={binanceId}>
              <button type='button'
                      className='mt-2 input input-bordered input-primary w-full flex justify-center items-center group'>
                <DocumentDuplicateIcon className='size-8 text-blue-600 group-hover:scale-75 duration-200'/>
              </button>
            </ClipboardData>
          </DefaultTooltip>
        </div>
        <div className='mt-2'>
          <label htmlFor='payment_screenshot' className="text-sm">Payment Screenshot</label>
          <FileInput
            id='payment_screenshot'
            onChange={(e) => setPaymentScreenshot(e.target.files[0])}
            fileInputRef={fileInputRef}
            error={errors?.payment_screenshot}
          />
          {errors?.payment_screenshot && <p className='text-red-500 mt-1 mb-3'>{errors?.payment_screenshot}</p>}
        </div>
        <div className='flex justify-end mt-4'>
          <Button type='submit' proccessing={isProcessing} className='w-24'>Submit</Button>
        </div>
      </DefaultForm>
    </Modal>
  )
}

export default Index
