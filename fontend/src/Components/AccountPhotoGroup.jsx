import LoadImage from "./LoadImage.jsx";
import DefaultTooltip from "./DefaultTooltip.jsx";
import { ArrowDownIcon } from "@heroicons/react/24/outline/index.js";
import { saveAs } from 'file-saver';
import axios from "axios";
import { APP_URL } from "../env/index.js";

const AccountPhotoGroup = ({image}) => {
  const handleDownload = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.data.type });
      saveAs(blob, 'image.jpg');
    } catch (error) {
      console.error('Error downloading the image', error);
    }
  };

  return (
    <div className='relative'>
      <LoadImage className='w-24 rounded-md' src={`${APP_URL}/storage/${image}`}/>
      <div
        className='absolute left-0 top-0 w-full h-full hover:bg-black hover:bg-opacity-40 duration-200 rounded-md group'>
        <DefaultTooltip
          value='Download'
          className='!tooltip-top size-10 opacity-0 group-hover:opacity-100 group-hover:visible duration-200 rounded-full cursor-pointer p-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-800'
          onClick={() => handleDownload(`${APP_URL}/storage/${image}`)}
        >
          <ArrowDownIcon/>
        </DefaultTooltip>
      </div>
    </div>
  )
}
export default AccountPhotoGroup
