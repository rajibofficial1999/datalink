import { useEffect, useState } from "react";
import { cn } from "../utils/index.js";
import { themeChange } from "theme-change";

const PageLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
    themeChange(false)
  }, []);
  return (
    <div className={cn(isLoading ? 'w-screen h-screen flex justify-center items-center fixed bg-base-300 z-50' : '')}>
      {
        isLoading ? <span className="loading loading-ring loading-lg"></span> : children
      }
    </div>
  )
}
export default PageLoader
