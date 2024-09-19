import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import { useState } from "react";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { NOTICES } from "../../utils/api-endpoint.js";
import { successToast } from "../../utils/toasts/index.js";

const Index = () => {

  const [isProcessing, setIsProcessing] = useState(false)

  const [body, setBody] = useState('')
  const [errors, setErrors] = useState([])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)
    try {
      const { data } = await request.post(NOTICES, {
        body: body
      });

      successToast(data.success)
      setBody('')

    } catch (error) {
      if (error.response) {
        if(error.response.data?.errors){
          setErrors(error.response.data.errors);
        }
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
       <InnerSection heading='Create a New Notice'>
         <div className='w-full md:max-w-4xl mx-auto mt-10'>
           <DefaultForm onSubmit={handleSubmit}>
             <textarea
               className="textarea textarea-primary w-full"
               placeholder="Notice Body"
               cols='8'
               rows='8'
               value={body}
               onChange={(e) => setBody(e.target.value)}
             ></textarea>
             {
               errors?.body && <p className='text-red-500'>{errors.body}</p>
             }
             <div className='w-full flex justify-end items-center mt-3'>
               <Button proccessing={isProcessing}>Submit</Button>
             </div>
           </DefaultForm>
         </div>
       </InnerSection>
     </Section>
   </>
  )
}
export default Index
