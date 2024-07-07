import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="pt-[4rem] pb-[4rem] w-full h-[100vh] bg-black">
      <div className="ml-[5rem]">
      <h1 className="text-4xl font-semibold mb-10 text-left mt-[2rem] text-white">
        FAVORITE PRODUCTS
      </h1>
      {(favorites.length == 0)? <p className="text-white">Click on the 🩷 icon on the top of a product to add Favorites!</p> :
      <div className="flex flex-wrap">
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
