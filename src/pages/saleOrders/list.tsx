import { Button, Table, Typography } from "@douyinfe/semi-ui";
import { HttpError, useGo, useTable } from "@refinedev/core";
import { IItem, ISaleOrder } from "@src/interfaces";
import { useMemo } from "react";

export const SaleOrderList = () => {
  const go = useGo();
  const { Title } = Typography;
  const columns = [
    {
      title: "ID",
      dataIndex: "Mã đơn hàng",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer.partnerName",
    },
  ];
  const { tableQueryResult, current, setCurrent, pageSize } = useTable<
    ISaleOrder,
    HttpError
  >({
    resource: "sale-orders",
    pagination: {
      pageSize: 10,
    },
  });
  const saleOrders = tableQueryResult?.data?.data;
  const total = tableQueryResult?.data?.meta?.total;
  const isLoading = tableQueryResult?.isLoading || tableQueryResult?.isFetching;
  const pagination = useMemo(
    () => ({
      pageSize: pageSize,
      currentPage: current,
      total,
      onPageChange: (page: number) => setCurrent(page),
    }),
    [current, pageSize, setCurrent, total]
  );
  return (
    <div>
      <div className="flex items-end justify-between gap-4 px-6 py-5 ">
        <Title heading={4}>Hàng hoá</Title>
        <Button
          theme="solid"
          onClick={() => {
            go({
              to: "/sale-orders/create",
              type: "push",
            });
          }}
        >
          Thêm mới
        </Button>
      </div>
      <div className="">
        <Table
          columns={columns}
          dataSource={saleOrders}
          pagination={pagination}
          loading={isLoading}
        />
      </div>
    </div>
  );
};
