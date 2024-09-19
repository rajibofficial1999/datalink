import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import From from "../../Components/From.jsx";
import Input from "../../Components/Input.jsx";
import { useEffect, useState } from "react";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { USER_ROLES, USER_UPDATE, USERS } from "../../utils/api-endpoint.js";
import { useSelector } from "react-redux";
import ForSuperAdmin from "../../Components/ForSuperAdmin.jsx";
import { useParams } from "react-router-dom";
import { routes } from "../../routes/index.js";
import Processing from "../../Components/Processing.jsx";

const Edit = () => {
  const user = useSelector((state) => state.auth?.user)
  const [errors, setErrors] = useState([])
  const [roles, setRoles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [dataProcessing, setDataProcessing] = useState(false)
  const [editUser, setEditUser] = useState({});
  const params = useParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState('')
  const [role, setRole] = useState('')

  const getUser = async () => {
    setDataProcessing(true)
    try {
      const {data} = await request.get(`${USERS}/${params.id}`)
      setEditUser(data)
      setEmail(data?.email)
      setName(data?.name)
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
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', confirmPassword);
    formData.append('user_id', editUser?.id);



    if (avatar) {
      formData.append('profile_photo', avatar);
    }

    formData.append('role', role);

    try {
      const { data } = await request.post(USER_UPDATE, formData);

      getUser()
      console.log(data)

    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.errors);
      } else {
        console.log('An error occurred');
      }
    }finally {
      setIsProcessing(false)
      setPassword('')
      setConfirmPassword('')
    }
  }

  useEffect(() => {
    const getUserRoles = async () => {
      try {
        const {data} = await request.get(USER_ROLES)
        setRoles(data)
      }catch (error){
        console.log(error)
      }
    }

    getUser()
    getUserRoles()
  }, []);

  return (
    <>
      <Section>
        <Breadcrumbs>Edit User</Breadcrumbs>

        <div className='bg-base-100 text-base-content w-full md:max-w-3xl mx-auto mt-5 p-10'>
          <Processing processing={dataProcessing}>
            <From onSubmit={handleSubmit}>
              <Input
                type='text'
                placeholder='Name'
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors?.name ?? errors.error}
              />

              <Input
                type='email'
                placeholder='Email'
                label='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors?.email ?? errors.error}
              />
              <Input
                type='password'
                placeholder='Password'
                label='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors?.password ?? errors.error}
              />

              <Input
                type='password'
                placeholder='Confirm Password'
                label='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors?.password_confirmation ?? errors.error}
              />

              <div className='mt-2'>
                <label htmlFor='avatar' className="text-sm">Profile Photo</label>
                <input
                  id='avatar'
                  type="file"
                  className="file-input file-input-bordered w-full input-primary mt-2"
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
                {errors?.profile_photo && <p className='text-red-500 mt-1 mb-3'>{errors?.profile_photo}</p>}
              </div>

              <ForSuperAdmin user={user}>
                <div className='flex flex-col'>
                  <label htmlFor='role' className="text-sm mt-4">User Role</label>
                  <select
                    className="select select-primary w-full mt-2"
                    id='role'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>Select Role</option>

                    {
                      roles?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)
                    }
                  </select>
                  {errors?.role && <p className='text-red-500 mt-1 mb-3'>{errors?.role}</p>}
                </div>
              </ForSuperAdmin>

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
export default Edit
