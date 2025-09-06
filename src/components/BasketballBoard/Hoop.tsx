import { useCallback, useEffect, useState } from "react";
import { useHoop } from "../../contexts/HoopContext";
import { useElementMeasurement } from "../../hooks/useElementMeasurement";
import * as S from "./Hoop.styled";

export default function Hoop() {
  const [isAnimating, setIsAnimating] = useState(false);
  const { swooshKey, setRimCenter, setRimWidth, setNetBottomY, setIsSwishing } =
    useHoop();

  const triggerSwoosh = useCallback(() => {
    setIsAnimating(false);
    requestAnimationFrame(() => {
      setIsAnimating(true);
      setIsSwishing(true);
    });
  }, []);

  useEffect(() => {
    if (!swooshKey) return;
    triggerSwoosh();
  }, [swooshKey, triggerSwoosh]);

  const wrapperRef = useElementMeasurement<HTMLDivElement>(
    useCallback(
      ({ center, width }) => {
        setRimCenter(center);
        setRimWidth(width);
      },
      [setRimCenter, setRimWidth]
    )
  );

  return (
    <S.HoopWrapper ref={wrapperRef}>
      <S.HoopImg src="/assets/hoop-front.png" alt="hoop" />
      <S.NetWrapper>
        <img src="/assets/net-top.png" alt="net top" />
        <S.NetImg
          src="/assets/net-bottom.png"
          alt="net bottom"
          $animating={isAnimating}
          onAnimationEnd={() => {
            setIsAnimating(false);
            setIsSwishing(false);
          }}
          ref={(el) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            setNetBottomY(rect.bottom);
          }}
        />
      </S.NetWrapper>
    </S.HoopWrapper>
  );
}
