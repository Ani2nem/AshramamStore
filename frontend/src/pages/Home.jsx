import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import Header from "../components/Header.jsx";
import Product from "./Products/Product.jsx";

const Home = () => {
  const { keyword } = useParams();
  console.log('Keyword:', keyword);
   // Log the useGetProductsQuery function to ensure it's imported correctly
   console.log('useGetProductsQuery:', useGetProductsQuery);

   // Call the query hook
  const result = useGetProductsQuery({ keyword });

  useEffect(() => {
    console.log('Query Result:', result);
  }, [result]);

  if (result.isLoading) {
    console.log('Query is loading');
    return <div>Loading...</div>;
  }

  if (result.isError) {
    console.error('Query error:', result.error);
    return <div>Error: {result.error.message}</div>;
  }

  if (result.data) {
    console.log('Query data:', result.data);
  }

  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  console.log('Rendering Home component');
  console.log('API Call Status:', { isLoading, isError, data, error });


  return (
    <div className="bg-black w-full -mt-[5rem]">
      {!keyword ? <div><Header /></div> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError.data.message || isError.error || "An unexpected error occurred"}
        </Message>
      ) : (
        <div className="bg-black w-full flex flex-col justify-center mt-[3rem]">
          <div className="flex justify-between items-center mb-[5rem] w-full md:pl-[8rem] md:pr-[6rem] pl-[6rem] pr-[4rem]">
            <h1 className="md:text-[3rem] text-[2rem] mr-[2rem] text-orange-600 text-6xl font-extrabold font-serif">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-green-500 hover:bg-green-600 active:bg-green-900 hover:text-white active:text-black font-bold rounded-full py-2 px-10"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap pb-[5rem] mb-[-1rem] ">
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
