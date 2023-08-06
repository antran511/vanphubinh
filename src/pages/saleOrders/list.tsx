import {
  IconEyeOpened,
  IconEdit,
  IconDelete,
  IconSearch,
  IconPlusStroked,
} from "@douyinfe/semi-icons";
import {
  Button,
  Table,
  Tag,
  Typography,
  Input,
  Dropdown,
} from "@douyinfe/semi-ui";
import { TablePaginationProps } from "@douyinfe/semi-ui/lib/es/table";
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

export const SaleOrderList = () => {
  const { SaleOrderStatus } = EnumType;
  const getToPath = useGetToPath();
  const { resource } = useResource();
  const [status, setStatus] = useState<string[]>([]);

  const isSmallDevice = useMediaQuery({
    query: "only screen and (max-width : 768px)",
  });
  const go = useGo();
  const { Title } = Typography;

  const {
    tableQueryResult,
    current,
    setCurrent,
    pageSize,
    filters,
    setFilters,
  } = useTable<ISaleOrder, HttpError>({
    resource: "sale-orders",
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
    filters: {
      initial: [
        // {
        //   field: "status",
        //   operator: "in",
        //   value: [SaleOrderStatus.QUOTE, SaleOrderStatus.SALE_ORDER],
        // },
      ],
    },
  });
  const currentFilterValues = useMemo(() => {
    // Filters can be a LogicalFilter or a ConditionalFilter. ConditionalFilter not have field property. So we need to filter them.
    // We use flatMap for better type support.
    const logicalFilters = filters.flatMap((item) =>
      "field" in item ? item : []
    );

    return {
      title: logicalFilters.find((item) => item.field === "title")?.value || "",
      status:
        logicalFilters.find((item) => item.field === "status")?.value || "",
    };
  }, [filters]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      // sorter: (a: ISaleOrder, b: ISaleOrder) => (a.id > b.id ? 1 : -1),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value: string) => {
        return new Date(value || "").toLocaleDateString();
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "customer.partnerName",
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      useFullRender: true,
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
          <Button
            onClick={() => {
              go({
                to: "/sale-orders/create",
                type: "push",
              });
            }}
            icon={<IconPlusStroked />}
          />
        </div>
      </div>
      <div>
        <Table
          onChange={(e) => console.log(e)}
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
