import { Button, Table, Typography } from "@douyinfe/semi-ui";
import { HttpError, useGo, useTable } from "@refinedev/core";
import { IProductionOrder } from "@src/interfaces";
import { useMemo } from "react";

export const ProductionOrderList = () => {
  const go = useGo();
  const { Title } = Typography;
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Sản phẩm",
      dataIndex: "item.itemName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Đơn vị",
      dataIndex: "item.uom.uomName",
    },
    {
      title: "Số lượng hoàn thành",
      dataIndex: "finishedQuantity",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
    },
  ];
  const { tableQueryResult, current, setCurrent, pageSize } = useTable<
    IProductionOrder,
    HttpError
  >({
    resource: "production-orders",
    pagination: {
      pageSize: 15,
    },
  });
  const productionOrders = tableQueryResult?.data?.data;
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
        <Title heading={4}>Lệnh sản xuất</Title>
        <Button
          theme="solid"
          onClick={() => {
            go({
              to: "/production-orders/create",
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
          dataSource={productionOrders}
          pagination={pagination}
          loading={isLoading}
          size="middle"
        />
      </div>
    </div>
  );
};
