import { cn } from "../utils/index.js";
import { PhotoIcon } from "@heroicons/react/24/solid/index.js";
import { useEffect, useRef, useState } from "react";

const ImageDragDrop = ({imageFile, selectedFile, ...props}) => {
  const [isFileSelected, setIsFileSelected] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const previewImage = useRef(null)
  const input = useRef(null)

  function displayPreview(file) {
    if(file){
      if(file.type.startsWith('image/')){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          previewImage.current.src = reader.result;
          setIsPreview(true)
        };
      }
    }
  }

  const handleImageChange = (e) => {
    let file = e.target.files[0]
    displayPreview(file)
    selectedFile(file)
    setIsFileSelected(true)
  }

  useEffect(() => {
    if(imageFile){
      displayPreview(imageFile)
    }else{
      setIsPreview(false)
      setIsFileSelected(false)
      if (input.current) {
        input.current.value = '';
      }
    }
  }, [imageFile]);

  return (
    <label
      {...props}
      draggable='true'
      htmlFor='profile_photo'
      onDragOver={() => setIsFileSelected(true)}
      onDragLeave={() => setIsFileSelected(false)}
      className={cn('border-2 cursor-pointer border-dashed border-blue-600 w-full block p-8 rounded-md relative', isFileSelected && 'border-pink-600')}
    >
      <input onChange={handleImageChange} accept='image/*' type="file" className="absolute inset-0 w-full h-full opacity-0 z-50"/>
      <div className='flex justify-center items-center flex-col gap-3'>
        <div className='size-10 bg-base-300 rounded-full flex justify-center items-center'>
          <PhotoIcon className='size-5 text-blue-600'/>
        </div>
        <p>
          <span className="text-blue-600">Click to Upload </span>
          or Drag and drop
        </p>
        <p>JPG, PNG or SVG</p>
        <img ref={previewImage} className={cn('size-20 object-cover rounded-full border border-base-300', isPreview ? '' : 'hidden')} alt='preview-image'/>
      </div>

      <input ref={input} type="file" id='profile_photo' className='sr-only' accept='image/*' name='profile_photo'/>
    </label>
  )
}

export default ImageDragDrop
