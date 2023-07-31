import { Button, Table, Typography } from "@douyinfe/semi-ui";
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
      pageSize: 15,
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
    <div className="px-6">
      <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
        <Title heading={3}>Hàng hoá</Title>
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
          size="middle"
        />
      </div>
    </div>
  );
};
