import Section from "../../Components/Section.jsx";
import { useState, useEffect } from "react";
import request from "../../utils/request.js";
import { WEBSITE_URLS } from "../../utils/api-endpoint.js";
import Button from "../../Components/Button.jsx";
import { cn } from "../../utils/index.js";
import { useSelector } from "react-redux";
import Processing from "../../Components/Processing.jsx";
import ShowDataIfFound from "../../Components/ShowDataIfFound.jsx";
import ClipboardData from "../../Components/ClipboardData.jsx";
import { routes } from "../../routes/index.js";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid/index.js";
import DefaultTooltip from "../../Components/DefaultTooltip.jsx";
import ForSuperAdmin from "../../Components/ForSuperAdmin.jsx";

const Index = () => {
  const authUser = useSelector(state => state.auth.user);
  const [sites, setSites] = useState([]);
  const [websiteUrls, setWebsiteUrls] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [category, setCategory] = useState('login')
  const [site, setSite] = useState('eros');

  const fetchWebsiteUrls = async (site = null, category = nullage) => {
    setIsProcessing(true);
    try {
      const url = `${WEBSITE_URLS}/${site}/${category}`;
      const { data } = await request.get(`${url}`);
      setWebsiteUrls(data.websiteUrls);
      setSites(data.sites);
    } catch (error) {
      console.error('Error fetching website URLs:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSiteChange = (ev) => {
    setSite(ev.target.value);
    fetchWebsiteUrls(ev.target.value, category)
  };

  const handleCategoryChange = (ev) => {
    console.log(ev.target.value);
    setCategory(ev.target.value);
    fetchWebsiteUrls(site, ev.target.value)
  };


  useEffect(() => {
    fetchWebsiteUrls(site, category);
  }, []);

  return (
    <Section>
      <div className="mx-auto mt-5 bg-base-100 text-base-content p-10">
        <div className='flex justify-between items-center'>
          <h4 className="mb-6 text-xl font-semibold">Website New URLs</h4>
          <ForSuperAdmin user={authUser}>
            <Button as='link' to={routes.createWebsiteUrl}>Create Urls</Button>
          </ForSuperAdmin>
        </div>
        <div className="my-6 flex items-center justify-center gap-2 flex-wrap text-center">
            {sites?.map(item => (
              <Button
                key={item}
                className={cn('px-5 w-28 text-nowrap uppercase', site === item ? '' : 'bg-gray-500')}
                value={item}
                onClick={handleSiteChange}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className='my-6 flex items-center justify-center gap-2 flex-wrap text-center'>
            <Button
              className={cn('px-5 w-28 text-nowrap', category === 'login' ? 'bg-blue-600' : 'bg-gray-500')}
              value='login'
              onClick={handleCategoryChange}
            >
              Login page
            </Button>
            <Button
              className={cn('px-5 w-28 text-nowrap', category === 'video_calling' ? 'bg-blue-600' : 'bg-gray-500')}
              value='video_calling'
              onClick={handleCategoryChange}
            >
              Video Calling
            </Button>
          </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6 bg-base-300 py-5 px-5">
            <div className="flex justify-start items-center gap-28">
              <h5 className="text-sm font-medium uppercase">PAGE</h5>
              <h5 className="text-sm font-medium uppercase">URL</h5>
            </div>
            <h5 className="text-sm font-medium uppercase">Action</h5>
          </div>
          <Processing processing={isProcessing}>
            <ShowDataIfFound data={websiteUrls}>
              {websiteUrls?.map(website => (
                <div key={website.id} className="flex justify-between items-center border-b border-gray-300 border-opacity-20 gap-5">
                  <div className="flex justify-start items-center gap-6 w-full">
                    <div className="py-2 w-full max-w-[145px]">
                      <p className='text-info text-nowrap font-semibold text-md capitalize'><span className="uppercase">{website.site}</span> / {website.category_type} </p>
                    </div>
                    <div className="py-2 w-full">
                      {
                        website.url ?
                          <p className='text-blue-700 italic text-md'>{`${website.url}?id=${authUser?.access_token}`}</p>
                          :
                          <p>Only for premium member.</p>
                      }
                    </div>
                  </div>
                  <div className="flex items-center justify-center py-2 col-span-2">
                    {
                      website.url ? 
                        <DefaultTooltip value='Copy Link'>
                          <ClipboardData value={`${website.url}?id=${authUser?.access_token}`}>
                            <Button type='button' className='bg-green-600 hover:bg-green-700 duration-200 p-3'>
                              <DocumentDuplicateIcon className='size-5' />
                            </Button>
                          </ClipboardData>
                        </DefaultTooltip>
                        :
                        <Button type='button' className='bg-gray-600 cursor-not-allowed hover:bg-gray-600 duration-200 p-3'>
                          <DocumentDuplicateIcon className='size-5' />
                        </Button>
                    }
                  </div>
                </div>
              ))}
            </ShowDataIfFound>
          </Processing>
        </div>
      </div>
    </Section>
  );
};

export default Index;
