import { IconPlusStroked } from "@douyinfe/semi-icons";
import { IllustrationConstruction } from "@douyinfe/semi-illustrations";
import {
  Banner,
  Button,
  Empty,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "@douyinfe/semi-ui";
import { Popconfirm } from "@douyinfe/semi-ui";
import { TagColor } from "@douyinfe/semi-ui/lib/es/tag";
import {
  HttpError,
  useApiUrl,
  useCustomMutation,
  useGo,
  useInvalidate,
  useParsed,
  useShow,
} from "@refinedev/core";
import EnumType, {
  IProductionOrder,
  ISaleOrder,
  ISaleOrderLine,
} from "@src/interfaces";
import { useMemo, useState } from "react";

export const SaleOrderShow = () => {
  const { ItemType, SaleOrderStatus, ProductionOrderStatus } = EnumType;
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
  }, [ItemType.PRODUCT, selectedRowKeys]);
  const apiUrl = useApiUrl();

  const { mutate, isLoading: isCreatingProductionOrders } = useCustomMutation();
  const { mutate: updateStatus, isLoading: isUpdatingStatus } =
    useCustomMutation<ISaleOrder, HttpError>();

  const invalidate = useInvalidate();

  const createProductionOrders = async () => {
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
      title: "Sl đã hoàn thành",
      dataIndex: "finishedQuantity",
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
      dataIndex: "toDeliverAt",
      render: (value: string) => {
        return <div>{value ? new Date(value).toLocaleDateString() : ""}</div>;
      },
    },
    {
      title: "Ghi chú sx",
      dataIndex: "note",
    },
    {
      title: "Trạng thái lệnh sx",
      dataIndex: "productionOrder",
      render: (value: IProductionOrder) => {
        if (!value) return;
        const { id, status } = value;

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
        return (
          <div>
            <Tag color={color}>
              {id}: {translatedStatus}
            </Tag>
          </div>
        );
      },
    },
  ];

  const { Title } = Typography;
  const statusTag = (status?: string) => {
    let translatedStatus = "";
    let color: TagColor = "green";
    switch (status) {
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
    return <Tag color={color}>{translatedStatus}</Tag>;
  };

  return (
    <div className="px-6">
      <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
        <div className="flex items-center gap-x-2">
          <Title heading={3}>Đơn bán hàng #{saleOrder?.id}</Title>
          {statusTag(saleOrder?.status)}
        </div>
        <Space>
          <Button
            icon={<IconPlusStroked />}
            onClick={() => {
              go({
                to: "/sale-orders/create",
                type: "push",
              });
            }}
          />

          {saleOrder && saleOrder?.status !== SaleOrderStatus.CANCELLED ? (
            <Button
              theme="solid"
              onClick={() => {
                go({
                  to: `/sale-orders/edit/${id}`,
                  type: "push",
                });
              }}
            >
              Sửa
            </Button>
          ) : null}
          {saleOrder && saleOrder?.status === SaleOrderStatus.QUOTE ? (
            <Button
              type="tertiary"
              theme="solid"
              loading={isUpdatingStatus}
              onClick={() => {
                updateStatus(
                  {
                    url: `${apiUrl}/sale-orders/${saleOrder?.id}/update-status`,
                    method: "post",
                    values: {
                      status: SaleOrderStatus.SALE_ORDER,
                    },
                  },
                  {
                    onSuccess: () => {
                      invalidate({
                        resource: "sale-orders",
                        invalidates: ["detail"],
                        id,
                      });
                    },
                  }
                );
              }}
            >
              Xác nhận
            </Button>
          ) : null}
          {saleOrder && saleOrder?.status !== SaleOrderStatus.CANCELLED ? (
            <Popconfirm
              title="Bạn có chắc muốn huỷ đơn hàng này?"
              content="Huỷ đơn hàng sẽ không huỷ đơn sản xuất liên quan"
              onConfirm={() => {
                updateStatus(
                  {
                    url: `${apiUrl}/sale-orders/${saleOrder?.id}/update-status`,
                    method: "post",
                    values: {
                      status: SaleOrderStatus.CANCELLED,
                    },
                  },
                  {
                    onSuccess: () => {
                      invalidate({
                        resource: "sale-orders",
                        invalidates: ["detail"],
                        id,
                      });
                    },
                  }
                );
              }}
            >
              <Button type="danger" theme="solid" loading={isUpdatingStatus}>
                Huỷ
              </Button>
            </Popconfirm>
          ) : null}
        </Space>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <div className="flex flex-col space-y-4">
            <div>
              <Title heading={6}>Khách hàng</Title>
              <Typography>{saleOrder?.customer?.partnerName}</Typography>
            </div>

            <div>
              <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
                <Title heading={6}>Dòng đơn hàng</Title>
                <Button
                  theme="borderless"
                  onClick={() => createProductionOrders()}
                  disabled={
                    selectedRowKeys.length === 0 ||
                    saleOrder?.status !== SaleOrderStatus.SALE_ORDER
                  }
                  loading={isCreatingProductionOrders}
                >
                  Tạo lệnh sản xuất
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

            <div className="px-3 md:grid md:justify-items-end">
              <div className="md:w-1/4">
                <div className="bg-white rounded-lg">
                  <h4 className="text-md font-semibold mb-1">Summary</h4>
                  <div className="flex text-sm justify-between mb-1">
                    <span>Tổng (chưa VAT)</span>
                    <span>
                      {(
                        saleOrder?.saleOrderLines?.reduce(
                          (
                            partialSum: number,
                            saleLine: { quantity: number; unitPrice: number }
                          ) => {
                            return (
                              partialSum +
                              saleLine.quantity * saleLine.unitPrice
                            );
                          },
                          0
                        ) || 0
                      ).toLocaleString("en-US")}{" "}
                      ₫
                    </span>
                  </div>
                  <div className="flex text-sm justify-between mb-1">
                    <span>Thuế VAT</span>
                    <span>
                      {(
                        saleOrder?.saleOrderLines?.reduce(
                          (
                            partialSum: number,
                            saleLine: {
                              quantity: number;
                              unitPrice: number;
                              taxRate: number;
                            }
                          ) => {
                            return (
                              partialSum +
                              saleLine.quantity *
                                saleLine.unitPrice *
                                saleLine.taxRate
                            );
                          },
                          0
                        ) || 0
                      ).toLocaleString("en-US")}{" "}
                      ₫
                    </span>
                  </div>

                  <div className="flex text-sm justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      {(
                        saleOrder?.saleOrderLines?.reduce(
                          (
                            partialSum: number,
                            saleLine: {
                              quantity: number;
                              unitPrice: number;
                              taxRate: number;
                              finishedQuantity: number;
                            }
                          ) => {
                            if (saleLine.finishedQuantity > 0)
                              return (
                                partialSum +
                                saleLine.finishedQuantity *
                                  saleLine.unitPrice *
                                  (1 + saleLine.taxRate)
                              );
                            return (
                              partialSum +
                              saleLine.quantity *
                                saleLine.unitPrice *
                                (1 + saleLine.taxRate)
                            );
                          },
                          0
                        ) || 0
                      ).toLocaleString("en-US")}{" "}
                      ₫
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
