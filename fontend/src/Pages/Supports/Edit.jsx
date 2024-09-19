import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import { useRef, useState } from "react";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { SUPPORTS } from "../../utils/api-endpoint.js";
import { successToast } from "../../utils/toasts/index.js";
import Input from "../../Components/Input.jsx";
import FileInput from "../../Components/FileInput.jsx";

const Index = () => {

  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState([])
  const [heading, setHeading] = useState('')
  const [price, setPrice] = useState('')
  const [contactUrl, setContactUrl] = useState('')
  const [image, setImage] = useState('')


  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)

    // Create a FormData object
    const formData = new FormData();

    formData.append('heading', heading);
    formData.append('price', price);
    formData.append('contact_url', contactUrl);

    if (image) {
      formData.append('image', image);
    }

    try {
      const { data } = await request.post(SUPPORTS, formData);

      successToast(data.success)

      setHeading('')
      setPrice('')
      setContactUrl('')
      setErrors([])

    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.errors);
      } else {
        console.log('An error occurred');
      }
    }finally {
      setImage('')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the file input value
      }
      setIsProcessing(false)
    }
  }

  return (
   <>
     <Section>
       <InnerSection heading='Create Support'>
         <div className='w-full md:max-w-4xl mx-auto mt-10'>
           <DefaultForm onSubmit={handleSubmit}>
             <Input
               type='text'
               placeholder='Heading'
               label='Heading (Optional)'
               value={heading}
               onChange={(e) => setHeading(e.target.value)}
               error={errors?.heading ?? errors.heading}
             />

             <Input
               type='text'
               placeholder='Price'
               label='Support Price'
               value={price}
               onChange={(e) => setPrice(e.target.value)}
               error={errors?.price ?? errors.price}
             />

             <Input
               type='text'
               placeholder='Url'
               label='Contact Url'
               value={contactUrl}
               onChange={(e) => setContactUrl(e.target.value)}
               error={errors?.contact_url ?? errors.contact_url}
             />

             <div className='mt-2'>
               <label htmlFor='image' className="text-sm">Image</label>
               <FileInput
                 id='image'
                 onChange={(e) => setImage(e.target.files[0])}
                 fileInputRef={fileInputRef}
                 error={errors?.image}
               />
               {errors?.image && <p className='text-red-500 mt-1 mb-3'>{errors?.image}</p>}
             </div>

             <div className='flex justify-end mt-4'>
               <Button type='submit' proccessing={isProcessing} className='w-24'>Submit</Button>
             </div>

           </DefaultForm>
         </div>
       </InnerSection>
     </Section>
   </>
  )
}
export default Index
