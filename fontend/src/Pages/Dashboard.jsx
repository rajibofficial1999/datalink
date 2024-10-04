import DCard from "../Components/DCard.jsx";
import { ChartBarSquareIcon, ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline/index.js";
import Section from "../Components/Section.jsx";
import { useSelector } from "react-redux";
import { cn } from "../utils/index.js";
import AccountInfo from "../Components/AccountInfo.jsx";

const Dashboard = () => {
    
  const tableColumns = [
    'ID',
    'Site Name',
    'Email',
    'Password',
    'OTP Code',
    'Time',
    'Owner'
  ]

  const theme = useSelector((state) => state.theme.value)
  const iconClasses = 'w-12 h-12 bg-lime-50 bg-opacity-30 p-3 rounded-full text-red-500 mb-2 '
  return (
    <>
      <Section>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <DCard
            icon={<ChartBarSquareIcon
              className={cn(iconClasses, theme !== 'dark' && 'dark:bg-blue-200 dark:bg-opacity-70')}/>}
            arrowIcon={<ArrowUpIcon className='w-4 h-4'/>}
            title='Total Hits'
            value='240'
            parcentValue='100%'
          />
          <DCard
            icon={<ChartBarSquareIcon
              className={cn(iconClasses, theme !== 'dark' && 'dark:bg-blue-200 dark:bg-opacity-70')}/>}
            arrowIcon={<ArrowDownIcon className='w-4 h-4'/>}
            title='Today Data'
            value='98'
            parcentValue='64%'
            parcentClass='text-red-500'
          />
          <DCard
            icon={<ChartBarSquareIcon
              className={cn(iconClasses, theme !== 'dark' && 'dark:bg-blue-200 dark:bg-opacity-70')}/>}
            arrowIcon={<ArrowUpIcon className='w-4 h-4'/>}
            title='Yesterday Data'
            value='14'
            parcentValue='26%'
          />
          <DCard
            icon={<ChartBarSquareIcon
              className={cn(iconClasses, theme !== 'dark' && 'dark:bg-blue-200 dark:bg-opacity-70')}/>}
            arrowIcon={<ArrowUpIcon className='w-4 h-4'/>}
            title='Total Data'
            value='102'
            parcentValue='44%'
          />
        </div>

        <AccountInfo
          heading='Conversions'
          tableColumns={tableColumns}
          isForDashboard={true}
        />

      </Section>
    </>
  )
}
export default Dashboard
