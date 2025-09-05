import styled, { css, keyframes } from "styled-components";

export const HoopWrapper = styled.div`
  position: relative;
  top: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HoopImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  user-select: none;
  pointer-events: none;
`;

export const NetWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const swooshKeyframes = keyframes`
  0% { transform: scaleY(1); }
  15% { transform: scaleY(1.3); }
  35% { transform: scaleY(0.35); }
  50% { transform: scaleY(1.15); }
  65% { transform: scaleY(0.95); }
  80% { transform: scaleY(1.05); }
  92% { transform: scaleY(0.995); }
  100% { transform: scaleY(1); }
`;

export const NetImg = styled.img<{ $animating: boolean }>`
  display: block;
  user-select: none;
  pointer-events: none;
  transform-origin: 50% 0%;
  will-change: transform;
  ${(p) =>
    p.$animating &&
    css`
      animation: ${swooshKeyframes} 700ms cubic-bezier(0.22, 1, 0.36, 1) 1;
    `}
`;
