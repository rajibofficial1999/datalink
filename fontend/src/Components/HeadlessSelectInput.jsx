import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { cn } from "../utils/index.js";

export default function HeadlessSelectInput({options, className = '', ...props}) {
  return (
    <div className={cn("w-full ", className)}>
        <div className="relative">
          <Select
            {...props}
            className='block w-full appearance-none border border-primary py-3 rounded-md px-3 text-sm/6 text-base-content focus:outline-none'
          >
            <option>Select Service</option>
            {
              options?.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)
            }
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4"
            aria-hidden="true"
          />
        </div>
    </div>
  )
}
