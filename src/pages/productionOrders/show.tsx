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
import EnumType, { IProductionOrder, ISaleOrderLine } from "@src/interfaces";
import { useMemo, useState } from "react";

export const ProductionOrderShow = () => {
  const { ItemType, ProductionOrderStatus } = EnumType;
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
    useCustomMutation<IProductionOrder, HttpError>();

  const invalidate = useInvalidate();

  const createProductionOrders = async () => {
    mutate(
      {
        url: `${apiUrl}/production-orders/${id}/create-production-order`,
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
            resource: "production-orders",
            invalidates: ["detail"],
            id,
          });
        },
      }
    );
  };

  const { queryResult } = useShow<IProductionOrder>({
    resource: "production-orders",
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

  const productionOrder = data?.data;
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
      dataIndex: "",
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
      case ProductionOrderStatus.MANUFACTURING:
        translatedStatus = "Đang sản xuất";
        color = "blue";
        break;
      case ProductionOrderStatus.PAUSED:
        translatedStatus = "Hoãn";
        color = "yellow";
        break;
      case ProductionOrderStatus.FINISHED:
        translatedStatus = "Đã hoàn thàh";
        color = "green";
        break;
      case ProductionOrderStatus.CANCELLED:
        translatedStatus = "Đã huỷ";
        color = "white";
        break;
      default:
        translatedStatus = "Mới";
    }
    return (
      <div>
        <Tag color={color}>{translatedStatus}</Tag>
      </div>
    );
  };

  return (
    <div className="px-6">
      <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
        <Title heading={3}>Đơn bán hàng </Title>
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
            Tạo
          </Button>

          {productionOrder &&
          productionOrder?.status !== ProductionOrderStatus.CANCELLED ? (
            <Popconfirm
              title="Bạn có chắc muốn huỷ đơn hàng này?"
              content="Huỷ đơn hàng sẽ không huỷ đơn sản xuất liên quan"
              onConfirm={() => {
                updateStatus(
                  {
                    url: `${apiUrl}/production-orders/${productionOrder?.id}/update-status`,
                    method: "post",
                    values: {
                      status: ProductionOrderStatus.CANCELLED,
                    },
                  },
                  {
                    onSuccess: () => {
                      invalidate({
                        resource: "production-orders",
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
          <div className="flex flex-col	gap-4">
            <div>
              <Title heading={6}>Mã đơn hàng</Title>
              <Typography>{productionOrder?.id}</Typography>
            </div>

            <div>
              <Title heading={6}>Khách hàng</Title>
              <Typography>
                {productionOrder?.saleOrder?.customer.partnerName}
              </Typography>
            </div>
            <div>
              <Title heading={6}>Trạng thái</Title>
              <Typography>{statusTag(productionOrder?.status)}</Typography>
            </div>
            <div>
              <Title heading={6}>Sản phẩm</Title>
              <Typography>{productionOrder?.item.itemName}</Typography>
            </div>

            <div>
              <Title heading={6}>Số lượng</Title>
              <Typography>
                {Number(productionOrder?.quantity).toLocaleString()}
              </Typography>
            </div>
            <div>
              <Title heading={6}>Đơn vị</Title>
              <Typography>{productionOrder?.item.uom?.uomName}</Typography>
            </div>

            <div>
              <Title heading={6}>Số lượng đã hoàn thành</Title>
              <Typography>
                {Number(productionOrder?.finishedUomId).toLocaleString()}
              </Typography>
            </div>
            <div>
              <Title heading={6}>Ngày tạo</Title>
              <Typography>
                {new Date(
                  productionOrder?.createdAt ?? ""
                ).toLocaleDateString()}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
