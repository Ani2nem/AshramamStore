import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="flex flex-col justify-center mt-[5rem] w-full">
        {data && data.length > 0 && <ProductCarousel products={data} />}
        <div className="xl:block flex flex-col flex-wrap justify-between pl-10 bg-slate-100 w-full p-[3rem]">
          <h1 className="ml-[2rem] mb-[3rem] text-[3rem] text-4xl">Top Products</h1>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2">
            {data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;