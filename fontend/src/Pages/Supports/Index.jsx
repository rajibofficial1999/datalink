import Section from "../../Components/Section.jsx";
import Processing from "../../Components/Processing.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import { useEffect, useState } from "react";
import Button from "../../Components/Button.jsx";
import { routes } from "../../routes/index.js";
import request from "../../utils/request.js";
import { SUPPORTS } from "../../utils/api-endpoint.js";
import { successToast } from "../../utils/toasts/index.js";
import ShowDataIfFound from "../../Components/ShowDataIfFound.jsx";
import LoadImage from "../../Components/LoadImage.jsx";
import Action from "../../Components/Action.jsx";
import Pagination from "../../Components/Pagination.jsx";
import ForSuperAdmin from "../../Components/ForSuperAdmin.jsx";
import { useSelector } from "react-redux";
import { CurrencyBangladeshiIcon } from "@heroicons/react/24/solid/index.js";

const Index = () => {
  const APP_URL = import.meta.env.VITE_API_URL;
  const authUser = useSelector(state => state.auth.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [supports, setSupports] = useState(null);

  const fetchSupports = async (page) => {
    setIsProcessing(true);
    try {
      const { data } = await request.get(`${SUPPORTS}?page=${page}`);
      setSupports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (supportId) => {
    setIsProcessing(true);
    try {
      const { data } = await request.delete(`${SUPPORTS}/${supportId}`);
      successToast(data.success);
      fetchSupports(currentPage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
    fetchSupports(page);
  };

  useEffect(() => {
    fetchSupports(currentPage);
  }, [currentPage]);

  const renderSupports = () => {
    return supports?.data?.map(support => (
      <div
        key={support.id}
        className='border border-blue-600 border-opacity-20 size-full min-h-48 rounded-md relative group duration-300'
      >
        <div className='w-full h-[calc(100%-3rem)] border-b border-blue-600 border-opacity-20'>
          <a href={support.contact_url} target='_blank' rel='noopener noreferrer'>
            <LoadImage
              className='object-cover size-full rounded-t-md'
              src={`${APP_URL}/storage/${support.image}`}
              alt={support.contact_url}
            />
          </a>
        </div>
        <div className='text-center absolute left-1/2 bottom-3 -translate-x-1/2'>
          <p className='font-semibold flex justify-center items-center gap-1 text-nowrap'>
            Price: {support.price} <CurrencyBangladeshiIcon className='size-5'/>
          </p>
        </div>
        <ForSuperAdmin user={authUser}>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-300'>
            <Action data={support} url={routes.supports} handleDelete={handleDelete}/>
          </div>
        </ForSuperAdmin>
      </div>
    ));
  };

  return (
    <Section>
      <InnerSection
        heading='Supports'
        headingButton={authUser.is_super_admin && (
          <Button className='px-4' as='link' to={routes.createSupport}>
            Create Support
          </Button>
        )}
      >
        <Processing processing={isProcessing}>
          <ShowDataIfFound data={supports}>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-5'>
              {renderSupports()}
            </div>
          </ShowDataIfFound>
        </Processing>
      </InnerSection>
      <Pagination data={supports} handlePagination={handlePagination} currentPage={currentPage} />
    </Section>
  );
};

export default Index;
