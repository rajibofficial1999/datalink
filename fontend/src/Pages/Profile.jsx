import InnerSection from "../Components/InnerSection.jsx";
import Section from "../Components/Section.jsx";
import DefaultForm from "../Components/DefaultForm.jsx";
import Input from "../Components/Input.jsx";
import { EnvelopeIcon, KeyIcon, LockClosedIcon, PaperAirplaneIcon, UserIcon } from "@heroicons/react/24/solid/index.js";
import Button from "../Components/Button.jsx";
import { routes } from "../routes/index.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APP_URL } from "../env/index.js";
import ImageDragDrop from "../Components/ImageDragDrop.jsx";
import request from "../utils/request.js";
import {
  PROFILE_PHOTO_UPDATE,
  PROFILE_TWO_STEPS,
  PROFILE_UPDATE,
  PROFILE_UPDATE_PASSWORD,
} from "../utils/api-endpoint.js";
import { updateAuthUser } from "../utils/store/authSlice.js";
import { successToast } from "../utils/toasts/index.js";
import Modal from "../Components/Modal.jsx";
import TwoStepAuthSwitch from "../Components/TwoStepAuthSwitch.jsx";
import { sendOTPCode, verifyOTPCode } from "../utils/index.js";

const Profile = () => {
  const authUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: authUser.name,
    email: authUser.email,
    password: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [verifyToken, setVerifyToken] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [modalClose, setModalClose] = useState(false)
  const [twoStepSubmitted, setTwoStepSubmitted] = useState(false)

  const [isProcessing, setIsProcessing] = useState({
    profileForm: false,
    profilePhotoForm: false,
    otpCode: false,
  });

  const [errors, setErrors] = useState({});

  // Generic function for handling form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form processing state
  const setProcessingState = (formType, state) => {
    setIsProcessing((prevState) => ({ ...prevState, [formType]: state }));
  };

  const handleErrors = (error) => {
    if (error.response) {
      setErrors(error.response.data.errors);
    } else {
      console.log(error);
    }
  };

  const updateAuthUserStorage = (user) => {
    dispatch(updateAuthUser(user));
  };

  // Handle profile form submission
  const handleProfileForm = async (e) => {
    setProcessingState('profileForm', true);
    e.preventDefault();
    if(formData.email === authUser.email){
      await updateUser()
    }else {
      await sendOTPCodeToEmailVerify()
    }
    setProcessingState('profileForm', false);
  };

  const updateUser = async () => {
    try {
      const { data } = await request.put(PROFILE_UPDATE, {
        name: formData.name,
        email: formData.email,
      });

      setErrors({});
      updateAuthUserStorage(data.user);
      successToast(data.success);
    } catch (error) {
      handleErrors(error);
    } finally {
      setProcessingState('profileForm', false);
    }
  }

  const sendOTPCodeToEmailVerify = async () => {
    try {
      const data = await sendOTPCode(authUser.id, formData.email);
      setVerifyToken(data.verifyToken);
      showEmailVerifyForm();
    }catch (error){
      handleErrors(error)
    }
  }

  // Handle image file drop and validation
  const handleDrop = (e) => {
    const file = e.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  // Handle profile photo form submission
  const handleProfilePhotoForm = async (e) => {
    e.preventDefault();
    if (!imageFile?.type.startsWith('image/')) {
      return false;
    }

    setProcessingState('profilePhotoForm', true);
    try {
      const formData = new FormData();
      formData.append('profile_photo', imageFile);
      formData.append('user_id', authUser.id);

      const { data } = await request.post(PROFILE_PHOTO_UPDATE, formData);
      updateAuthUserStorage(data.user);
      setErrors({});
      successToast(data.success);
    } catch (error) {
      handleErrors(error);
    } finally {
      setProcessingState('profilePhotoForm', false);
      setImageFile(null);
    }
  };

  // Show modal for email verification
  const showEmailVerifyForm = () => {
    document.querySelector('.otpModal').showModal();
  };

  // Show change password modal
  const showPasswordChangeForm = () => {
    document.querySelector('.password-modal').showModal();
  };

  const handleOTPCodeSubmit = async (e) => {
    e.preventDefault()
    setProcessingState('otpCode', true);

    try {
      const data = await verifyOTPCode(otpCode, verifyToken)
        if (data.success) {
          setErrors({});
          setOtpCode('');
          setVerifyToken('');
          setModalClose(true)
          await updateUser()
        }

    } catch (error) {
      handleErrors(error);
    } finally {
      setProcessingState('otpCode', false);
    }
  }

  const handleTwoStepAuth = async (isChecked) => {
    setTwoStepSubmitted(false)
    try {
      const { data } = await request.put(PROFILE_TWO_STEPS, {
        two_step_auth: isChecked
      });

      if (data.success) {
        updateAuthUserStorage(data.user);
        setErrors({});
        successToast(data.message);
      }
    } catch (error) {
      handleErrors(error);
    }finally {
      setTwoStepSubmitted(true)
    }
  }

  return (
    <>
      <PasswordModal/>

      <Modal modalClose={modalClose} className='otpModal'>
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
            icon={<PaperAirplaneIcon className='w-5 h-5' />}
            error={errors.otp_code}
          />
          <div className='flex justify-end mt-4'>
            <Button type='submit' proccessing={isProcessing.otpCode} className='w-24'>
              Submit
            </Button>
          </div>
        </DefaultForm>
      </Modal>

      <Section className='max-w-5xl mx-auto'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8'>
          {/* Personal Information Section */}
          <InnerSection className='md:col-span-3 p-0'>
            <h1 className='px-6 py-4 text-xl border-b border-base-300'>Personal Information</h1>
            <div className='mt-2 px-6 py-4'>
              <DefaultForm onSubmit={handleProfileForm}>
                <InputField
                  label="Full Name"
                  name="name"
                  type="text"
                  icon={<UserIcon className='size-5'/>}
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  icon={<EnvelopeIcon className='size-5'/>}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <FormActions
                  isProcessing={isProcessing.profileForm}
                  cancelRoute={routes.home}
                />
              </DefaultForm>

              <div className='grid grid-cols-2 mt-16 items-center gap-2'>
                <div>
                  <p className="font-semibold">Password : </p>
                  <p className="font-semibold text-nowrap mt-5">Two Step Authentication : </p>
                </div>
                <div>
                  <Button className='py-1 mb-5 bg-gray-400 hover:bg-gray-500' onClick={showPasswordChangeForm}>
                    <KeyIcon className='size-5 mr-1'/> Change
                  </Button>
                  <TwoStepAuthSwitch handleTwoStepAuth={handleTwoStepAuth} twoStepSubmitted={twoStepSubmitted}/>
                </div>
              </div>


            </div>
          </InnerSection>

          {/* Profile Picture Section */}
          <InnerSection className='md:col-span-2 p-0'>
            <h1 className='px-6 py-4 text-xl border-b border-base-300'>Profile Picture</h1>
            <div className='mt-2 px-6 py-4'>
              <div className='flex justify-start items-center gap-2 mb-5'>
                <img className='size-14 object-cover rounded-full' alt={authUser.avatar} src={`${APP_URL}/storage/${authUser.avatar}`} />
                <p>Change Profile Picture</p>
              </div>
              <DefaultForm onSubmit={handleProfilePhotoForm}>
                <ImageDragDrop onDrop={handleDrop} imageFile={imageFile} selectedFile={setImageFile} />
                {errors.profile_photo && <p className='text-red-500 mt-1'>{errors.profile_photo[0]}</p>}
                <FormActions
                  isProcessing={isProcessing.profilePhotoForm}
                  cancelRoute={routes.home}
                />
              </DefaultForm>
            </div>
          </InnerSection>
        </div>
      </Section>
    </>
  );
};

const InputField = ({ label, name, type, icon, value, onChange, error }) => (
  <div className='mt-2'>
    <label htmlFor={name} className='mb-2 block'>{label}</label>
    <Input
      name={name}
      type={type}
      icon={icon}
      placeholder={label}
      value={value}
      onChange={onChange}
      error={error}
    />
  </div>
);

const FormActions = ({ isProcessing, cancelRoute }) => (
  <div className='my-3 flex justify-end items-center gap-2'>
    <Button as='link' to={cancelRoute} className='bg-base-100 hover:bg-base-100 hover:shadow-lg border-base-300 border  text-base-content' type='button'>
      Cancel
    </Button>
    <Button type='submit' proccessing={isProcessing}>Submit</Button>
  </div>
);

const PasswordModal = () => {
  const [modalClose, setModalClose] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState()

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setIsProcessing(false)
    try {
      const { data } = await request.put(PROFILE_UPDATE_PASSWORD, {
        current_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      if (data.success) {
        setErrors({});
        setNewPassword('')
        setConfirmPassword('')
        setOldPassword('')
        setModalClose(true)
        successToast(data.message);
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
    <Modal modalClose={modalClose} className='password-modal'>
      <DefaultForm onSubmit={handleChangePassword}>
        <InputField
          label="Old Password"
          name="Old Password"
          type="password"
          icon={<LockClosedIcon className='size-5'/>}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={errors?.current_password}
        />
        <InputField
          label="New Password"
          name="New Password"
          type="password"
          icon={<LockClosedIcon className='size-5'/>}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors?.password?.length > 1 ? errors?.password[0] :  errors?.password}
        />
        <InputField
          label="Confirm Password"
          name="Confirm Password"
          type="password"
          icon={<LockClosedIcon className='size-5'/>}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors?.confirmation_password}
        />
        <div className='flex justify-end mt-4'>
          <Button type='submit' proccessing={isProcessing} className='w-24'>Submit</Button>
        </div>
      </DefaultForm>
    </Modal>
  )
}

export default Profile;
