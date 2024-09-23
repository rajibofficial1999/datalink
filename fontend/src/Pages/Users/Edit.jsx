import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Input from "../../Components/Input.jsx";
import { useEffect, useRef, useState } from "react";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { USER_ROLES, USER_UPDATE, USERS } from "../../utils/api-endpoint.js";
import { useSelector } from "react-redux";
import ForSuperAdmin from "../../Components/ForSuperAdmin.jsx";
import { useParams } from "react-router-dom";
import Processing from "../../Components/Processing.jsx";
import { successToast } from "../../utils/toasts/index.js";
import FileInput from "../../Components/FileInput.jsx";
import SelectInput from "../../Components/SelectInput.jsx";
import Modal from "../../Components/Modal.jsx";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid/index.js";
import { sendOTPCode, verifyOTPCode } from "../../utils/index.js";

const Edit = () => {
  const user = useSelector((state) => state.auth?.user);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    profile_photo: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataProcessing, setDataProcessing] = useState(false);
  const [verifyToken, setVerifyToken] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [isOTPCodeProcessing, setIsOTPCodeProcessing] = useState(false);
  const [modalClose, setModalClose] = useState(false)
  const fileInputRef = useRef(null);
  const params = useParams();
  const [currentUser, setCurrentUser] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleErrors = (errorResponse) => {
    if (errorResponse.response) {
      setErrors(errorResponse.response.data.errors || {});
    }
  };

  const getUser = async () => {
    setDataProcessing(true);
    try {
      const { data } = await request.get(`${USERS}/${params.id}`);
      setCurrentUser(data)
      setForm({
        name: data?.name,
        email: data?.email,
        role: data?.roles[0]?.id || '',
        password: '',
        password_confirmation: '',
        profile_photo: '',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setDataProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    if(currentUser.email === form.email){
      await updateUser()
    }else{
      await sendOTPCodeToEmailVerify()
    }
    setIsProcessing(false);
  };

  const sendOTPCodeToEmailVerify = async () => {
    try {
      const data = await sendOTPCode(currentUser.id, form.email);
      setVerifyToken(data.verifyToken);
      showEmailVerifyForm();
    }catch (error){
      handleErrors(error)
    }
  }

  const updateUser = async () => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    formData.append('user_id', params.id);

    try {
      const { data } = await request.post(USER_UPDATE, formData);
      setErrors({});
      successToast(data.success);
    } catch (error) {
      handleErrors(error);
    } finally {

      setForm((prevState) => ({
        ...prevState,
        password: '',
        password_confirmation: '',
        profile_photo: '',
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsProcessing(false);
    }
  }

  const handleOTPCodeSubmit = async (e) => {
    e.preventDefault();
    setIsOTPCodeProcessing(true);
    try {
      const data = await verifyOTPCode(otpCode, verifyToken);
      if (data.success) {
        setOtpCode('');
        setErrors({});
        setVerifyToken('')
        setModalClose(true)
        await updateUser()
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsOTPCodeProcessing(false);
    }
  };

  const showEmailVerifyForm = () => {
    document.getElementById('primary_modal').showModal();
  };

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const { data } = await request.get(USER_ROLES);
        setRoles(data);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
    fetchUserRoles();
  }, []);

  return (
    <>
      <Modal modalClose={modalClose}>
        <DefaultForm onSubmit={handleOTPCodeSubmit}>
          <div className='text-center mb-4 text-green-600'>A verification code has been sent to the email.</div>
          <Input
            name='otpCode'
            type='text'
            placeholder='OTP Code'
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            icon={<PaperAirplaneIcon className='w-5 h-5' />}
            error={errors?.otp_code}
          />
          <div className='flex justify-end mt-4'>
            <Button type='submit' proccessing={isOTPCodeProcessing} className='w-24'>Submit</Button>
          </div>
        </DefaultForm>
      </Modal>

      <Section>
        <Breadcrumbs>Edit User</Breadcrumbs>
        <div className='bg-base-100 text-base-content w-full md:max-w-3xl mx-auto mt-5 p-10'>
          <Processing processing={dataProcessing}>
            <DefaultForm onSubmit={handleSubmit}>
              <Input
                name='name'
                type='text'
                placeholder='Name'
                label='Name'
                value={form.name}
                onChange={handleInputChange}
                error={errors?.name}
              />
              <Input
                name='email'
                type='email'
                placeholder='Email'
                label='Email Address'
                value={form.email}
                onChange={handleInputChange}
                error={errors?.email}
              />
              <Input
                name='password'
                type='password'
                placeholder='Password'
                label='Password'
                value={form.password}
                onChange={handleInputChange}
                error={errors?.password}
              />
              <Input
                name='password_confirmation'
                type='password'
                placeholder='Confirm Password'
                label='Confirm Password'
                value={form.password_confirmation}
                onChange={handleInputChange}
                error={errors?.password_confirmation}
              />
              <div className='mt-2'>
                <label htmlFor='profile_photo' className="text-sm">Profile Photo</label>
                <FileInput
                  name='profile_photo'
                  label='Profile Photo'
                  onChange={handleInputChange}
                  fileInputRef={fileInputRef}
                  error={errors?.profile_photo}
                />
                {errors?.profile_photo && <p className='text-red-500 mt-1 mb-3'>{errors?.profile_photo}</p>}
              </div>

              <ForSuperAdmin user={user}>
                <div className='flex flex-col'>
                  <label htmlFor='role' className="text-sm mt-4">User Role</label>
                  <SelectInput
                    name='role'
                    label='User Role'
                    value={form.role}
                    onChange={handleInputChange}
                    error={errors?.role}
                  >
                    <option>Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </SelectInput>
                  {errors?.role && <p className='text-red-500 mt-1 mb-3'>{errors?.role}</p>}
                </div>
              </ForSuperAdmin>

              <div className='flex justify-end mt-4'>
                <Button type='submit' proccessing={isProcessing} className='w-24'>Submit</Button>
              </div>
            </DefaultForm>
          </Processing>
        </div>
      </Section>
    </>
  );
};

export default Edit;
