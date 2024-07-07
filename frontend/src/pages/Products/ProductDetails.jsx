import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from 'sonner';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId, {
    refetchOnMountOrArgChange: true,
  });

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

    const submitHandler = async (e) => {
      e.preventDefault();
    
      try {
        await createReview({
          productId,
          rating,
          comment,
        }).unwrap();
        await refetch(); 
        toast.success("Review created successfully");
        setRating(0);
        setComment("");
      } catch (error) {
        toast.error(error.message || "You've already reviewed this product!");
      }
    };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    < div className="mt-[2rem] bg-slate-50">
     <Toaster richColors position="top-center" />
      <button className="mt-[2rem]">
        <Link
          to="/"
          className="text-black font-semibold hover:underline hover:text-orange-500 ml-[1.5rem]"
        >
          
           Back
        </Link>
      </button>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-between mt-[2rem] ml-[1rem] mr-[1rem]">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[1rem] rounded-lg"
              />
              <HeartIcon product={product} />
            </div>

            <div className="flex flex-col justify-between p-1 rounded-lg">
              <h2 className="text-5xl font-semibold mb-[-2rem]">{product.name}</h2>
              <p className="text-4xl font-extrabold mb-[-2rem]">₹ {product.price}</p>
              <p className="my-1 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#191818]">
                {product.description}
              </p>

              <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-black" /> Brand:{" "}
                    {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[20rem]">
                    <FaClock className="mr-2 text-black" /> Added:{" "}
                    {moment(product.createAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-black" /> Reviews:{" "}
                    {product.numReviews}
                  </h1>
                </div>

                <div className="two">
                <h1 className="flex items-center mb-6">
                  <FaStar className="mr-2 text-black" /> Ratings:  {product.rating.toFixed(1)}
                </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2 text-black" /> Quantity:{" "}
                    {product.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaBox className="mr-2 text-black" /> In Stock:{" "}
                    {product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between flex-wrap">
              {product.rating > 0 ? (
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} ${product.numReviews === 1 ? 'review' : 'reviews'}`}
                />
              ) : (
                <p>{"No ratings yet :("}</p>
              )}
                
                {product.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg text-black bg-slate-200"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="btn-container">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-green-500 hover:bg-green-600 active:bg-green-900 text-black active:text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem] mb-20">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
