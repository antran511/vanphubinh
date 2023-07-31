import { IconEyeOpened, IconEdit, IconDelete } from "@douyinfe/semi-icons";
import { Button, Table, Typography } from "@douyinfe/semi-ui";
import {
  HttpError,
  useGetToPath,
  useGo,
  useResource,
  useTable,
} from "@refinedev/core";
import { SaleLinesModal } from "@src/components/sale";
import { ISaleOrder } from "@src/interfaces";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const SaleOrderList = () => {
  const getToPath = useGetToPath();
  const { resource } = useResource();
  console.log(resource);
  const [visible, setVisible] = useState(false);
  const ok = () => {
    console.log("ok");
  };
  const close = () => {
    setVisible(false);
  };
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
      title: "",
      render: (record: ISaleOrder) => {
        return (
          <div className="flex space-x-2 w-36">
            <Button
              block
              size={isSmallDevice ? "small" : "default"}
              onClick={() => setVisible(true)}
            >
              Tạo đơn sản xuất
            </Button>
            <SaleLinesModal
              visible={visible}
              onClose={close}
              onOK={ok}
              saleOrderId={record.id}
            />
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
          Thêm mới
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
