import Input from "../../Components/Input.jsx";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid/index.js";
import Button from "../../Components/Button.jsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes/index.js";
import DefaultForm from "../../Components/DefaultForm.jsx";
import GuestAuthLayer from "../../Components/GuestAuthLayer.jsx";
import { setAuthUser } from "../../utils/store/authSlice.js";
import { verifyOTPCode } from "../../utils/index.js";

const Login = () => {

  const message = useSelector(state => state.message.value)
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState('')
  const params = useParams()

  const submit = async (e) => {
    e.preventDefault()
    setIsProcessing(true);

    try {
      const data = await verifyOTPCode(otpCode, params?.token, true)

      if(data.success){
        dispatch(setAuthUser({token: data.token, user: data.user}))
        navigate(routes.home)
      }

    } catch (error) {
      if(error.response){
        let [firstError] = Object.values(error.response?.data?.errors)[0]

        setErrors((prevErrors) => ({
          ...prevErrors,
            otpCode: firstError
        }))

      }
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <GuestAuthLayer heading='Welcome To CyberBD' subHeading='Account Verification Center'>
        {
          message && <div className='text-center mb-4 text-green-600'>{message}</div>
        }
        <DefaultForm onSubmit={submit}>
          <Input
            className='mb-5'
            type='text'
            placeholder='OTP'
            icon={<PaperAirplaneIcon className='w-5 h-5'/>}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            error={errors?.otpCode}
          />


          <Button className='w-full' proccessing={isProcessing}>Login</Button>

        </DefaultForm>
        <div className='mt-5'>
          <p className='text-center'>Already have an account?</p>
          <p className='text-center mt-2'>Back To <Link className='text-blue-600 mt-2' to={routes.login}>Login</Link></p>
        </div>
      </GuestAuthLayer>
    </>
  )
}
export default Login
