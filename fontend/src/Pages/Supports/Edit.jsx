import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import { useEffect, useRef, useState } from "react";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { SUPPORT_UPDATE, SUPPORTS } from "../../utils/api-endpoint.js";
import { successToast } from "../../utils/toasts/index.js";
import Input from "../../Components/Input.jsx";
import FileInput from "../../Components/FileInput.jsx";
import { useParams } from "react-router-dom";
import Processing from "../../Components/Processing.jsx";

const Edit = () => {
  const fileInputRef = useRef(null);
  const params = useParams();

  const [form, setForm] = useState({
    heading: '',
    price: '',
    contact_url: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataProcessing, setDataProcessing] = useState(false);
  const [editSupport, setEditSupport] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: files ? files[0] : value,
    }));
  };

  const handleErrors = (errorResponse) => {
    if (errorResponse.response) {
      setErrors(errorResponse.response.data.errors || {});
    }
  };

  const clearForm = () => {
    setForm({
      heading: '',
      price: '',
      contact_url: '',
      image: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSupport = async () => {
    setDataProcessing(true);
    try {
      const { data } = await request.get(`${SUPPORTS}/${params.id}`);
      setEditSupport(data);
      setForm({
        heading: data?.heading ?? '',
        price: data?.price ?? '',
        contact_url: data?.contact_url ?? '',
        image: null,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDataProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    formData.append('support_id', editSupport?.id);

    try {
      const { data } = await request.post(SUPPORT_UPDATE, formData);
      successToast(data.success);
      clearForm();
      setErrors({});
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    getSupport();
  }, []);

  return (
    <Section>
      <InnerSection heading='Edit Support'>
        <Processing processing={dataProcessing}>
          <div className='w-full md:max-w-4xl mx-auto mt-10'>
            <DefaultForm onSubmit={handleSubmit}>
              <Input
                name='heading'
                type='text'
                placeholder='Heading'
                label='Heading (Optional)'
                value={form.heading}
                onChange={handleInputChange}
                error={errors?.heading}
              />

              <Input
                name='price'
                type='text'
                placeholder='Price'
                label='Support Price'
                value={form.price}
                onChange={handleInputChange}
                error={errors?.price}
              />

              <Input
                name='contact_url'
                type='text'
                placeholder='Url'
                label='Contact Url'
                value={form.contact_url}
                onChange={handleInputChange}
                error={errors?.contact_url}
              />

              <div className='mt-2'>
                <label htmlFor='image' className="text-sm">Image</label>
                <FileInput
                  id='image'
                  name='image'
                  onChange={handleInputChange}
                  fileInputRef={fileInputRef}
                  error={errors?.image}
                />
                {errors?.image && <p className='text-red-500 mt-1 mb-3'>{errors?.image}</p>}
              </div>

              <div className='flex justify-end mt-4'>
                <Button type='submit' proccessing={isProcessing} className='w-24'>Submit</Button>
              </div>
            </DefaultForm>
          </div>
        </Processing>
      </InnerSection>
    </Section>
  );
};

export default Edit;
