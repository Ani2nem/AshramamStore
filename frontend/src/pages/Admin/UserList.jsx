import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { Toaster, toast } from 'sonner'
// ⚠️⚠️⚠️ don't forget this ⚠️⚠️⚠️⚠️
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);


  
  const completeDelete = async (id) => {
    try {
      await deleteUser(id);
      refetch();
      toast.success("User Deleted Successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteHandler = async (id) => {
    toast('Confirm Delete', {
      action: {
        label: 'Yes',
        onClick: () => completeDelete(id)
      },
    })
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap(); 
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to update user");
    }
  };
  
  return (
    <div className=" bg-black text-white pt-[6rem] pb-[3rem]">
    <h1 className="text-2xl md:text-3xl lg:3xl xl:4xl font-semibold w-full flex justify-center">USERS</h1>
    <div className="p-4 mt-[2rem] flex justify-center w-[30rem] ml-[1rem] md:w-full">
      <Toaster richColors position="top-center"/>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row text-xs md:text-base lg:text-lg justify-center pl-[10rem] md:pl-[0rem]">
          <div className="flex flex-col bg-black">
          <AdminMenu /> 
          </div>
          <table className="w-full ">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left  font-semibold">ID</th>
                <th className="px-4 py-2 text-left font-semibold">NAME</th>
                <th className="px-4 py-2 text-left font-semibold">EMAIL</th>
                <th className="px-4 py-2 text-left  font-semibold">ADMIN</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2">{user._id}</td>
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      <div className="flex items-center text-sm font-semibold">
                        <input
                          type="text"
                          value={editableUserName}
                          onChange={(e) => setEditableUserName(e.target.value)}
                          className="w-full p-2 border text-black rounded-sm"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-green-600 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm font-semibold">
                        {user.username}{" "}
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      <div className="flex items-center text-sm font-semibold">
                        <input
                          type="text"
                          value={editableUserEmail}
                          onChange={(e) => setEditableUserEmail(e.target.value)}
                          className="w-full p-2 border rounded-sm text-black"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-green-600 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <a href={`mailto:${user.email}`}>{user.email}</a>{" "}
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.name, user.email)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {!user.isAdmin && (
                      <div className="flex">
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
  );
};

export default UserList;