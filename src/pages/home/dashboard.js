import React, { useState, useMemo, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";

import Table from "../../components/table/table";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Auth from "../../hooks/auth";
import { GiPlainCircle } from "react-icons/gi";
import dayjs from "dayjs";
import CardValue from "../../components/dashboard/CardValue";
import { FaUserAlt } from "react-icons/fa";

function Dashboard() {

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: "no",
        Cell: ({ row }) => {
          return <div>{row?.index + 1}</div>;
        },
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Active",
        accessor: "active",
        Cell: ({ row }) => {
          const value = row?.original
          return <div className="flex flex-1 justify-center">
            <GiPlainCircle className={value?.active ? 'text-green-400' : 'text-gray-500'} />
          </div>;
        },
      },
      {
        Header: "Log Out",
        accessor: "logout",
        Cell: ({ row }) => {
          const value = row?.original
          return <div className="flex flex-1 justify-center items-center">
            <div>{value?.logoutAt ? dayjs(value?.logoutAt).format("DD/MM/YYYY HH:mm") : '-'}</div>
          </div>;
        },
      },
    ],
    []
  );
  const { http } = Auth();
  let [data, setData] = useState([]);
  let [chart, setChart] = useState(null);

  const getUser = async () => {
    await http
      .get(`/user/users`)
      .then(function (res) {
        setData(res?.data?.data)
      })
      .catch(function (err) {
        console.log("DB Error -> " + err);
        return err;
      });
  };
  
  const getUserActive = async () => {
    await http
      .get(`/user/dashboard`)
      .then(function (res) {
        setChart(res?.data?.data)
      })
      .catch(function (err) {
        console.log("DB Error -> " + err);
        return err;
      });
  };

  useEffect(() => {
    getUser();
    getUserActive();
  }, []);

  return (
    <>
      <div className="max-w-[1240px] mx-auto">
        <Navbar />
        <div className="mt-5 px-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:flex md:justify-between gap-y-2">
            <CardValue
              icon={<FaUserAlt className="h-20 w-20" />}
              title={'Total User'}
              value={data ? data?.length : 0}
            />
            <CardValue
              icon={<FaUserAlt className="h-20 w-20" />}
              title={'Online User'}
              value={chart?.userActive || 0}
            />
            <CardValue
              icon={<FaUserAlt className="h-20 w-20" />}
              title={'Average Active User 7 Days'}
              value={chart?.average || 0}
            />

          </div>
          <div className="overflow-x-scroll">
            <Table columns={columns} data={data}></Table>

          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
