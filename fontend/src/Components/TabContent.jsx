import { TabGroup, TabList } from '@headlessui/react'


export default function TabContent({children}) {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-md">
        <TabGroup>
          <TabList className="flex gap-2">
            {children}
          </TabList>
        </TabGroup>
      </div>
    </div>
  )
}
