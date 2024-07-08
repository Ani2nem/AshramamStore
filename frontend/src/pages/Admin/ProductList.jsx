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
  const { data: categories } = useFetchCategoriesQuery();

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
  <div className="bg-black text-white pt-[4rem] pb-[4rem] w-full">
    <div className="container xl:mx-[9rem] sm:mx-[0] mt-[2rem] w-full">
      <Toaster richColors position="top-center" />
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="text-4xl font-semibold mb-7 text-left">Create Product</div>

          {imageUrl && (
            <div className="text-center text-white">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px] text-white"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-[60rem] text-center rounded-lg cursor-pointer font-bold py-11">
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
                  className="p-4 mb-3 w-[28rem] border rounded-lg bg-stone-50 text-black mr-[3rem]"
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
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="py-3 px-5 mt-5 rounded-lg text-lg font-bold bg-green-500 hover:bg-green-600 active:bg-green-800 w-[60rem] text-black hover:text-white active:text-black"
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
