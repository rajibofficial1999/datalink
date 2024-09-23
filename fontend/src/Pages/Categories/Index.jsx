import Table from "../../Components/Table.jsx";
import { useEffect, useState } from "react";
import request from "../../utils/request.js";
import { CATEGORIES } from "../../utils/api-endpoint.js";
import Section from "../../Components/Section.jsx";
import Processing from "../../Components/Processing.jsx";
import ShowDataIfFound from "../../Components/ShowDataIfFound.jsx";
import Action from "../../Components/Action.jsx";
import { routes } from "../../routes/index.js";
import { successToast } from "../../utils/toasts/index.js";
import Pagination from "../../Components/Pagination.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import TableCheckbox from "../../Components/TableCheckbox.jsx";
import { handleMultipleDelete } from "../../utils/index.js";

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const tableColumns = ['Name', 'Action'];

  const fetchCategories = async (page) => {
    setIsProcessing(true);
    try {
      const { data } = await request.get(`${CATEGORIES}?page=${page}`);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (categoryId) => {
    setIsProcessing(true);
    try {
      const { data } = await request.delete(`${CATEGORIES}/${categoryId}`);
      successToast(data.success);
      await pageRefresh();
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const pageRefresh = async () => {
    await fetchCategories(currentPage);
  };

  const handlePagination = async (page) => {
    setCurrentPage(page);
    await fetchCategories(page);
  };

  const handleCheckedItems = async () => {
    setIsProcessing(true)
    await handleMultipleDelete('categories')
    await fetchCategories(currentPage)
    setIsProcessing(false)
  }

  useEffect(() => {
    pageRefresh();
  }, []);

  return (
    <Section>
      <InnerSection heading='Services'>
        <Processing processing={isProcessing}>
          <ShowDataIfFound data={categories?.data}>
            <Table tableColumns={tableColumns} handleCheckedItems={handleCheckedItems}>
              {categories?.data?.map(category => (
                <tr key={category.id}>
                  <th>
                    <TableCheckbox value={category.id} />
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="font-bold">{category.name}</div>
                    </div>
                  </td>
                  <td>
                    <Action data={category} url={routes.categories} handleDelete={handleDelete} />
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination
              data={categories}
              handlePagination={handlePagination}
              currentPage={currentPage}
            />
          </ShowDataIfFound>
        </Processing>
      </InnerSection>
    </Section>
  );
};

export default Index;
