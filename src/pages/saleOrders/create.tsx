import { Typography, Button } from "@douyinfe/semi-ui";
import { PartnerAutoComplete } from "@src/components/partners";

export const SaleOrderCreate = () => {
  const { Title } = Typography;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 px-6 py-5 ">
        <Title heading={4}>Tạo hàng hoá</Title>
        <Button theme="solid">Thêm mới</Button>
      </div>
      <div>
        <PartnerAutoComplete />
      </div>
    </div>
  );
};
