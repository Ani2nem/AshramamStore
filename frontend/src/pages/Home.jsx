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
    <div className="bg-slate-100 pt-5">
      {!keyword ? <div><Header /></div> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError.data.message || isError.error || "An unexpected error occurred"}
        </Message>
      ) : (
        <div className="bg-orange-600">
          <div className="flex justify-between items-center mb-[7rem]">
            <h1 className="ml-[10rem] mt-[10rem] text-[3rem] text-white text-6xl">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-green-500 hover:bg-green-600 active:bg-green-900 hover:text-white active:text-black font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem] pb-[10rem] mb-[-1rem]">
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
