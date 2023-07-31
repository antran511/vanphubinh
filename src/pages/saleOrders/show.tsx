import { IllustrationConstruction } from "@douyinfe/semi-illustrations";
import { Button, Empty, Spin, Table, Typography } from "@douyinfe/semi-ui";
import {
  useApiUrl,
  useCustomMutation,
  useGo,
  useInvalidate,
  useParsed,
  useShow,
} from "@refinedev/core";
import EnumType, { ISaleOrder, ISaleOrderLine } from "@src/interfaces";
import { useMemo, useState } from "react";

export const SaleOrderShow = () => {
  const { ItemType } = EnumType;
  const { id } = useParsed();

  const go = useGo();

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const rowSelection = useMemo(() => {
    return {
      getCheckboxProps: (record: ISaleOrderLine) => ({
        disabled:
          !!record?.productionOrder ||
          record?.item?.itemType !== ItemType.PRODUCT,
      }),
      selectedRowKeys: selectedRowKeys,
      onSelect: (record?: ISaleOrderLine, selected?: boolean) => {
        if (!record) return;
        if (selected) {
          setSelectedRowKeys((prev) => [...prev, record.id]);
        } else {
          setSelectedRowKeys((prev) => prev.filter((id) => id !== record.id));
        }
      },
      onSelectAll: (selected?: boolean, selectedRows?: ISaleOrderLine[]) => {
        if (!selectedRows) return;
        if (selected) {
          setSelectedRowKeys(selectedRows.map((row) => row.id));
        } else {
          setSelectedRowKeys([]);
        }
      },
    };
  }, [selectedRowKeys]);
  const apiUrl = useApiUrl();

  const { mutate } = useCustomMutation();

  const invalidate = useInvalidate();

  const createProductionOrder = async () => {
    mutate(
      {
        url: `${apiUrl}/sale-orders/${id}/create-production-order`,
        method: "post",
        values: {
          saleOrderLineIds: selectedRowKeys,
        },
        successNotification: () => {
          return {
            message: ``,
            description: "Đã tạo thành công đơn sản xuất",
            type: "success",
          };
        },
        errorNotification: () => {
          return {
            message: ``,
            description: "Lỗi xảy ra trong quá trình tạo đơn sản xuất",
            type: "error",
          };
        },
      },

      {
        onSuccess: () => {
          setSelectedRowKeys([]);
          invalidate({
            resource: "sale-orders",
            invalidates: ["detail"],
            id,
          });
        },
      }
    );
  };

  const { queryResult } = useShow<ISaleOrder>({
    resource: "sale-orders",
    id,
  });
  const { data, isLoading, isError } = queryResult;

  // eslint-disable-next-line no-constant-condition
  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Empty
          image={
            <IllustrationConstruction style={{ width: 150, height: 150 }} />
          }
          title={"Đã có lỗi xảy ra trong quá trình tải đơn hàng"}
          description="Xin hãy liên hệ quản trị viên để được hỗ trợ."
        />
      </div>
    );
  }

  const saleOrder = data?.data;
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "item.itemName",
    },
    {
      title: "Đơn vị",
      dataIndex: "item.uom.uomName",
    },
    {
      title: "Số lượng đặt hàng",
      dataIndex: "quantity",
      render: (value: string) => {
        return <div>{Number(value).toLocaleString()} </div>;
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      render: (value: string) => {
        return <div>{Number(value).toLocaleString()} ₫</div>;
      },
    },
    {
      title: "Thuế",
      dataIndex: "taxRate",
      render: (value: string) => {
        return <div>{(Number(value) * 100).toLocaleString()}%</div>;
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "subTotal",
      render: (value: string) => {
        return <div>{Number(value).toLocaleString()} ₫</div>;
      },
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "deliveryDate",
    },
    {
      title: "Ghi chú sx",
      dataIndex: "note",
    },
    {
      title: "Trạng thái đơn sx",
      dataIndex: "productionOrder",
    },
  ];

  const { Title } = Typography;

  return (
    <div className="px-6">
      <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
        <Title heading={3}>Đơn bán hàng </Title>
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
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <div className="flex flex-col space-y-6">
            <div>
              <Title heading={6}>Mã đơn hàng</Title>
              <Typography>{saleOrder?.id}</Typography>
            </div>
            <div>
              <Title heading={6}>Khách hàng</Title>
              <Typography>{saleOrder?.customer?.partnerName}</Typography>
            </div>

            <div>
              <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
                <Title heading={6}>Dòng đơn hàng</Title>
                <Button
                  theme="borderless"
                  onClick={() => createProductionOrder()}
                  disabled={selectedRowKeys.length === 0}
                >
                  Tạo đơn sản xuất
                </Button>
              </div>

              <Table
                rowSelection={rowSelection}
                rowKey="id"
                columns={columns}
                dataSource={saleOrder?.saleOrderLines}
                size="middle"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
