import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Input from "../../Components/Input.jsx";
import { useState } from "react";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { CATEGORIES } from "../../utils/api-endpoint.js";
import { successToast } from "../../utils/toasts/index.js";
import SelectInput from "../../Components/SelectInput.jsx";

const Create = () => {
  const [errors, setErrors] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const [name, setName] = useState('')
  const [fullName, setFullName] = useState('')
  const [premium, setPremium] = useState(0)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)
    try {

      const { data } = await request.post(CATEGORIES, {
        name: name,
        full_name: fullName,
        is_premium: !!premium
      });

      successToast(data.success)
      setName('')
      setFullName('')
      setPremium(0)
      setErrors([])

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
        <Breadcrumbs>Create Service</Breadcrumbs>
        <div className='bg-base-100 text-base-content w-full md:max-w-3xl mx-auto mt-5 p-10'>
          <DefaultForm onSubmit={handleSubmit}>
            <Input
              type='text'
              placeholder='Service Name'
              label='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors?.name}
            />

            <Input
              type='text'
              placeholder='Service Full Name'
              label='Full Name (optional)'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors?.full_name}
            />
            <div className='mt-2'>
              <label htmlFor='screenshot' className="text-sm">Premium</label>
              <SelectInput
                className='col-span-2'
                onChange={(e) => setPremium(e.target.value)}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </SelectInput>
              {errors?.screenshot && <p className='text-red-500 mt-1 mb-3'>{errors?.screenshot}</p>}
            </div>

            <div className='flex justify-end mt-4'>
              <Button type='submit' proccessing={isProcessing} className='w-24'>Submit</Button>
            </div>

          </DefaultForm>
        </div>
      </Section>
    </>
  )
}

export default Create
