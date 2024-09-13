import DCard from "../Components/DCard.jsx";
import { ChartBarSquareIcon, ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline/index.js";
import Section from "../Components/Section.jsx";
import { useSelector } from "react-redux";
import { cn } from "../utils/index.js";

const Dashboard = () => {
  const theme = useSelector((state) => state.theme.value)
  const iconClasses = 'w-12 h-12 bg-lime-50 bg-opacity-30 p-3 rounded-full text-red-500 mb-2 '
  return (
    <>
      <Section>
        <DCard
          icon={<ChartBarSquareIcon className={cn(iconClasses, theme !== 'dark' && 'dark:bg-blue-200 dark:bg-opacity-70')}/>}
          arrowIcon={<ArrowUpIcon className='w-4 h-4'/>}
          title='Total Hits'
          value='240'
          parcentValue='100%'
        />
        <DCard
          icon={<ChartBarSquareIcon className={cn(iconClasses, theme !== 'dark' && 'dark:bg-blue-200 dark:bg-opacity-70')}/>}
          arrowIcon={<ArrowDownIcon className='w-4 h-4'/>}
          title='Unique Hits'
          value='98'
          parcentValue='64%'
          parcentClass='text-red-500'
        />
        <DCard
          icon={<ChartBarSquareIcon className={cn(iconClasses, theme !== 'dark' && 'dark:bg-blue-200 dark:bg-opacity-70')}/>}
          arrowIcon={<ArrowUpIcon className='w-4 h-4'/>}
          title='Accounts'
          value='14'
          parcentValue='26%'
        />
        <DCard
          icon={<ChartBarSquareIcon className={cn(iconClasses, theme !== 'dark' && 'dark:bg-blue-200 dark:bg-opacity-70')}/>}
          arrowIcon={<ArrowUpIcon className='w-4 h-4'/>}
          title='Total Accounts'
          value='102'
          parcentValue='44%'
        />
      </Section>
    </>
  )
}
export default Dashboard
