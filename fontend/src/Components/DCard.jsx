import { cn } from "../utils/index.js";

const DCard = ({icon, arrowIcon, title, value, parcentValue, parcentClass = 'text-green-500'}) => {
  return <div className="card bg-base-100 text-base-content shadow-lg rounded-none">
    <div className="card-body">
      {icon}
      <div className="flex justify-between items-end">
        <div>
          <h1 className='text-xl font-bold'>{value}</h1>
          <span className='text-sm'>{title}</span>
        </div>
        <div className={cn('flex items-center gap-2 ' + parcentClass)}>
          <p>{parcentValue}</p>
          {arrowIcon}
        </div>
      </div>
  </div>
</div>
}
export default DCard
