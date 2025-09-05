import { useCallback, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useHoop } from "../../contexts/HoopContext";

const HoopWrapper = styled.div`
  position: relative;
  top: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const swooshKeyframes = keyframes`
  0% { transform: scaleY(1); }
  15% { transform: scaleY(1.3); }
  35% { transform: scaleY(0.35); }
  50% { transform: scaleY(1.15); }
  65% { transform: scaleY(0.95); }
  80% { transform: scaleY(1.05); }
  92% { transform: scaleY(0.995); }
  100% { transform: scaleY(1); }
`;

const HoopImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  user-select: none;
  pointer-events: none;
`;

const NetWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NetImg = styled.img<{ $animating: boolean }>`
  display: block;
  user-select: none;
  pointer-events: none;
  transform-origin: 50% 0%; /* pin to top while shrinking */
  will-change: transform;
  ${(p) =>
    p.$animating &&
    css`
      animation: ${swooshKeyframes} 700ms cubic-bezier(0.22, 1, 0.36, 1) 1;
    `}
`;

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
    <HoopWrapper>
      <HoopImg src="/assets/hoop.png" alt="hoop" />
      <NetWrapper>
        <img src="/assets/net-top.png" alt="net top" />
        <NetImg
          src="/assets/net-bottom.png"
          alt="net bottom"
          $animating={isAnimating}
          onAnimationEnd={() => setIsAnimating(false)}
        />
      </NetWrapper>
    </HoopWrapper>
  );
}
