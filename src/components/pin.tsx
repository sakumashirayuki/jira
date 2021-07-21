import { Rate } from "antd";

type RateProps = React.ComponentProps<typeof Rate>;
interface PinProps extends RateProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
export const Pin = (props: PinProps) => {
  const { checked, onCheckedChange, ...restProps } = props;
  // 如果onCheckedChange存在，则调用这个函数
  return (
    <Rate
      count={1}
      value={checked ? 1 : 0}
      onChange={(num) => {
        //console.log(num);
        onCheckedChange?.(!!num);
      }}
      {...restProps}
    />
  );
};
