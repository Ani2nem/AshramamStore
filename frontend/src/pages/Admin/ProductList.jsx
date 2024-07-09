import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { Toaster, toast } from 'sonner';
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories, isLoading, error } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const result = await createProduct(productData);
      const { product, error } = result.data;

      if (error) {
        toast.error("Please enter all fields!");
      } else {
        toast.success(`${product.name} is created`);
        setTimeout(() => navigate("/"), 2000);  // Delay navigation by 2 seconds
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.imageUrl);  // Ensure this is the full URL
      setImageUrl(res.imageUrl);  // Ensure this is the full URL
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  return (
  <div className="bg-black text-white pt-[4rem] -mb-[2rem] w-full flex justify-center">
    <div className="mt-[2rem] w-full flex justify-center pb-[2.5rem]">
      <Toaster richColors position="top-center" />
      <div className="flex flex-col md:flex-row justify-center w-full">
        <AdminMenu />
        <div className="p-3">
          <div className="md:text-4xl text-xl font-semibold mb-7 flex justify-center md:w-full">Create Product</div>

          {imageUrl && (
            <div className="text-center text-white">
              <img
                src={imageUrl}
                alt="product"
                className="max-h-[200px] text-white"
              />
            </div>
          )}

          <div className="mb-3 flex justify-center items-center content-center w-full">
            <label className="border text-white px-4 block w-3/5 md:w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name : "Upload Image"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-white"}
              />
            </label>
          </div>

          <div className="p-3 flex flex-col justify-center">
            <div className="flex">
              <div className="text-base font-semibold mb-[2rem] ml-0.5">
                <label htmlFor="name">Name</label> <br />
                <input
                  type="text"
                  placeholder="Name"
                  className="p-2 md:p-3 mb-3 w-[12rem] lg:w-[25rem] border rounded-lg bg-stone-50 mr-[1rem] text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="text-base font-semibold mb-1 ml-0.5">
                <label htmlFor="name block">Price</label> <br />
                <input
                  type="number"
                  placeholder="Price"
                  className="p-2 md:p-3 mb-3 w-[12rem] lg:w-[25rem] border rounded-lg bg-stone-50 text-black"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex">
              <div className="text-base font-semibold mb-1 ml-0.5">
                <label htmlFor="name block">Quantity</label> <br />
                <input
                  type="number"
                  placeholder="Quantity"
                  className="p-2 md:p-3 mb-3 w-[12rem] lg:w-[25rem] border rounded-lg mr-[1rem] bg-stone-50 text-black"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="text-base font-semibold mb-1 ml-0.5">
                <label htmlFor="name block">Brand</label> <br />
                <input
                  type="text"
                  placeholder="Brand"
                  className="p-2 md:p-3 mb-3 w-[12rem] lg:w-[25rem] border rounded-lg bg-stone-50 text-black"
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
              className="p-2 md:p-3 mb-3 w-[20rem] lg:w-full border rounded-lg mr-[1rem] bg-stone-50 text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-between text-base font-semibold mb-1 ml-0.5">
              <div>
                <label htmlFor="name block">Count In Stock</label> <br />
                <input
                  type="text"
                  className="p-2 md:p-3 mb-3 w-[10rem] lg:w-[25rem] border rounded-lg mr-[1rem] bg-stone-50 text-black"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="">Category</label> <br />
                {isLoading ? (
                  <p>Loading categories...</p>
                ) : error ? (
                  <p>Error loading categories. Please try again.</p>
                ) : categories && categories.length > 0 ? (
                  <select
                    placeholder="Choose Category"
                    className="p-2 md:p-3 mb-3 w-[12rem] lg:w-[25rem] border rounded-lg mr-[1rem] bg-stone-50 text-black"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>No categories available.</p>
                )}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="py-3 px-5 mt-5 rounded-lg text-lg font-bold bg-green-500 hover:bg-green-600 active:bg-green-800 text-black hover:text-white active:text-black
              p-2 md:p-3 mb-3 w-[10rem] xl:w-[68rem]"
              disabled={isLoading || !categories || categories.length === 0}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProductList;
