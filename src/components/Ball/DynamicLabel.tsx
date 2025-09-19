import React, { useRef } from "react";
import { useDynamicLabel } from "../../hooks/useDynamicLabel";
import * as S from "./DynamicLabel.styled";

interface DynamicLabelProps {
  children: string;
  className?: string;
  minFontSize?: number;
  maxFontSize?: number;
}

export const DynamicLabel: React.FC<DynamicLabelProps> = ({
  children,
  className,
  minFontSize = 10,
  maxFontSize = 30,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { fontSize } = useDynamicLabel({
    text: children,
    element: elementRef.current,
    minFontSize,
    maxFontSize,
  });

  return (
    <S.DynamicLabel ref={elementRef} className={className} $fontSize={fontSize}>
      {children}
    </S.DynamicLabel>
  );
};
