import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Input from "../../Components/Input.jsx";
import { useEffect, useRef, useState } from "react";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { USER_ROLES, USERS } from "../../utils/api-endpoint.js";
import { useSelector } from "react-redux";
import ForSuperAdmin from "../../Components/ForSuperAdmin.jsx";
import { successToast } from "../../utils/toasts/index.js";
import SelectInput from "../../Components/SelectInput.jsx";
import FileInput from "../../Components/FileInput.jsx";
import Modal from "../../Components/Modal.jsx";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid/index.js";
import { verifyOTPCode } from "../../utils/index.js";

const Create = () => {
  const user = useSelector((state) => state.auth?.user);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    avatar: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyToken, setVerifyToken] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [isOTPCodeProcessing, setIsOTPCodeProcessing] = useState(false)
  const [modalClose, setModalClose] = useState(false)

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

  const clearForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      avatar: '',
      role: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      const { data } = await request.post(USERS, formData);
      successToast(data.success);
      clearForm();
      setVerifyToken(data.verifyToken);
      showEmailVerifyForm();
      setErrors({})
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsProcessing(false);
      setForm((prevStates) => ({
        ...prevStates,
          password: '',
        password_confirmation: ''
      }))
    }
  };

  const handleOTPCodeSubmit = async (e) => {
    e.preventDefault();
    setIsOTPCodeProcessing(true)
    try {
      const data = await verifyOTPCode(otpCode, verifyToken);
      if (data.success) {
        successToast(data.message);
        setOtpCode('')
        setErrors({})
        setModalClose(true)
      }
    } catch (error) {
      handleErrors(error);
    }finally {
      setIsOTPCodeProcessing(false)
    }
  };

  const showEmailVerifyForm = () => {
    document.getElementById('primary_modal').showModal()
  }

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const { data } = await request.get(USER_ROLES);
        setRoles(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserRoles();
  }, []);

  return (
    <>
      <Modal modalClose={modalClose}>
        <DefaultForm onSubmit={handleOTPCodeSubmit}>
          <div className='text-center mb-4 text-green-600'>
            A verification code has been sent to the email.
          </div>
          <Input
            name='otpCode'
            type='text'
            placeholder='OTP Code'
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            icon={<PaperAirplaneIcon className='w-5 h-5'/>}
            error={errors?.otp_code}
          />
          <div className='flex justify-end mt-4'>
            <Button type='submit' proccessing={isOTPCodeProcessing} className='w-24'>Submit</Button>
          </div>
        </DefaultForm>
      </Modal>

      <Section>
        <Breadcrumbs>Create New User</Breadcrumbs>
        <div className='bg-base-100 text-base-content w-full md:max-w-3xl mx-auto mt-5 p-10'>
          {
            errors?.package_error &&
            <p className='text-center text-red-500 my-2'>{errors?.package_error}</p>
          }
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
        </div>
      </Section>
    </>
  );
};
export default Create;
