import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto mt-[3rem] bg-black pt-5 w-full">
      <div className="flex justify-around items-center flex-wrap mb-[2rem]">
        <form onSubmit={submitHandler} className="w-[40rem]">
          <h1 className="text-4xl font-semibold mb-8 text-white">SHIPPING</h1>
          <div className="mb-4">
            <label className="block text-base font-semibold mb-2 ml-0.5 text-white">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-base font-semibold mb-2 ml-0.5 text-white">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-base font-semibold mb-2 ml-0.5 text-white">Postal Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-base font-semibold mb-2 ml-0.5 text-white">Country</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="mb-[2rem]">
            <label className="block text-slate-200">Select Method</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-500"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span className="ml-2 text-white">PayPal or Credit Card</span>
              </label>
            </div>
          </div>

          <button
            className="bg-green-500 text-white active:text-black px-5 py-2 rounded cursor-pointer my-[0rem] flex w-[100%] justify-center hover:bg-green-600 active:bg-green-900"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
      <ProgressSteps step1 step2 />
    </div>
  );
};

export default Shipping;
