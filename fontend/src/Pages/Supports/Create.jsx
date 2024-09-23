import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import { useRef, useState, useEffect } from "react";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { SUPPORTS } from "../../utils/api-endpoint.js";
import { successToast } from "../../utils/toasts/index.js";
import Input from "../../Components/Input.jsx";
import FileInput from "../../Components/FileInput.jsx";

const Create = () => {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    heading: '',
    price: '',
    contact_url: '',
    image: '',
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

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
      image: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      const { data } = await request.post(SUPPORTS, formData);
      successToast(data.success);
      clearForm();
      setErrors({});
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Section>
      <InnerSection heading='Create Support'>
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
      </InnerSection>
    </Section>
  );
};

export default Create;
