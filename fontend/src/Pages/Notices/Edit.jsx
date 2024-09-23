import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import { useEffect, useState } from "react";
import DefaultForm from "../../Components/DefaultForm.jsx";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { NOTICES } from "../../utils/api-endpoint.js";
import { successToast } from "../../utils/toasts/index.js";
import { useParams } from "react-router-dom";
import Processing from "../../Components/Processing.jsx";

const Edit = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({});
  const [editNotice, setEditNotice] = useState(null);
  const [dataProcessing, setDataProcessing] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchNotice = async () => {
      setDataProcessing(true);
      try {
        const { data } = await request.get(`${NOTICES}/${params.id}`);
        setEditNotice(data);
        setBody(data?.body);
      } catch (error) {
        console.error(error);
      } finally {
        setDataProcessing(false);
      }
    };

    fetchNotice();
  }, [params.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      const { data } = await request.put(`${NOTICES}/${editNotice?.id}`, { body });
      successToast(data.success);
      setEditNotice(data.notice);
      setErrors({});
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleErrors = (error) => {
    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors);
    } else {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Section>
      <InnerSection heading='Edit Notice'>
        <div className='w-full md:max-w-4xl mx-auto mt-10'>
          <Processing processing={dataProcessing}>
            <DefaultForm onSubmit={handleSubmit}>
              <textarea
                className="textarea textarea-primary w-full"
                placeholder="Notice Body"
                cols='8'
                rows='8'
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              {errors?.body && <p className='text-red-500'>{errors?.body}</p>}
              <div className='w-full flex justify-end items-center mt-3'>
                <Button proccessing={isProcessing}>Submit</Button>
              </div>
            </DefaultForm>
          </Processing>
        </div>
      </InnerSection>
    </Section>
  );
};

export default Edit;
