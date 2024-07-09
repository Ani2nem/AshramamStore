import  Message from '../../components/Message';
import Loader from '../../components/Loader';
import {Link} from 'react-router-dom';
import { useGetMyOrdersQuery } from '../../redux/api/orderApiSlice';


const userOrder = () => {
  const {data: orders, isLoading, error} = useGetMyOrdersQuery();
  
  
  return (
    <div className='container mx-auto bg-black text-white w-full  pt-[4rem] pb-[4rem]'>
      <h2 className='text-4xl font-semibold mb-10'>
        My Orders
      </h2>
      {isLoading? (<Loader/>) : error ? (<Message variant='danger'>{error?.data?.error || error.error}</Message >) : (
        
        <table className="container mx-auto">

        <thead className="w-full border">
          <tr className="mb-[5rem]">
            <th className="text-left pl-1">IMAGE</th>
            <th className="text-left pl-1">ID</th>
            <th className="text-left pl-1">DATE</th>
            <th className="text-left pl-1">TOTAL</th>
            <th className="text-left pl-1">PAID</th>
            <th className="text-left pl-1">DELIVERED</th>
            <th className="text-left pl-1">DETAILS</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <img
                  src={order.orderItems[0].image}
                  alt={order._id}
                  className="w-[5rem] pt-4"
                />
              </td>
              <td>{order._id}</td>

              <td>
                {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
              </td>

              <td>₹ {order.totalPrice}</td>

              <td className="py-2">
                {order.isPaid ? (
                  <p className="p-1 text-center bg-green-500 w-[6rem] rounded-lg">
                    Paid
                  </p>
                ) : (
                  <p className="p-1 text-center bg-red-500 w-[6rem] rounded-lg">
                    Not Paid
                  </p>
                )}
              </td>

              <td className="px-2 py-2">
                {order.isDelivered ? (
                  <p className="p-1 text-center bg-green-500 w-[6rem] rounded-lg">
                    Delivered
                  </p>
                ) : (
                  <p className="p-1 text-center bg-red-500 w-[6rem] rounded-lg">
                    Pending
                  </p>
                )}
                </td>

                <td >
                  <Link to={`/order/${order._id}`}>
                    <button className='hover:text-green-500'>View Details</button>
                  </Link>
                </td>

              <td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  )
};

export default userOrder;