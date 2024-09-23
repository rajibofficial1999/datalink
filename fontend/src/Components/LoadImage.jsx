import { useState } from "react";
import { cn } from "../utils/index.js";

const LoadImage = ({ src, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className='w-full h-full flex justify-center items-center'>
      {!isLoaded && <div className={cn('skeleton size-24', className)}></div>}

      <img
        src={src}
        alt={alt}
        className={cn(className)}
        onLoad={handleImageLoad}
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
    </div>
  );
};

export default LoadImage;
