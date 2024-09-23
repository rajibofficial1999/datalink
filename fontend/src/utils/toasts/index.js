import { toast } from 'react-hot-toast';

export const successToast = (value) => {
  return toast.success(value, {
    duration: 1500,
    position: 'bottom-right',
    style: {
      background: '#333',
      color: '#fff',
    },
  });
};
