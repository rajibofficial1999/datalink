import Section from "../../Components/Section.jsx";
import { useState, useEffect } from "react";
import request from "../../utils/request.js";
import { CATEGORIES, WEBSITE_URLS } from "../../utils/api-endpoint.js";
import Button from "../../Components/Button.jsx";
import { cn } from "../../utils/index.js";
import { useSelector } from "react-redux";
import Processing from "../../Components/Processing.jsx";
import ShowDataIfFound from "../../Components/ShowDataIfFound.jsx";
import ClipboardData from "../../Components/ClipboardData.jsx";
import { routes } from "../../routes/index.js";
import Action from "../../Components/Action.jsx";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid/index.js";
import DefaultTooltip from "../../Components/DefaultTooltip.jsx";
import { successToast } from "../../utils/toasts/index.js";
import Pagination from "../../Components/Pagination.jsx";

const Index = () => {
  const authUser = useSelector(state => state.auth.user);
  const [categories, setCategories] = useState([]);
  const [websiteUrls, setWebsiteUrls] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCategoryProcessing, setIsCategoryProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsCategoryProcessing(true);
    try {
      const { data } = await request.get(CATEGORIES);
      setCategories(data);
      if (data.data.length > 0) {
        setCategoryId(data.data[0].id);
        fetchWebsiteUrls(data.data[0].id, currentPage);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsCategoryProcessing(false);
    }
  };

  const fetchWebsiteUrls = async (cateId = null, page) => {
    setIsProcessing(true);
    try {
      const url = cateId ? `${WEBSITE_URLS}/${cateId}` : WEBSITE_URLS;
      const { data } = await request.get(`${url}?page=${page}`);
      setWebsiteUrls(data);
    } catch (error) {
      console.error('Error fetching website URLs:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (websiteUrlId) => {
    setIsProcessing(true);
    try {
      const { data } = await request.delete(`${WEBSITE_URLS}/${websiteUrlId}`);
      successToast(data.success);
      fetchWebsiteUrls(categoryId, currentPage);
    } catch (error) {
      console.error('Error deleting website URL:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCategoryChange = (ev) => {
    setCategoryId(parseInt(ev.target.value));
    fetchWebsiteUrls(ev.target.value, 1)
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
    fetchWebsiteUrls(categoryId, page)
  };

  return (
    <Section>
      <div className="mx-auto mt-5 bg-base-100 text-base-content p-10">
        <h4 className="mb-6 text-xl font-semibold">Website URLs</h4>
        <div className="my-7 flex items-center justify-center gap-2 flex-wrap text-center">
          <Processing processing={isCategoryProcessing}>
            {categories?.data?.map(cate => (
              <Button
                key={cate.id}
                className={cn('px-5 w-28', categoryId === cate.id ? '' : 'bg-gray-500')}
                value={cate.id}
                onClick={handleCategoryChange}
              >
                {cate.name}
              </Button>
            ))}
          </Processing>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6 bg-base-300 py-5 px-5">
            <h5 className="text-sm font-medium uppercase">URL</h5>
            <h5 className="text-sm font-medium uppercase">Action</h5>
          </div>
          <Processing processing={isProcessing}>
            <ShowDataIfFound data={websiteUrls?.data}>
              {websiteUrls?.data?.map(website => (
                <div key={website.id} className="flex justify-between items-center border-b border-gray-300 border-opacity-20">
                  <div className="flex items-center gap-3 col-span-8 py-2">
                    <p className='text-blue-700 italic text-md'>{`${website.url}?id=${authUser?.access_token}`}</p>
                  </div>
                  <div className="flex items-center justify-center py-2 col-span-2">
                    <Action
                      deleteButton={authUser.is_super_admin}
                      data={website}
                      url={routes.websiteUrls}
                      handleDelete={handleDelete}
                      editLink={false}
                    >
                      <DefaultTooltip value='Copy Link'>
                        <ClipboardData value={`${website.url}?id=${authUser?.access_token}`}>
                          <Button type='button' className='bg-green-600 hover:bg-green-700 duration-200'>
                            <DocumentDuplicateIcon className='size-4' />
                          </Button>
                        </ClipboardData>
                      </DefaultTooltip>
                    </Action>
                  </div>
                </div>
              ))}
            </ShowDataIfFound>
          </Processing>
          <Pagination
            data={websiteUrls}
            handlePagination={handlePagination}
            currentPage={currentPage}
          />
        </div>
      </div>
    </Section>
  );
};

export default Index;
