import { useCallback, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useHoop } from "../../contexts/HoopContext";

const Wrapper = styled.div`
  position: relative;
  top: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const swooshKeyframes = keyframes`
  0% { transform: scaleY(1); }
  25% { transform: scaleY(0.25); }
  50% { transform: scaleY(1.15); }
  65% { transform: scaleY(0.95); }
  80% { transform: scaleY(1.05); }
  92% { transform: scaleY(0.995); }
  100% { transform: scaleY(1); }
`;

const NetTop = styled.img`
  display: block;
  user-select: none;
  pointer-events: none;
`;

const NetBottom = styled.img<{ $animating: boolean }>`
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
    <Wrapper>
      <NetTop src="/assets/net-top.png" alt="hoop top" />
      <NetBottom
        src="/assets/net-bottom.png"
        alt="hoop net"
        $animating={isAnimating}
        onAnimationEnd={() => setIsAnimating(false)}
      />
    </Wrapper>
  );
}
