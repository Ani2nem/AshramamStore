import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="pt-[4rem] pb-[2rem] w-full bg-black flex justify-center">
      <div className="">
      <h1 className="text-4xl font-semibold mb-10 text-left mt-[2rem] pl-[5rem] text-white">
        FAVORITE PRODUCTS
      </h1>
      {(favorites.length == 0)? <p className="text-white xl:ml-[2.5vw]">Click on the 🩷 icon on the top of a product to add Favorites!</p> :
      <div className="flex justify-center flex-wrap pb-[5rem] mb-[-1rem]">
        {favorites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      
    }
    </div>
    </div>
  );
};

export default Favorites;
