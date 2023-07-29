import { Button, Form } from "@douyinfe/semi-ui";
import { useSelect } from "@refinedev/core";
import { IPartner } from "@src/interfaces";

interface PartnerSelectProps {
  field: string;
}

export const PartnerSelect = ({ field }: PartnerSelectProps) => {
  const Select = Form.Select;

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
    <Select
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
  );
};
