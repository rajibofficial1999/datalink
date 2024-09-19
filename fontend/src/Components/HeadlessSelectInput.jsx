import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

export default function HeadlessSelect() {
  return (
    <div className="w-full max-w-md px-4">
        <div className="relative">
          <Select
            className={clsx(
              'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black'
            )}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="delayed">Delayed</option>
            <option value="canceled">Canceled</option>
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
    </div>
  )
}
