import { Button, Form } from "@douyinfe/semi-ui";
import { useSelect } from "@refinedev/core";
import EnumType, { IPartner } from "@src/interfaces";

interface PartnerSelectProps {
  field: string;
  saleOrderStatus?: string;
}

export const PartnerSelect = ({
  field,
  saleOrderStatus,
}: PartnerSelectProps) => {
  const Select = Form.Select;
  const { SaleOrderStatus } = EnumType;

  const { options, onSearch, queryResult } = useSelect<IPartner>({
    resource: "partners",
    optionLabel: "partnerName",
    optionValue: "id",
    debounce: 500,
  });
  const loading = queryResult.isLoading || queryResult.isFetching;
  const innerSlotNode = (
    <div className="flex items-center justify-center">
      <Button theme="borderless" block>
        Tạo khách hàng mới
      </Button>
    </div>
  );
  return (
    <div className="flex w-full">
      <div className="grow w-full">
        <Select
          className="grow"
          disabled={
            !!saleOrderStatus && saleOrderStatus !== SaleOrderStatus.QUOTE
          }
          rules={[
            {
              required: true,
              message: "Không thể bỏ trống",
            },
          ]}
          label="Khách hàng"
          labelPosition="left"
          field={field}
          style={{ width: "100%" }}
          optionList={options}
          onSearch={onSearch}
          loading={loading}
          innerBottomSlot={innerSlotNode}
        />
      </div>
      <div className="py-3 pl-2">
        <Button>+</Button>
      </div>
    </div>
  );
};
