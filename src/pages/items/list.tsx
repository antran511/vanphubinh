import { Button, Pagination, Table, Typography } from "@douyinfe/semi-ui";
import { HttpError, useGo, useTable } from "@refinedev/core";
import { IItem } from "@src/interfaces";
import { useMemo } from "react";

export const ItemList = () => {
  const go = useGo();
  const { Title } = Typography;
  const columns = [
    {
      title: "Tên mặt hàng",
      dataIndex: "itemName",
    },
    {
      title: "Đơn vị tính",
      dataIndex: "uom.uomName",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "itemType",
    },
  ];
  const { tableQueryResult, current, setCurrent, pageSize } = useTable<
    IItem,
    HttpError
  >({
    resource: "items",
    pagination: {
      pageSize: 10,
    },
  });
  const items = tableQueryResult?.data?.data;
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
              to: "/items/create",
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
          dataSource={items}
          pagination={pagination}
          loading={isLoading}
        />
      </div>
    </div>
  );
};
