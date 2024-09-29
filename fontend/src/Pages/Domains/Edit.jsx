import Section from "../../Components/Section.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs.jsx";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Input from "../../Components/Input.jsx";
import { useEffect, useRef, useState } from "react";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid/index.js";
import DefaultTooltip from "../../Components/DefaultTooltip.jsx";
import { DOMAIN_UPDATE, DOMAINS } from "../../utils/api-endpoint.js";
import { useParams } from "react-router-dom";
import Processing from "../../Components/Processing.jsx";
import { successToast } from "../../utils/toasts/index.js";
import ClipboardData from "../../Components/ClipboardData.jsx";
import FileInput from "../../Components/FileInput.jsx";
import SelectInput from "../../Components/SelectInput.jsx";
import ForSuperAdmin from "../../Components/ForSuperAdmin.jsx";
import { useSelector } from "react-redux";
import ForAdminUser from "../../Components/ForAdminUser.jsx";

const Edit = () => {

  const params = useParams();
  const authUser = useSelector(state => state.auth.user)
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDataProcessing, setDataProcessing] = useState(false);
  const [editDomain, setEditDomain] = useState(null);

  const [domain, setDomain] = useState('');
  const [skypeUrl, setSkypeUrl] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [privacy, setPrivacy] = useState(0)
  const [binanceId] = useState(215454454514);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDomain();
  }, []);

  const fetchDomain = async () => {
    setDataProcessing(true);
    try {
      const { data } = await request.get(`${DOMAINS}/show/${params.id}`);
      setEditDomain(data);
      setDomain(data?.name);
      setSkypeUrl(data?.skype_url);
      setPrivacy(data?.is_default);
    } catch (error) {
      console.error('Error fetching domain:', error);
    } finally {
      setDataProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const formData = createFormData();

    try {
      const { data } = await request.post(DOMAIN_UPDATE, formData);
      handleSuccess(data);
    } catch (error) {
      handleError(error);
    } finally {
      resetForm();
      setIsProcessing(false);
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('domain', domain);
    formData.append('skype_url', skypeUrl);
    formData.append('domain_id', editDomain?.id);
    formData.append('privacy', privacy);

    if (screenshot) {
      formData.append('screenshot', screenshot);
    }
    return formData;
  };

  const handleSuccess = (data) => {
    successToast(data.success);
    setEditDomain(data.domain);
    setErrors({});
  };

  const handleError = (error) => {
    if (error.response) {
      setErrors(error.response.data.errors);
    } else {
      console.error('An error occurred:', error);
    }
  };

  const resetForm = () => {
    setScreenshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input value
    }
  };

  return (
    <Section>
      <Breadcrumbs>Edit Domain</Breadcrumbs>
      <div className='bg-base-100 text-base-content w-full md:max-w-3xl mx-auto mt-5 p-10'>
        <Processing processing={isDataProcessing}>
          <DefaultForm onSubmit={handleSubmit}>
            <Input
              type='text'
              placeholder='www.example.com'
              label='Valid Domain'
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              error={errors?.domain}
            />


            <ForAdminUser user={authUser}>
              <Input
                type='text'
                placeholder='live:.cid.96776b7575454d5a'
                label='Skype ID'
                value={skypeUrl}
                onChange={(e) => setSkypeUrl(e.target.value)}
                error={errors?.skype_url}
              />
            </ForAdminUser>

            <ForSuperAdmin user={authUser}>
              <div className='mt-2'>
                <label htmlFor='privacy' className="text-sm">Privacy</label>
                <SelectInput
                  id='privacy'
                  onChange={(e) => setPrivacy(e.target.value)}
                  error={errors?.privacy}
                >
                  <option value='0'>Private</option>
                  <option value='1'>Public</option>
                </SelectInput>
                {errors?.privacy && <p className='text-red-500 mt-1 mb-3'>{errors?.privacy}</p>}
              </div>
            </ForSuperAdmin>

            <ForAdminUser user={authUser}>
              <div className='mt-2'>
                <label htmlFor='screenshot' className="text-sm">Binance ID ({binanceId})</label>
                <DefaultTooltip value='Copy Binance ID' className='w-full'>
                  <ClipboardData value={binanceId}>
                    <button type='button'
                            className='mt-2 input input-bordered input-primary w-full flex justify-center items-center group'>
                      <DocumentDuplicateIcon className='size-8 text-blue-600 group-hover:scale-75 duration-200'/>
                    </button>
                  </ClipboardData>
                </DefaultTooltip>
              </div>

              <div className='mt-2'>
                <label htmlFor='screenshot' className="text-sm">Payment Screenshot</label>
                <FileInput
                  id='screenshot'
                  onChange={(e) => setScreenshot(e.target.files[0])}
                  fileInputRef={fileInputRef}
                  error={errors?.screenshot}
                />
                {errors?.screenshot && <p className='text-red-500 mt-1 mb-3'>{errors?.screenshot}</p>}
              </div>
            </ForAdminUser>

            <div className='flex justify-end mt-4'>
              <Button type='submit' proccessing={isProcessing} className='w-24'>Submit</Button>
            </div>
          </DefaultForm>
        </Processing>
      </div>
    </Section>
  );
};

export default Edit;
