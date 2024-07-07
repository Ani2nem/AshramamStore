import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="bg-black pt-5 ">
      {!keyword ? <div><Header /></div> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError.data.message || isError.error || "An unexpected error occurred"}
        </Message>
      ) : (
        <div className="bg-black w-95">
          <div className="flex justify-between items-center mb-[5rem]">
            <h1 className="ml-[8rem] mt-[3rem] text-[3rem] text-orange-600 text-6xl">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-green-500 hover:bg-green-600 active:bg-green-900 hover:text-white active:text-black font-bold rounded-full py-2 px-10 mr-[10rem] mt-[3em]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap pb-[10rem] mb-[-1rem] -ml-[6rem]">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
