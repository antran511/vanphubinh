import {
  IconEyeOpened,
  IconEdit,
  IconDelete,
  IconSearch,
  IconFilter,
} from "@douyinfe/semi-icons";
import {
  Button,
  Table,
  Tag,
  Typography,
  Input,
  Dropdown,
} from "@douyinfe/semi-ui";
import { TagColor } from "@douyinfe/semi-ui/lib/es/tag";
import {
  HttpError,
  useGetToPath,
  useGo,
  useResource,
  useTable,
} from "@refinedev/core";
import EnumType, { ISaleOrder } from "@src/interfaces";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const InvetoryTransactionList = () => {
  const { SaleOrderStatus } = EnumType;
  const getToPath = useGetToPath();
  const { resource } = useResource();

  const { Title } = Typography;

  const { tableQueryResult, current, setCurrent, pageSize } = useTable<
    ISaleOrder,
    HttpError
  >({
    resource: "inventory-transactions",
    pagination: {
      pageSize: 15,
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Hàng hoá",
      dataIndex: "stockItem.itemName",
    },
    {
      title: "Vị trí nguồn",
      dataIndex: "fromLocation.name",
    },
    {
      title: "Vị trí đích",
      dataIndex: "toLocation.name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (value: string) => {
        return <div>{Number(value).toLocaleString()} </div>;
      },
    },
    {
      title: "Loại chứng từ",
      dataIndex: "transactionType",
    },
  ];
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
      <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
        <Title heading={3}>Đơn đặt hàng</Title>
        <div className="flex gap-4">
          <Input prefix={<IconSearch />} showClear></Input>
        </div>
      </div>
      <div>
        <Table
          style={{ maxHeight: "30%" }}
          columns={columns}
          rowKey="id"
          dataSource={saleOrders}
          pagination={pagination}
          loading={isLoading}
          size="middle"
          groupBy="id"
        />
      </div>
    </div>
  );
};
