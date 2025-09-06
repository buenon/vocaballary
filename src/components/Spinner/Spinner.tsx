import * as S from "./Spinner.styled";

type Props = {
  size?: number;
  color?: string;
  trackColor?: string;
  className?: string;
};

export default function Spinner({
  size = 44,
  color = "#f7631d",
  trackColor = "rgba(0,0,0,0.15)",
  className,
}: Props) {
  return (
    <S.Spinner
      $size={size}
      $color={color}
      $track={trackColor}
      className={className}
      aria-hidden="true"
    />
  );
}
