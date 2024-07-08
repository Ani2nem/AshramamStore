import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from 'sonner'
import AdminMenu from "../Admin/AdminMenu";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="bg-black text-white w-full h-[100vh] pt-[4rem] pb-[4rem]">
    
    <div className="container mx-auto p-4 mt-[6rem]">
       <AdminMenu />
      <div className="flex justify-center align-center md:flex md:space-x-4">
      <Toaster richColors position="top-center"/>
        <div className="md:w-1/2">
          <h2 className="text-4xl font-semibold mb-10 text-center">UPDATE PROFILE</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-base font-semibold mb-1 ml-0.5">Update Name</label>
              <input
                type="text"
                placeholder="Enter new name"
                className="mt-2 p-2 border rounded w-full text-black"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-base font-semibold mb-1 ml-0.5">Update Email Address</label>
              <input
                type="email"
                placeholder="Enter new email"
                className="mt-2 p-2 border rounded w-full text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-base font-semibold mb-1 ml-0.5">Update Password</label>
              <input
                type="password"
                placeholder="New password"
                className="mt-2 p-2 border rounded w-full text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-base font-semibold mb-1 ml-0.5">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="mt-2 p-2 border rounded w-full text-black mb-8"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 active:bg-green-900 hover:text-black"
              >
                Update
              </button>

              <Link
                to="/user-orders"
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 active:bg-green-900  hover:text-black"
              >
                My Orders
              </Link>
            </div>
            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Profile;
