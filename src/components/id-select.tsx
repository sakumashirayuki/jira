import React from "react";
import { Select } from "antd";
import { Raw } from "types/index";

type SelectProps = React.ComponentProps<typeof Select>;

// 继承了Select中原有的类型
// 为了避免重复的键值引起歧义，这里删除掉Select的类型中重复的
interface IdSelectProps
  extends Omit<
    SelectProps,
    "value" | "onChange" | "defaultOptionName" | "options"
  > {
  value?: Raw | null | undefined;
  onChange?: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}

/**
 * value 可以传入多种类型的值
 * onChange 只会回调 number | undefined
 * 当isNaN(Number(value))为true时，代表选择默认类型
 * 当选择默认类型时，onChange回调undefined
 * @param props
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...restProps } = props;
  return (
    <Select
      value={options?.length ? toNumber(value) : 0}
      onChange={(value) => onChange?.(toNumber(value) || undefined)}
      {...restProps}
    >
      {/* 所以默认项的value也是0 */}
      {defaultOptionName && (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      )}
      {options?.map((option) => (
        <Select.Option value={option.id} key={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};
// 无意义的值都是0
const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
