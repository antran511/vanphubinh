import { Form } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { IItem, ItemType } from "@src/interfaces";
import { useRef } from "react";

export const ItemCreate = () => {
  const api = useRef<FormApi>();
  const { Input, Select, DatePicker, TextArea, CheckboxGroup } = Form;
  const options = [
    {
      label: "Hàng tồn kho",
      value: "is_stockable",
      extra: "Chọn nếu mặc hàng này có thể lưu trữ được",
    },
    {
      label: "Yêu cầu in ấn",
      value: "is_rollable",
      extra: "Chọn nếu mặc hàng này là hàng cuộn",
    },
    {
      label: "Hàng tồn kho",
      value: "is_saleable",
      extra: "Chọn nếu mặc hàng này có thể lưu trữ được",
    },
    {
      label: "Yêu cầu in ấn",
      value: "is_purchasable",
      extra: "Chọn nếu mặc hàng này là hàng cuộn",
    },
  ];
  return (
    <>
      <Form
        getFormApi={(formApi) => (api.current = formApi)}
        render={({ values }) => (
          <>
            <Input
              label="Tên hàng hoá"
              field="itemName"
              rules={[
                {
                  required: true,
                  message: "Không thể bỏ trống",
                },
              ]}
            />
            <CheckboxGroup
              label="Đặc điểm"
              field="characteristics"
              options={options}
              direction="horizontal"
              aria-label="CheckboxGroup demo"
            />
          </>
        )}
      ></Form>
    </>
  );
};
