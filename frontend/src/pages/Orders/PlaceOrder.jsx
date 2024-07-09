import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner'
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="container mx-auto mt-[3rem] bg-black pt-5 w-full text-white pb-[2rem]">
      <Toaster richColors position="top-center"/>
      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto flex justify-center bg-[#1A1A1A] mb-[3rem]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-left  text-base font-semibold mb-2 ml-0.5 text-white border-white border-y-4">Image</td>
                  <td className="px-1 py-2 text-left  text-base font-semibold mb-2 ml-0.5 text-white border-white border-y-4">Product</td>
                  <td className="px-1 py-2 text-left  text-base font-semibold mb-2 ml-0.5 text-white border-white border-y-4">Quantity</td>
                  <td className="px-1 py-2 text-left  text-base font-semibold mb-2 ml-0.5 text-white  border-white border-y-4">Price</td>
                  <td className="px-1 py-2 text-left  text-base font-semibold mb-2 ml-0.5 text-white border-y-white border-y-4">Total</td>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2  border-black border-y-8 pr-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>

                    <td className="p-2 border-black border-y-8 pr-3">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </td>
                    <td className="p-2 border-black border-y-8 pr-3">{item.qty}</td>
                    <td className="p-2 border-black border-y-8 pr-3">{item.price.toFixed(2)}</td>
                    <td className="p-2 border-black border-y-8 pr-3">
                      ₹ {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          <ProgressSteps step1 step2 step3 />
        <div className="mt-[3rem]">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex justify-between flex-wrap p-8 bg-[#181818]">
            <ul className="text-lg">
              <li>
                <span className="font-semibold mb-4">Items:</span> ₹
                {cart.itemsPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Shipping:</span> ₹
                {cart.shippingPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Tax:</span> ₹
                {cart.taxPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Total:</span> ₹
                {cart.totalPrice}
              </li>
            </ul>

            {error && <Message variant="danger">{error.data.message}</Message>}

            <div>
              <h2 className="text-2xl font-semibold mb-4">Shipping to:</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </div>
          </div>

          <button
            type="button"
            className="bg-green-500 text-white active:text-black px-5 py-2 rounded cursor-pointer my-[3rem] flex w-[100%] justify-center hover:bg-green-600 active:bg-green-900"
            disabled={cart.cartItems === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
