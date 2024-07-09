import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="lg:w-[35rem] md:w-[30rem] w-[25rem] ml-[3.4rem] p-3 relative">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="lg:w-[40rem] md:w-[30rem] w-[25rem] rounded-2xl"
        />
        <HeartIcon product={product} size={30}/>
      </div>

      <div className="py-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center text-white">
            <div className="text-2xl">{product.name}</div>
            <span className="bg-green-700 text-white text-sm font-medium mr-2 px-2.5 py-0.5">
              ₹ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
