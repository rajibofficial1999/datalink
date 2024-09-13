import From from "../../Components/From.jsx";
import Input from "../../Components/Input.jsx";
import { KeyIcon, UserIcon } from "@heroicons/react/24/solid/index.js";
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

const Login = () => {
  const [cookies, setCookie] = useCookies(['username', 'password']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [username, setUsername] = useState(cookies.username ?? '');
  const [password, setPassword] = useState(cookies.password ?? '');
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setIsProcessing(true);
    try {
      const { data } = await request.post(ADMIN_LOGIN, { username, password });
      if(data.token){
        data.user.token = data.token
        dispatch(setAuthUser(data.user))
        navigate(routes.dashboard)
        if (rememberMe){
          setCookie('username', username);
          setCookie('password', password);
        }
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
      <div className='max-w-full sm:max-w-lg mx-auto w-full'>
        <div className='my-16 text-center'>
          <h1 className='sm:text-4xl text-2xl font-bold mb-5'>Welcome To CyberBD</h1>
          <p className='font-semibold text-lg'>Login System For Premium Account</p>
        </div>
        <From onSubmit={submit}>
          <Input
            className='mb-5'
            type='text'
            placeholder='username'
            icon={<UserIcon className='w-5 h-5'/>}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username ?? errors.error}
          />
          <Input
            className='mb-5'
            type='password'
            placeholder='password'
            icon={<KeyIcon className='w-5 h-5'/>}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password ?? errors.error}
          />

          <CheckBox onChange={() => setRememberMe(!rememberMe)} className='mb-3'>Remember Me</CheckBox>

          <Button className='w-full' proccessing={isProcessing}>Login</Button>

        </From>
      </div>
    </>
  )
}
export default Login
