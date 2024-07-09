import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Toaster, toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.warning("Please enter all fields!");
      return;
    }
    
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Invalid credentials");
    }
  };

  return (
    <div className="bg-black text-white w-full  pt-[4rem] pb-[4rem]">
      <section className="container mx-auto p-4 mt-[2rem] flex justify-center align-center md:flex md:space-x-4">
        <div className="mr-[4rem] mt-[5rem] sm:w-1/2">
          <Toaster richColors position="top-center" />
          <h1 className="text-4xl font-semibold mb-10 text-center">LOGIN</h1>

          <form onSubmit={submitHandler} className="container">
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-base font-semibold mb-1 ml-0.5"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-2 p-2 border rounded w-full text-black"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </div>

            <div className="mb-10">
              <label
                htmlFor="password"
                className="block text-base font-semibold mb-1 ml-0.5"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full text-black"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-green-500 text-white px-5 py-2 rounded cursor-pointer my-[0rem] flex w-[100%] justify-center hover:bg-green-600 active:bg-green-900"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
            {isLoading && <Loader />}
          </form>

          <div className="mt-6 flex justify-center text-[1.1rem]">
            <p>
              New customer? &nbsp;
            </p>
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-green-500 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
