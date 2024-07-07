import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { Toaster, toast } from 'sonner';

const AdminProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  console.log(productData);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.success("Item added successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);
      
      // Update product using the RTK Query mutation
      const data = await updateProduct({ productId: params._id, formData });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Product successfully updated");
        setTimeout(() => navigate("/admin/allproductslist"), 1000);  // Delay navigation by 2 seconds
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.");
    }
  };


  const handleDelete = async () => {
    try {
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`);
      setTimeout(() => navigate("/admin/allproductslist"), 1000);
      
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    }
  };

  const deleteHandler = async () => {
    toast('Confirm Delete', {
      action: {
        label: 'Yes',
        onClick: () => handleDelete()
      },
    })
  };


  return (
    <>
      <div className="container  xl:mx-[9rem] sm:mx-[0] mt-[5rem]">
      <Toaster richColors position="top-center" />
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-3">
            <div className="text-4xl font-semibold mb-10 text-left">Update / Delete Product</div>

            {image && (
              <div className="text-center">
                <img
                  src={image}
                  alt="product"
                  className="block mx-auto w-full h-[40%]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="text-white  py-2 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {image ? image.name : "Upload image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="text-white"
                />
              </label>
            </div>

            <div className="p-3">
            <div className="flex">
              <div className="one block text-base font-semibold mb-1 ml-0.5">
                <label htmlFor="name">Name</label> <br />
                <input
                  type="text"
                  placeholder="Name"
                  className="p-4 mb-3 w-[28rem] border rounded-lg bg-stone-50 text-black mr-[3rem]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="two block text-base font-semibold mb-1 ml-0.5">
                <label htmlFor="name block">Price</label> <br />
                <input
                  type="number"
                  placeholder="Price"
                  className="p-4 mb-3 w-[28rem] border rounded-lg bg-stone-50 text-black"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex">
              <div className="one block text-base font-semibold mb-1 ml-0.5">
                <label htmlFor="name block">Quantity</label> <br />
                <input
                  type="number"
                  placeholder="Quantity"
                  className="p-4 mb-3 w-[28rem] border rounded-lg bg-stone-50 text-black mr-[3rem]"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="two block text-base font-semibold mb-1 ml-0.5">
                <label htmlFor="name block">Brand</label> <br />
                <input
                  type="text"
                  placeholder="Brand"
                  className="p-4 mb-3 w-[28rem] border rounded-lg bg-stone-50 text-black"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5 block text-base font-semibold mb-1 ml-0.5">
              Description
            </label>
            <textarea
              type="text"
              placeholder="Product Description"
              className="p-2 mb-3 bg-stone-50 border rounded-lg w-[59rem] text-black font-semibold"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-between text-base font-semibold mb-1 ml-0.5">
              <div>
                <label htmlFor="name block">Count In Stock</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[28rem] border rounded-lg bg-stone-50 text-black mr-[2rem]"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="">Category</label> <br />
                <select
                  placeholder="Choose Category"
                  className="p-4 mb-3 w-[28rem] border rounded-lg bg-stone-50 text-black"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                   <option value="" disabled>Select a category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              </div>

              <div className="">
                <button
                  onClick={handleSubmit}
                  className="py-3 px-5 mt-5 rounded-lg text-lg font-bold bg-green-500 hover:bg-green-600 active:bg-green-800 w-[60rem] text-black hover:text-white active:text-black"
                >
                  Update
                </button>
                <button
                  onClick={deleteHandler}
                  className="py-3 px-5 mt-5 rounded-lg text-lg font-bold bg-red-500 hover:bg-red-600 active:bg-red-800 w-[60rem] text-black hover:text-white active:text-black"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductUpdate;