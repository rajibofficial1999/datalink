import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Select from "react-select";
import request from "../../utils/request.js";
import { useEffect, useState } from "react";
import { DOMAINS, USERS, WEBSITE_URLS } from "../../utils/api-endpoint.js";
import Processing from "../../Components/Processing.jsx";
import { useSelector } from "react-redux";
import Button from "../../Components/Button.jsx";
import { successToast } from "../../utils/toasts/index.js";

const Create = () => {
  const theme = useSelector((state) => state.theme?.value)
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [sites, setSites] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedSiteItems, setSelectedSiteItems] = useState([])
  const [selectedDomainId, setSelectedDomainId] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [errors, setErrors] = useState([])
  const [processing, setProcessing] = useState(false)
  const [buttonProcessing, setButtonProcessing] = useState(false)


  const getUsers = async () => {
    let url = `${USERS}/all/admin`
    setProcessing(true)
    try {
      const { data } = await request.get(url);
      setUsers(data.users);
      setSites(data.sites);
      setCategories(data.categories);
    } catch (error) {
      handleErrors(error)
    } finally {
      setProcessing(false)
    }
  }

  const getUserDomains = async (user) => {
    setSelectedUserId(user.value)
    let url = `${DOMAINS}/get/${user.value}`
    try {
      const { data } = await request.get(url);
      setDomains(data.domains);
    } catch (error) {
      handleErrors(error)
    }
  }

  const handleErrors = (errors) => {
    console.log(errors)
    if (errors?.response) {
      setErrors(errors.response.data.errors)
    } else {
      console.log(errors)
    }
  }

  const multiSelectCustomStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1D232A',
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

  const handleSelectedSites = (sites) => {
    sites = sites.map(site => site.value)
    setSelectedSiteItems(sites)
  }

  const handleSelectedCategories = (categories) => {
    categories = categories.map(category => category.value)
    setSelectedCategories(categories)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setButtonProcessing(true)

    try {
      const { data } = await request.post(WEBSITE_URLS, {
        domain: selectedDomainId,
        user: selectedUserId,
        sites: selectedSiteItems,
        categories: selectedCategories,
      })
      await pageRefresh()
      setErrors([])
      successToast(data.success)
    } catch (error) {
      handleErrors(error)
    } finally {
      clearForm()
      setButtonProcessing(false)
    }
  }

  const clearForm = () => {
    setSelectedSiteItems([])
    setSelectedDomainId(null)
    setSelectedUserId(null)
    setSelectedCategories([])
  }


  const pageRefresh = async () => {
    await getUsers()
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
                <label htmlFor="site" className='mb-2 block'>Select Categories</label>
                <Select
                  name='site'
                  placeholder='Select'
                  styles={multiSelectCustomStyles}
                  isMulti
                  options={sites}
                  onChange={(sites) => handleSelectedSites(sites)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                {errors?.sites && <p className='text-red-500'>{errors?.sites}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor="categories" className='mb-2 block'>Select Pages</label>
                <Select
                  name='categories'
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
