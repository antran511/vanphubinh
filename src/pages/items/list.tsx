import { ItemCreate } from "@components/items";
import { IconBox } from "@douyinfe/semi-icons";
import { Button, Table, Typography, Modal } from "@douyinfe/semi-ui";
import { HttpError, useGo, useTable } from "@refinedev/core";
import { IItem } from "@src/interfaces";
import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

export const ItemList = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const config = {
    title: "Tạo hàng hoá",
    icon: <IconBox />,
    width: isDesktopOrLaptop ? "60vw" : "90vw",
    content: <ItemCreate />,
  };

  const [modal, contextHolder] = Modal.useModal();

  const go = useGo();
  const { Title } = Typography;
  const columns = [
    {
      title: "Tên mặt hàng",
      dataIndex: "itemName",
      sorter: true,
    },
    {
      title: "Đơn vị tính",
      dataIndex: "uom.uomName",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "itemType",
      render: (itemType: string) => {
        let translatedItemType;
        switch (itemType) {
          case "MATERIAL":
            translatedItemType = "Nguyên liệu/Bán thành phẩm  ";
            break;
          case "MOULD":
            translatedItemType = "Trục";
            break;
          case "FILM":
            translatedItemType = "Màng";
            break;
          case "SERVICE":
            translatedItemType = "Dịch vụ";
            break;
          default:
            translatedItemType = "Sản phẩm";
        }
        return <div>{translatedItemType}</div>;
      },
    },
  ];
  const { tableQueryResult, current, setCurrent, pageSize } = useTable<
    IItem,
    HttpError
  >({
    resource: "items",
    pagination: {
      pageSize: 15,
    },
  });
  const items = tableQueryResult?.data?.data;
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
        <Title heading={3}>Hàng hoá</Title>
        <Button
          onClick={() => {
            modal.info(config);
          }}
        >
          Tạo hàng hoá
        </Button>
      </div>
      <div className="">
        <Table
          columns={columns}
          dataSource={items}
          pagination={pagination}
          loading={isLoading}
          size="middle"
        />
      </div>
      <>{contextHolder}</>
    </div>
  );
};
