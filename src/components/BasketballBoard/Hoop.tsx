import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useHoop } from "../../contexts/HoopContext";
import * as S from "./Hoop.styled";

export default function Hoop() {
  const [isAnimating, setIsAnimating] = useState(false);
  const { swooshKey, setRimCenter, setRimWidth, setNetBottomY } = useHoop();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const triggerSwoosh = useCallback(() => {
    setIsAnimating(false);
    requestAnimationFrame(() => setIsAnimating(true));
  }, []);

  useEffect(() => {
    if (!swooshKey) return;
    triggerSwoosh();
  }, [swooshKey]);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    // Approximate rim center as wrapper center
    setRimCenter({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setRimWidth(rect.width);
    const obs = new ResizeObserver(() => {
      const r = wrapperRef.current?.getBoundingClientRect();
      if (r) {
        setRimCenter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        setRimWidth(r.width);
      }
    });
    obs.observe(wrapperRef.current);
    return () => {
      obs.disconnect();
    };
  }, []);

  return (
    <S.HoopWrapper ref={wrapperRef}>
      <S.HoopImg src="/assets/hoop.png" alt="hoop" />
      <S.NetWrapper>
        <img src="/assets/net-top.png" alt="net top" />
        <S.NetImg
          src="/assets/net-bottom.png"
          alt="net bottom"
          $animating={isAnimating}
          onAnimationEnd={() => setIsAnimating(false)}
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
