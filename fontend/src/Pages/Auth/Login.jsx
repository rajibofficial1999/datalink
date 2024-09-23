import Input from "../../Components/Input.jsx";
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/solid/index.js";
import Button from "../../Components/Button.jsx";
import { ADMIN_LOGIN } from "../../utils/api-endpoint.js";
import { useState } from "react";
import request from "../../utils/request.js";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../utils/store/authSlice.js";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/index.js";
import CheckBox from "../../Components/CheckBox.jsx";
import { useCookies } from 'react-cookie';
import DefaultForm from "../../Components/DefaultForm.jsx";
import GuestAuthLayer from "../../Components/GuestAuthLayer.jsx";
import { addMessage } from "../../utils/store/messageSlice.js";

const Login = () => {
  const [cookies, setCookie] = useCookies(['email', 'password']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState(cookies.email ?? '');
  const [password, setPassword] = useState(cookies.password ?? '');
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setIsProcessing(true);
    try {
      const { data } = await request.post(ADMIN_LOGIN, { email, password });

      if(data.success){
        dispatch(setAuthUser({token: data.token, user: data.user}))
        navigate(routes.home)
      }else{
        dispatch(addMessage(data.message))
        navigate(`${routes.emailVerification}/${data?.token}`)
      }

      if (rememberMe){
        setCookie('email', email);
        setCookie('password', password);
      }

    } catch (error) {
      if(error.response?.data){
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsProcessing(false);
      setPassword(cookies.password ?? '')
    }
  }

  return (
    <>
      <GuestAuthLayer heading='Welcome To CyberBD' subHeading='Login System For Premium Account'>
        <DefaultForm onSubmit={submit}>
          <Input
            className='mb-5'
            type='email'
            placeholder='Email'
            icon={<EnvelopeIcon className='w-5 h-5'/>}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors?.email ?? errors?.error}
          />
          <Input
            className='mb-5'
            type='password'
            placeholder='password'
            icon={<KeyIcon className='w-5 h-5'/>}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors?.password ?? errors?.error}
          />

          <CheckBox onChange={() => setRememberMe(!rememberMe)} className='mb-3'>Remember Me</CheckBox>

          <Button className='w-full' proccessing={isProcessing}>Login</Button>

        </DefaultForm>
      </GuestAuthLayer>
    </>
  )
}
export default Login
