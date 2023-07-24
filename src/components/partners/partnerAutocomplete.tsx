import { AutoComplete } from "@douyinfe/semi-ui";
import { AutoCompleteItems } from "@douyinfe/semi-ui/lib/es/autoComplete";
import { Option, useSelect } from "@refinedev/core";
import { IPartner } from "@src/interfaces";

export const PartnerAutoComplete = () => {
  const { options, onSearch, queryResult } = useSelect<IPartner>({
    resource: "partners",
    optionLabel: "partnerName",
    optionValue: "id",
    debounce: 500,
  });
  const loading = queryResult.isLoading || queryResult.isFetching;

  const renderItem = (item: AutoCompleteItems) => {
    const castedItem = item as Option;

    return castedItem?.label;
  };

  const renderSelectedItem = (item: AutoCompleteItems) => {
    const castedItem = item as Option;
    return castedItem?.label;
  };

  return (
    <AutoComplete
      data={options}
      onSearch={onSearch}
      renderItem={renderItem}
      renderSelectedItem={renderSelectedItem}
      loading={loading}
    />
  );
};
