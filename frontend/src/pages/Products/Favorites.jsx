import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[10rem]">
      <h1 className="text-4xl font-semibold mb-10 text-left mt-[4rem]">
        FAVORITE PRODUCTS
      </h1>
      {(favorites.length == 0)? "Click on the 🩷 icon on the top of a product to add Favorites!" :
      <div className="flex flex-wrap">
        {favorites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    }
    </div>
  );
};

export default Favorites;
