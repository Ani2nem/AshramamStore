import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { AiOutlineInbox, AiOutlineUser } from "react-icons/ai";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { FaBlackTie } from "react-icons/fa";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        background: 'transparent',
        foreColor: '#fff',
        fontFamily: 'Arial, sans-serif',
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00e325"],
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px', 
          fontWeight: 400, 
        },
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          fontSize: '50px', // Increase title font size
          fontWeight: 700, // Slightly bolder than normal
        },
        
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            fontSize: '20px', // Increase x-axis title font size
          },
        },
        labels: {
          style: {
            fontSize: '14px',  // Increase x-axis label font size
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales",
          style: {
            fontSize: '20px', // Increase y-axis title font size
          },
        },
        min: 0,
        labels: {
          style: {
            fontSize: '14px', // Increase y-axis label font size
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="container flex flex-col ml-[5rem] text-white bg-black pt-[3rem] w-full pb-[3rem]">
      <AdminMenu />

      <section className="xl:ml-[0rem] md:ml-[0rem]">
        <div className="w-full flex justify-center xl:ml-[7rem] md:ml-[6rem]">
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-green-500 text-center p-3 text-xl">
              ₹
            </div>

            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
            ₹ {isLoading ? <Loader /> :  sales?.totalSales ? sales.totalSales.toFixed(2) : '0.00'}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-green-500 text-center p-3 flex justify-center">
            <AiOutlineUser size={22}/>
            </div>

            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
             {isLoading ? <Loader /> : customers?.length}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-green-500 flex justify-center p-3">
            <AiOutlineInbox size={22} />
            </div>

            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
             {isLoading ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="w-full mt-[4rem] xl:ml-[9rem] md:ml-[6rem]">
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="80%"
          />
        </div>

        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;