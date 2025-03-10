import { Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../utils/api";
const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserApi();
      if (res) {
        setDataSource(res);
      }
    };
    fetchUser();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];

  return (
    <div style={{ padding: 50 }}>
      <Table bordered dataSource={dataSource} columns={columns} rowKey={"id"}/>;
    </div>
  );
};
export default UserPage;
