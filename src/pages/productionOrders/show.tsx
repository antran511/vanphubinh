import { IconLock, IconUnlock } from "@douyinfe/semi-icons";
import { IllustrationConstruction } from "@douyinfe/semi-illustrations";
import {
  Button,
  Empty,
  Space,
  Spin,
  Tag,
  Typography,
  InputNumber,
  Modal,
} from "@douyinfe/semi-ui";
import { Popconfirm } from "@douyinfe/semi-ui";
import { TagColor } from "@douyinfe/semi-ui/lib/es/tag";
import {
  HttpError,
  useApiUrl,
  useCustomMutation,
  useInvalidate,
  useParsed,
  useShow,
} from "@refinedev/core";
import EnumType, { IProductionOrder } from "@src/interfaces";
import { useState } from "react";

export const ProductionOrderShow = () => {
  const { ProductionOrderStatus } = EnumType;
  const { id } = useParsed();
  const [finishedQuantity, setFinishedQuantity] = useState<number>(0);
  const [locked, setLocked] = useState<boolean>(true);

  const apiUrl = useApiUrl();

  const { mutate: update, isLoading: isUpdatingStatus } = useCustomMutation<
    IProductionOrder,
    HttpError
  >();

  const invalidate = useInvalidate();
  const [visible, setVisible] = useState(false);
  const onClose = () => {
    setVisible(false);
  };
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
        translatedStatus = "Đã hoàn thành";
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

  const { Title } = Typography;
  const updateFinish = () => {
    update(
      {
        url: `${apiUrl}/production-orders/${productionOrder?.id}/update-status`,
        method: "post",
        values: {
          status: ProductionOrderStatus.FINISHED,
          finishedQuantity,
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
  };
  const onFinish = () => {
    if (productionOrder && finishedQuantity < productionOrder?.quantity) {
      setVisible(true);
    } else {
      updateFinish();
    }
  };

  return (
    <div className="px-6">
      <div className="flex items-end justify-between gap-4 py-5 flex-wrap">
        <Title heading={3}>Đơn sản xuất </Title>
        <Space>
          {productionOrder?.status !== ProductionOrderStatus.FINISHED ? (
            <Button
              disabled={
                productionOrder?.status === ProductionOrderStatus.CANCELLED ||
                productionOrder?.status === ProductionOrderStatus.MANUFACTURING
              }
              theme="solid"
              onClick={() => {
                update(
                  {
                    url: `${apiUrl}/production-orders/${productionOrder?.id}/update-status`,
                    method: "post",
                    values: {
                      status: ProductionOrderStatus.MANUFACTURING,
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
              Sản xuất
            </Button>
          ) : null}

          {productionOrder?.status !== ProductionOrderStatus.FINISHED ? (
            <Button
              disabled={
                productionOrder?.status === ProductionOrderStatus.PAUSED ||
                productionOrder?.status === ProductionOrderStatus.CANCELLED
              }
              theme="solid"
              type="tertiary"
              onClick={() => {
                update(
                  {
                    url: `${apiUrl}/production-orders/${productionOrder?.id}/update-status`,
                    method: "post",
                    values: {
                      status: ProductionOrderStatus.PAUSED,
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
              Hoãn
            </Button>
          ) : null}

          {productionOrder?.status !== ProductionOrderStatus.FINISHED ? (
            <Button
              disabled={finishedQuantity <= 0}
              theme="solid"
              onClick={() => onFinish()}
            >
              Hoàn thành
            </Button>
          ) : null}

          {productionOrder?.status !== ProductionOrderStatus.FINISHED ? (
            <Modal
              title="Modal Title"
              visible={visible}
              onOk={updateFinish}
              onCancel={onClose}
              maskClosable={false}
            >
              <p>
                Số lượng hoàn thành ít hơn số lượng yêu cầu. Xin hãy xác nhận
                một lần nữa số lượng này chính xác.
              </p>
            </Modal>
          ) : null}

          {productionOrder?.status !== ProductionOrderStatus.FINISHED ? (
            <Popconfirm
              title="Bạn có chắc muốn huỷ đơn hàng này?"
              content="Huỷ đơn hàng sẽ không huỷ đơn sản xuất liên quan"
              onConfirm={() => {
                update(
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
              <Button
                type="danger"
                theme="solid"
                loading={isUpdatingStatus}
                disabled={
                  productionOrder?.status === ProductionOrderStatus.CANCELLED
                }
              >
                Huỷ
              </Button>
            </Popconfirm>
          ) : null}

          {productionOrder?.status === ProductionOrderStatus.FINISHED ? (
            <>
              <Button type="secondary" onClick={() => setLocked(!locked)}>
                <div className="flex items-center gap-2">
                  {locked ? (
                    <IconLock style={{ color: "#6A3AC7" }} />
                  ) : (
                    <IconUnlock style={{ color: "#6A3AC7" }} />
                  )}
                  <p>Mở khoá</p>
                </div>
              </Button>
              <Button
                type="secondary"
                onClick={() => {
                  update(
                    {
                      url: `${apiUrl}/production-orders/${productionOrder?.id}/update-finished-quantity`,
                      method: "post",
                      values: {
                        status: productionOrder?.status,
                        finishedQuantity,
                      },
                      successNotification: () => {
                        return {
                          message: ``,
                          description: "Success with no errors",
                          type: "success",
                        };
                      },
                      errorNotification: () => {
                        return {
                          message: ``,
                          description: "Error",
                          type: "error",
                        };
                      },
                    },
                    {
                      onSuccess: () => {
                        setLocked(true);
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
                Lưu thay đổi
              </Button>
            </>
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
                {productionOrder?.status !== ProductionOrderStatus.FINISHED ||
                !locked ? (
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/(,*)/g, "")}
                    defaultValue={productionOrder?.finishedQuantity || 0}
                    onNumberChange={(value) => {
                      setFinishedQuantity(value);
                    }}
                  />
                ) : (
                  Number(productionOrder?.finishedQuantity).toLocaleString()
                )}

                {}
              </Typography>
            </div>
            <div>
              <Title heading={6}>Ngày hoàn thành</Title>
              <Typography>
                {new Date(
                  productionOrder?.finishedAt ?? ""
                ).toLocaleDateString()}
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
