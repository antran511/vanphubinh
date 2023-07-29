import { Button, Table, Typography, Modal } from "@douyinfe/semi-ui";
import { HttpError, useGo, useTable } from "@refinedev/core";
import { ISaleOrder } from "@src/interfaces";
import { useMemo } from "react";

export const SaleOrderList = () => {
  const go = useGo();
  const { Title } = Typography;
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
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
      pageSize: 15,
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
    <div className="px-6">
      <div className="flex items-end justify-between gap-4 py-5">
        <Title heading={4}>Đơn đặt hàng</Title>
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
          style={{ maxHeight: "30%" }}
          columns={columns}
          dataSource={saleOrders}
          pagination={pagination}
          loading={isLoading}
          size="middle"
        />
      </div>
    </div>
  );
};
