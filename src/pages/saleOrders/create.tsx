import { IconMinusCircle, IconPlusCircle } from "@douyinfe/semi-icons";
import { Typography, Button, Form, ArrayField } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form/interface";
import { useSelect, useCreate, useGo } from "@refinedev/core";
import { PartnerSelect } from "@src/components/partners";
import { IItem, ISaleOrder } from "@src/interfaces";
import { useRef } from "react";

export const SaleOrderCreate = () => {
  const { Title } = Typography;
  const { InputNumber, Select, DatePicker, TextArea } = Form;
  const { options, onSearch, queryResult } = useSelect<IItem>({
    resource: "items",
    optionLabel: "itemName",
    optionValue: "id",
    debounce: 500,
  });
  const loadingItems = queryResult.isLoading || queryResult.isFetching;
  const go = useGo();

  const { mutate, isLoading } = useCreate();
  const handleSubmit = (values: ISaleOrder) => {
    mutate(
      {
        resource: "sale-orders",
        values: values,
        errorNotification: (data, values, resource) => {
          console.log(values);
          return {
            description: `Lỗi khởi tạo đơn hàng`,
            message: "",
            type: "error",
          };
        },
        successNotification: (data, values, resource) => {
          return {
            message: `Tạo đơn hàng thành công`,
            description: "",
            type: "success",
          };
        },
      },

      {
        onSuccess: () => {
          go({
            to: "/sale-orders",
            type: "push",
          });
        },
      }
    );
  };
  const api = useRef<FormApi>();

  const innerSlotNode = (
    <div className="flex items-center justify-center">
      <Button theme="borderless" block>
        Tạo sản phẩm mới
      </Button>
    </div>
  );
  return (
    <div className="px-6">
      <div className="flex items-end justify-between gap-4 pt-5 pb-2">
        <Title heading={3}>Tạo đơn bán hàng</Title>
        <Button
          theme="solid"
          onClick={() => api.current?.submitForm()}
          disabled={isLoading}
        >
          Thêm mới
        </Button>
      </div>
      <div>
        <Form
          onSubmit={handleSubmit}
          getFormApi={(formApi) => (api.current = formApi)}
          render={({ values }) => (
            <>
              <PartnerSelect field={"customerId"} />
              <ArrayField
                field={"saleOrderLines"}
                initValue={[
                  {
                    taxRate: 0,
                  },
                ]}
              >
                {({ arrayFields, addWithInitValue }) => (
                  <div className="relative  sm:rounded-lg">
                    <div className="max-h-[60vh] min-h-[60vh] overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead
                          className="text-sm bg-white border-b sticky top-0 z-10"
                          style={{
                            boxShadow: "0 1px 1px 0 rgba(0,0,0,0.1)",
                            color: "var(--semi-color-text-2)",
                          }}
                        >
                          <tr>
                            <th scope="col" className="px-4 py-2">
                              #
                            </th>
                            <th scope="col" className="px-4 py-2">
                              Sản phẩm
                            </th>
                            <th scope="col" className="px-4 py-2">
                              Số lượng
                            </th>
                            <th scope="col" className="px-4 py-2">
                              Đơn giá
                            </th>

                            <th scope="col" className="px-4 py-2">
                              Thuế VAT
                            </th>
                            <th scope="col" className="px-4 py-2">
                              Thành tiền
                            </th>
                            <th scope="col" className="px-4 py-2">
                              Ngày giao hàng
                            </th>
                            <th scope="col" className="px-4 py-2">
                              Ghi chú
                            </th>
                            <th scope="col" className="px-4 py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {arrayFields.map(({ field, key, remove }, i) => (
                            <tr key={key}>
                              <td className="px-3 align-top pt-5 w-2">
                                {i + 1}
                              </td>
                              <td className="px-3 align-top">
                                <div className="flex w-full">
                                  <div className="grow w-full">
                                    <Select
                                      noLabel
                                      filter
                                      remote
                                      onSearch={onSearch}
                                      dropdownMatchSelectWidth
                                      field={`${field}[itemId]`}
                                      optionList={options}
                                      loading={loadingItems}
                                      style={{
                                        minWidth: "12rem",
                                        width: "100%",
                                      }}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Không thể bỏ trống",
                                        },
                                      ]}
                                      innerBottomSlot={innerSlotNode}
                                    />
                                  </div>
                                  <div className="py-3 pl-2">
                                    <Button>+</Button>
                                  </div>
                                </div>
                              </td>

                              <td className="px-3 align-top">
                                <InputNumber
                                  noLabel
                                  field={`${field}[quantity]`}
                                  hideButtons
                                  style={{ width: 140 }}
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  parser={(value) => value.replace(/(,*)/g, "")}
                                  showClear
                                  rules={[
                                    {
                                      required: true,
                                      message: "Không thể bỏ trống",
                                    },
                                    {
                                      type: "number",
                                      message: "Phải là số",
                                    },
                                  ]}
                                  suffix={
                                    values?.saleOrderLines &&
                                    values?.saleOrderLines[i]
                                      ? queryResult?.data?.data.find(
                                          (item) =>
                                            item.id ==
                                            values?.saleOrderLines[i]?.itemId
                                        )?.uom.uomName
                                      : ""
                                  }
                                />
                              </td>
                              <td className="px-3 align-top">
                                <InputNumber
                                  noLabel
                                  field={`${field}[unitPrice]`}
                                  hideButtons
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  parser={(value) => value.replace(/(,*)/g, "")}
                                  showClear
                                  rules={[
                                    {
                                      required: true,
                                      message: "Không thể bỏ trống",
                                    },
                                    {
                                      type: "number",
                                      message: "Phải là số",
                                    },
                                  ]}
                                  style={{ width: 140 }}
                                  suffix="₫"
                                />
                              </td>

                              <td className="px-3 align-top">
                                <Select
                                  field={`${field}[taxRate]`}
                                  noLabel
                                  style={{ width: 80 }}
                                  optionList={[
                                    { label: "0%", value: 0 },
                                    { label: "8%", value: 0.08 },
                                    { label: "10%", value: 0.1 },
                                  ]}
                                />
                              </td>
                              <td className="px-3 align-top pt-5">
                                <Typography style={{ width: 120 }}>
                                  {(
                                    values?.saleOrderLines[i]?.quantity *
                                      values?.saleOrderLines[i]?.unitPrice *
                                      (1 + values.saleOrderLines[i]?.taxRate) ||
                                    0
                                  ).toLocaleString("en-US")}{" "}
                                  đ
                                </Typography>
                              </td>
                              <td className="px-3 align-top w-40">
                                <DatePicker
                                  format="dd/MM/yyyy"
                                  field={`${field}[deliveryDate]`}
                                  noLabel
                                  density="compact"
                                  placeholder="Chọn ngày"
                                  style={{ minWidth: "10rem" }}
                                />
                              </td>
                              <td className="px-3 align-top">
                                <TextArea
                                  autosize
                                  field={`${field}[note]`}
                                  noLabel
                                  rows={1}
                                  style={{ minWidth: "10rem" }}
                                />
                              </td>
                              <td className="px-3 align-top">
                                <Button
                                  type="danger"
                                  theme="borderless"
                                  icon={<IconMinusCircle />}
                                  disabled={arrayFields.length === 1}
                                  onClick={remove}
                                  style={{ marginTop: 12, marginBottom: 12 }}
                                  size="small"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Button
                      onClick={() => addWithInitValue({ taxRate: 0 })}
                      icon={<IconPlusCircle />}
                      theme="borderless"
                      size="small"
                    >
                      Thêm dòng mới
                    </Button>
                  </div>
                )}
              </ArrayField>
              <div className="px-3 md:grid md:justify-items-end">
                <div className="md:w-1/4">
                  <div className="bg-white rounded-lg">
                    <h4 className="text-md font-semibold mb-1">Summary</h4>
                    <div className="flex text-sm justify-between mb-1">
                      <span>Tổng (chưa VAT)</span>
                      <span>
                        {(
                          values?.saleOrderLines?.reduce(
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
                          values?.saleOrderLines?.reduce(
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

                    <hr className="my-1" />
                    <div className="flex text-sm justify-between mb-1">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">
                        {(
                          values?.saleOrderLines?.reduce(
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
            </>
          )}
        ></Form>
      </div>
    </div>
  );
};
