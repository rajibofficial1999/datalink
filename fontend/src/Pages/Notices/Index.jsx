import Section from "../../Components/Section.jsx";
import Processing from "../../Components/Processing.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import { useEffect, useState } from "react";
import { routes } from "../../routes/index.js";
import Button from "../../Components/Button.jsx";
import request from "../../utils/request.js";
import { NOTICES } from "../../utils/api-endpoint.js";
import ShowDataIfFound from "../../Components/ShowDataIfFound.jsx";
import Pagination from "../../Components/Pagination.jsx";
import Action from "../../Components/Action.jsx";
import { successToast } from "../../utils/toasts/index.js";
import { useSelector } from "react-redux";
import ForSuperAdmin from "../../Components/ForSuperAdmin.jsx";

const Index = () => {
  const authUser = useSelector((state) => state.auth.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState();

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  const fetchNotices = async (page) => {
    setIsProcessing(true);
    try {
      const { data } = await request.get(`${NOTICES}?page=${page}`);
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (noticeId) => {
    setIsProcessing(true);
    try {
      const { data } = await request.delete(`${NOTICES}/${noticeId}`);
      successToast(data.success);
      fetchNotices(currentPage);
    } catch (error) {
      console.error('Error deleting notice:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Section className='mb-2'>
        <InnerSection
          heading='Notices'
          className='px-6 pb-2 pt-6'
          headingButton={
            authUser.is_super_admin && (
              <Button className='px-4' as='link' to={routes.createNotice}>
                Create Notice
              </Button>
            )
          }
        />
      </Section>

      <Processing processing={isProcessing}>
        <ShowDataIfFound data={notices}>
          {notices?.data?.map((notice) => (
            <Section key={notice.id} className='mb-2'>
              <InnerSection className='px-4 py-3'>
                <div>
                  <ForSuperAdmin user={authUser}>
                    <Action
                      data={notice}
                      url={routes.notices}
                      className='justify-end mb-4'
                      handleDelete={handleDelete}
                    />
                  </ForSuperAdmin>
                  <div>{notice.body}</div>
                  <p className='text-blue-600 text-sm mt-2 italic'>{notice.time}</p>
                </div>
              </InnerSection>
            </Section>
          ))}

          <Pagination
            data={notices}
            handlePagination={handlePagination}
            currentPage={currentPage}
          />
        </ShowDataIfFound>
      </Processing>
    </>
  );
};

export default Index;
