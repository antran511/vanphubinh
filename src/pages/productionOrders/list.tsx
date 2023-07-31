import { Button, Space, Table, Tag, Typography } from "@douyinfe/semi-ui";
import { TagColor } from "@douyinfe/semi-ui/lib/es/tag";
import { HttpError, useDeleteMany, useGo, useTable } from "@refinedev/core";
import EnumType, { IProductionOrder } from "@src/interfaces";
import { useMemo, useState } from "react";

export const ProductionOrderList = () => {
  const go = useGo();
  const { Title } = Typography;
  const { ProductionOrderStatus } = EnumType;
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    []
  );
  const { mutate } = useDeleteMany();

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
            translatedStatus = "Đã huỷ";
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
      dataIndex: "saleOrderId",
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
            Thêm mới
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
