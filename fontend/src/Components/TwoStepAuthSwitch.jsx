import { cn } from "../utils/index.js";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const TwoStepAuthSwitch = ({handleTwoStepAuth, twoStepSubmitted}) => {
  const authUser = useSelector(state => state.auth.user);
  const [isOffLoading, setIsOffLoading] = useState(false)
  const [isOnLoading, setIsOnLoading] = useState(false)

  const handleCheckboxChange = (value) => {
    if(authUser.two_step_auth === value){
      return false
    }
    value ? setIsOnLoading(true) : setIsOffLoading(true);

    handleTwoStepAuth(value)
  }


  useEffect(() => {
    if(twoStepSubmitted){
      setIsOffLoading(false)
      setIsOnLoading(false)
    }
  }, [twoStepSubmitted]);
  return (
    <>
      <label htmlFor='twoStepButton' className='relative inline-flex cursor-pointer select-none items-center'>
        <div className='shadow-card flex items-center justify-center rounded-md bg-white'>
          <SwitchButton
            onClick={() => handleCheckboxChange(false)}
            classsName='rounded-l-md'
            isChecked={authUser.two_step_auth}
          >
            {isOffLoading ? <span className="loading loading-spinner loading-md"></span> : 'OFF'}
          </SwitchButton>
          <SwitchButton
            onClick={() => handleCheckboxChange(true)}
            classsName='rounded-r-md'
            isChecked={!authUser.two_step_auth}
          >
            {isOnLoading ? <span className="loading loading-spinner loading-md"></span> : 'ON'}
          </SwitchButton>
        </div>
      </label>
    </>
  )
}

const SwitchButton = ({ isChecked, classsName = '', children, ...props}) => {
  return (
    <button disabled={!isChecked} {...props} type='button'
      className={cn('flex items-center justify-center px-4 py-1 font-semibold', classsName, !isChecked ? 'bg-blue-600 text-white' : 'bg-base-300')}>
            {children}
    </button>
  )
}

export default TwoStepAuthSwitch
