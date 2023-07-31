import { IconEyeOpened, IconEdit, IconDelete } from "@douyinfe/semi-icons";
import { Button, Table, Tag, Typography } from "@douyinfe/semi-ui";
import { TagColor } from "@douyinfe/semi-ui/lib/es/tag";
import {
  HttpError,
  useGetToPath,
  useGo,
  useResource,
  useTable,
} from "@refinedev/core";
import EnumType, { ISaleOrder, ISaleOrderLine } from "@src/interfaces";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const SaleOrderList = () => {
  const { SaleOrderStatus } = EnumType;
  const getToPath = useGetToPath();
  const { resource } = useResource();

  const isSmallDevice = useMediaQuery({
    query: "only screen and (max-width : 768px)",
  });
  const go = useGo();
  const { Title } = Typography;
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer.partnerName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value: string) => {
        let translatedStatus = "";
        let color: TagColor = "green";
        switch (value) {
          case SaleOrderStatus.QUOTE:
            translatedStatus = "Báo giá";
            color = "grey";
            break;

          case SaleOrderStatus.CANCELLED:
            translatedStatus = "Đã huỷ";
            color = "white";
            break;
          default:
            translatedStatus = "Đơn hàng";
        }
        return (
          <div>
            <Tag color={color}>{translatedStatus}</Tag>
          </div>
        );
      },
    },
    {
      title: "",
      render: (record: ISaleOrder) => {
        return (
          <div className="flex space-x-2">
            <Button
              icon={<IconEyeOpened />}
              onClick={() => {
                go({
                  to: getToPath({
                    resource: resource,
                    action: "show",
                    meta: {
                      id: record.id,
                    },
                  }),
                });
              }}
              size={isSmallDevice ? "small" : "default"}
            />
            <Button
              icon={<IconEdit />}
              size={isSmallDevice ? "small" : "default"}
              onClick={() => {
                go({
                  to: getToPath({
                    resource: resource,
                    action: "edit",
                    meta: {
                      id: record.id,
                    },
                  }),
                });
              }}
            />
            <Button
              icon={<IconDelete />}
              size={isSmallDevice ? "small" : "default"}
            />
          </div>
        );
      },
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
      <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
        <Title heading={3}>Đơn đặt hàng</Title>
        <Button
          theme="solid"
          onClick={() => {
            go({
              to: "/sale-orders/create",
              type: "push",
            });
          }}
        >
          Tạo
        </Button>
      </div>
      <div className="">
        <Table
          style={{ maxHeight: "30%" }}
          columns={columns}
          rowKey="id"
          dataSource={saleOrders}
          pagination={pagination}
          loading={isLoading}
          size="middle"
        />
      </div>
    </div>
  );
};
