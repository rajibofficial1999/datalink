import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Input from "../../Components/Input.jsx";
import { useEffect, useState } from "react";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { CATEGORIES } from "../../utils/api-endpoint.js";
import { useParams } from "react-router-dom";
import Processing from "../../Components/Processing.jsx";
import { successToast } from "../../utils/toasts/index.js";
import SelectInput from "../../Components/SelectInput.jsx";

const Create = () => {
  const [errors, setErrors] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDataProcessing, setDataProcessing] = useState(false)
  const [editCategory, setEditCategory] = useState(false)
  const params = useParams()

  const [name, setName] = useState('')
  const [fullName, setFullName] = useState('')
  const [premium, setPremium] = useState(0)

  const getCategory = async () => {
    setDataProcessing(true)
    try {
      const {data} = await request.get(`${CATEGORIES}/${params.id}`)
      setEditCategory(data)
      setName(data?.name)
      setFullName(data?.full_name)
      setPremium(data?.is_premium)
    }catch (error){
      console.log(error)
    }finally {
      setDataProcessing(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)

    try {
      const { data } = await request.put(`${CATEGORIES}/${editCategory.id}`, {
        name: name,
        full_name: fullName,
        is_premium: premium
      });

      successToast(data.success)
      setEditCategory(data.category)
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

  useEffect(() => {
    getCategory()
  }, []);


  return (
    <>
      <Section>
        <Breadcrumbs>Edit Service</Breadcrumbs>
        <div className='bg-base-100 text-base-content w-full md:max-w-3xl mx-auto mt-5 p-10'>
          <Processing processing={isDataProcessing}>
            <DefaultForm onSubmit={handleSubmit}>
              <Input
                type='text'
                placeholder='Service Name'
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors?.name ?? errors?.error}
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
                  defaultValue={premium}
                  className='col-span-2'
                  onChange={(e) => setPremium(e.target.value)}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </SelectInput>
                {errors?.is_premium && <p className='text-red-500 mt-1 mb-3'>{errors?.is_premium}</p>}
              </div>

              <div className='flex justify-end mt-4'>
                <Button type='submit' proccessing={isProcessing} className='w-24'>Submit</Button>
              </div>

            </DefaultForm>
          </Processing>
        </div>
      </Section>
    </>
  )
}
export default Create
