import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="bg-black pt-5 w-full h-[100vh]">
      <div className="container flex justify-around items-start flex wrap mx-auto mt-[4rem] ">
        {cartItems.length === 0 ? (
          <div className=" text-white">
            <p className="flex justify-center w-full text-lg">Your cart is empty!</p>
            <br></br>
            <br></br>
            <Link to="/shop">
            <button className="flex justify-center w-full bg-green-500 py-[1rem] rounded-lg text-xl hover:bg-green-600 active:bg-green-900 hover:text-black active:text-white">
              SHOP!
            </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="text-4xl font-semibold mb-10 text-left text-white">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-enter mb-[1rem] pb-2  w-full rounded-lg py-3 px-3 bg-[#1A1A1A] border-2 border-neutral-800">
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <Link to={`/product/${item._id}`} className="text-lg text-white pl-5">
                      {item.name}
                    </Link>

                    <div className="mt-0 text-white text-sm pl-6">{item.brand}</div>
                    <div className="mt-0 text-white font-bold pl-5">
                      ₹ {item.price}
                    </div>
                  </div>

                  <div className="w-[3rem] flex flex-col justify-center mt-3">
                    <select
                      className="w-full p-1 border-gray-950 border rounded text-white text-base bg-[#151515]"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col justify-center">
                    <button
                      className="text-red-500 mr-[5rem]"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-[2rem] mt-[.5rem]" size={22}/>
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <div className="text-2xl font-bold text-white">
                    ₹{" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </div>
                    <div className="flex justify-center md:w-[60rem]  sm:w-1/2">
                      <button
                        className="bg-green-500 hover:bg-green-600 active:bg-green-900 active:text-black text-white mt-[4rem] mb-[3rem] py-2 px-4 rounded-full text-lg w-[30rem]"
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                      >
                        Proceed To Checkout
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;