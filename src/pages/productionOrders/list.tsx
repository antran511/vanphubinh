import {
  IconEyeOpened,
  IconEdit,
  IconDelete,
  IconAlertTriangle,
} from "@douyinfe/semi-icons";
import { Button, Tag, Typography, Space, Table } from "@douyinfe/semi-ui";
import { TagColor } from "@douyinfe/semi-ui/lib/es/tag";
import {
  HttpError,
  useDeleteMany,
  useGetToPath,
  useGo,
  useResource,
  useTable,
} from "@refinedev/core";
import EnumType, { IProductionOrder } from "@src/interfaces";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const ProductionOrderList = () => {
  const go = useGo();
  const { resource } = useResource();
  const { Title } = Typography;
  const { ProductionOrderStatus, SaleOrderStatus } = EnumType;
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    []
  );
  const { mutate } = useDeleteMany();
  const isSmallDevice = useMediaQuery({
    query: "only screen and (max-width : 768px)",
  });
  const getToPath = useGetToPath();
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
      render: (value: string) => {
        return <div>{Number(value).toLocaleString()} </div>;
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "item.uom.uomName",
    },
    {
      title: "Số lượng hoàn thành",
      dataIndex: "finishedQuantity",
      render: (value: string) => {
        return <div>{Number(value).toLocaleString()} </div>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
    },
    {
      title: "Hạn chót",
      dataIndex: "deadline",
      render: (value: string) => {
        return <div>{value ? new Date(value).toLocaleDateString() : ""} </div>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        let translatedStatus = "";
        let color: TagColor = "white";
        switch (status) {
          case ProductionOrderStatus.WAITING:
            translatedStatus = "Chờ sản xuất";
            color = "grey";
            break;
          case ProductionOrderStatus.MANUFACTURING:
            translatedStatus = "Đang sản xuất";
            color = "blue";
            break;
          case ProductionOrderStatus.PAUSED:
            translatedStatus = "Hoãn";
            color = "orange";
            break;
          case ProductionOrderStatus.FINISHED:
            translatedStatus = "Đã hoàn thành";
            color = "green";
            break;
          case ProductionOrderStatus.CANCELLED:
            translatedStatus = "Đã huỷ";
            color = "red";
            break;
          default:
            translatedStatus = "Mới";
        }
        return <Tag color={color}>{translatedStatus}</Tag>;
      },
    },
    {
      title: "Đơn bán hàng",
      dataIndex: "saleOrder.id",
      render: (saleOrderId: string, record: IProductionOrder) => {
        const isSaleOrderCancelled =
          record?.saleOrder?.status === SaleOrderStatus.CANCELLED;
        return (
          <div className="flex items-center gap-2">
            {saleOrderId}{" "}
            {isSaleOrderCancelled && (
              <IconAlertTriangle style={{ color: "#E91E63" }} />
            )}
          </div>
        );
      },
    },
    {
      title: "",
      render: (record: IProductionOrder) => {
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
              disabled={
                record.status === ProductionOrderStatus.FINISHED ||
                record.status === ProductionOrderStatus.CANCELLED ||
                !!record.saleOrder.id
              }
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
  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys?: (string | number)[]) => {
        if (!selectedRowKeys) return;
        setSelectedRowKeys(selectedRowKeys);
      },
    };
  }, [selectedRowKeys]);

  return (
    <div className="px-6">
      <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
        <Title heading={3}>Lệnh sản xuất</Title>
        <Space>
          <Button
            theme="solid"
            onClick={() => {
              go({
                to: "/production-orders/create",
                type: "push",
              });
            }}
          >
            +
          </Button>
          <Button
            theme="solid"
            type="danger"
            disabled={selectedRowKeys.length === 0}
            onClick={() => {
              mutate({
                resource: "production-orders",
                ids: selectedRowKeys,
              });
            }}
          >
            Xoá
          </Button>
        </Space>
      </div>
      <div className="">
        <Table
          rowSelection={rowSelection}
          rowKey="id"
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
