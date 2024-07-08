import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { Toaster, toast } from 'sonner'
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`)
        setTimeout(() => {
          location.reload();
        }, 500);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
        const categoryId = selectedCategory._id;
        const result = await deleteCategory(categoryId).unwrap();

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(`${result.removedCategory.name} is deleted.`);
            setTimeout(() => {
                location.reload();
            }, 500);
            setSelectedCategory(null);
            setModalVisible(false);
        }
    } catch (error) {
        console.error(error);
        toast.error("Category deletion failed. Try again.");
    }
};


  return (
    <div className="bg-black w-full h-[100vh] pt-[4rem] pb-[rem]">
    <div className="ml-[10rem] flex flex-col md:flex-row text-white mt-[2rem]">
      <Toaster richColors position="top-center"/>
      <AdminMenu />
      <div className="md:w-3/4 p-3">
        <div className="text-4xl font-semibold mb-10 text-left">Manage Categories</div>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                className="text-[#151515] border border-white bg-white py-2 px-4 rounded-lg m-3 hover:bg-green-600 hover:text-white active:text-black text-lg focus:outline-none foucs:ring-2 focus:ring-green-500 focus:ring-opacity-50 "
                onClick={() => {
                  {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} >
          <CategoryForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  </div>
  );
};

export default CategoryList;