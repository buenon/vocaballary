import { useCallback, useEffect, useState } from "react";
import { useHoop } from "../../contexts/HoopContext";
import * as S from "./Hoop.styled";

export default function Hoop() {
  const [isAnimating, setIsAnimating] = useState(false);
  const { swooshKey } = useHoop();

  const triggerSwoosh = useCallback(() => {
    setIsAnimating(false);
    requestAnimationFrame(() => setIsAnimating(true));
  }, []);

  useEffect(() => {
    if (!swooshKey) return;
    triggerSwoosh();
  }, [swooshKey]);

  return (
    <S.HoopWrapper>
      <S.HoopImg src="/assets/hoop.png" alt="hoop" />
      <S.NetWrapper>
        <img src="/assets/net-top.png" alt="net top" />
        <S.NetImg
          src="/assets/net-bottom.png"
          alt="net bottom"
          $animating={isAnimating}
          onAnimationEnd={() => setIsAnimating(false)}
        />
      </S.NetWrapper>
    </S.HoopWrapper>
  );
}
