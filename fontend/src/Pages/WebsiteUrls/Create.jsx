import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Select from "react-select";
import request from "../../utils/request.js";
import { useEffect, useState } from "react";
import { CATEGORIES, DOMAINS, USERS, WEBSITE_URLS } from "../../utils/api-endpoint.js";
import Processing from "../../Components/Processing.jsx";
import { useSelector } from "react-redux";
import Button from "../../Components/Button.jsx";
import { successToast } from "../../utils/toasts/index.js";

const Create = () => {
  const theme = useSelector((state) => state.theme?.value)
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [categories, setCategories] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [selectedDomainId, setSelectedDomainId] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [pages, setPages] = useState([])
  const [errors, setErrors] = useState([])
  const [processing, setProcessing] = useState(false)
  const [buttonProcessing, setButtonProcessing] = useState(false)


  const getUsers = async () => {
    let url =`${USERS}/all/admin`
    setProcessing(true)
    try {
      const { data } = await request.get(url);
      setUsers(data.users);
    }catch (error){
      handleErrors(error)
    }
  }

  const getUserDomains = async (user) => {
    setSelectedUserId(user.value)
    let url =`${DOMAINS}/get/${user.value}`
    try {
      const { data } = await request.get(url);
      setDomains(data.domains);
    }catch (error){
      handleErrors(error)
    }
  }


  const getCategories = async () => {
    let url =`${CATEGORIES}/all`
    try {
      const { data } = await request.get(url);
      setCategories(data);
    }catch (error){
      handleErrors(error)
    }finally {
      setProcessing(false)
    }
  }

  const handleErrors = (errors) => {
    if(errors?.response){
      setErrors(errors.response.data.errors)
    }else {
      console.log(errors)
    }
  }

  const multiSelectCustomStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1D232A' ,
      borderColor: state.isFocused ? '#1E40AF' : '#1E40AF',
      '&:hover': { borderColor: '#1E40AF' },
      padding: '8px 5px 8px 5px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === 'light' ? '#1D232A' : '#A6ADBB',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme === 'light' ? '#1D232A' : '#A6ADBB',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#1E40AF' : theme === 'light' ? '#FFFFFF' : '#1D232A',
      color: state.isSelected ? theme === 'light' ? '#1D232A' : '#A6ADBB' : state.isFocused ? '#E5E6E6' : theme === 'light' ? '#1D232A' : '#A6ADBB',
      padding: 10
    })
  };

  const handleSelectedCategories = (categories) => {
    categories = categories.map(category => category.value)
    setSelectedCategoryIds(categories)
  }

  const handleSelectedPages = (pages) => {
    pages = pages.map(page => page.value)
    setPages(pages)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setButtonProcessing(true)

    try {
      const {data} = await request.post(WEBSITE_URLS, {
        domain: selectedDomainId,
        user: selectedUserId,
        categories: selectedCategoryIds,
        pages: pages,
      })
      await pageRefresh()
      setErrors([])
      successToast(data.success)
    }catch (error){
      handleErrors(error)
    }finally {
      clearForm()
      setButtonProcessing(false)
    }
  }

  const clearForm = () => {
    setSelectedCategoryIds([])
    setSelectedDomainId(null)
    setSelectedUserId(null)
    setPages([])
  }

  const pageOptions = [
    {value: 'login', label: "Login Page"},
    {value: 'video', label: "Video Calling"},
  ]


  const pageRefresh = async () => {
    await getUsers()
    await getCategories()
  }


  useEffect(() => {
    pageRefresh()
  }, []);
  return (
    <>
      <Section>
        <Breadcrumbs>Create URL</Breadcrumbs>
        <Processing processing={processing}>
          <div className='bg-base-100 text-base-content w-full md:max-w-3xl mx-auto mt-5 p-10'>
            <DefaultForm onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4'>

              <div className='w-full'>
                <label htmlFor="user" className='mb-2 block'>Select User</label>
                <Select
                  name='user'
                  options={users}
                  onChange={getUserDomains}
                  placeholder='Select'
                  styles={multiSelectCustomStyles}
                />
                {errors?.user && <p className='text-red-500'>{errors?.user}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor="domain" className='mb-2 block'>Select Domain</label>
                <Select
                  name='domain'
                  placeholder='Select'
                  onChange={(domain) => setSelectedDomainId(domain.value)}
                  options={domains}
                  styles={multiSelectCustomStyles}
                />
                {errors?.domain && <p className='text-red-500'>{errors?.domain}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor="category" className='mb-2 block'>Select Categories</label>
                <Select
                  name='category'
                  placeholder='Select'
                  styles={multiSelectCustomStyles}
                  isMulti
                  options={categories}
                  onChange={(categories) => handleSelectedCategories(categories)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {errors?.categories && <p className='text-red-500'>{errors?.categories}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor="page" className='mb-2 block'>Select Pages</label>
                <Select
                  name='page'
                  placeholder='Select'
                  styles={multiSelectCustomStyles}
                  isMulti
                  options={pageOptions}
                  onChange={(pages) => handleSelectedPages(pages)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {errors?.pages && <p className='text-red-500'>{errors?.pages}</p>}
              </div>

              <div className='flex justify-end items-end mt-4 w-full'>
                <Button type='submit' proccessing={buttonProcessing} className='w-24'>Submit</Button>
              </div>

            </DefaultForm>
          </div>
        </Processing>
      </Section>
    </>
  )
}

export default Create
