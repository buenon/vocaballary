import styled, { keyframes } from "styled-components";

export const Bar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-size: clamp(18px, 5cqw, 36px);
`;

export const Left = styled.div`
  justify-self: start;
`;

export const Right = styled.div`
  justify-self: end;
`;

export const Strikes = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.8cqw, 12px);
  justify-self: center;
`;

export const Strike = styled.span`
  display: inline-block;
  color: #d5dbe1; /* lighter grey for better contrast */
  font-size: 1.6em;
  line-height: 1;
  text-shadow: inherit;
  &[data-active="true"] {
    color: #ff3b3b; /* red when struck */
  }
`;

const jitter = keyframes`
  0% { transform: translateX(0) rotate(0deg) scale(1); }
  15% { transform: translateX(-4px) rotate(-10deg) scale(1.1); }
  35% { transform: translateX(4px) rotate(8deg) scale(1.08); }
  55% { transform: translateX(-3px) rotate(-6deg) scale(1.06); }
  75% { transform: translateX(3px) rotate(4deg) scale(1.03); }
  100% { transform: translateX(0) rotate(0deg) scale(1); }
`;

export const StrikeAnimated = styled(Strike)`
  &[data-just-hit="true"] {
    animation: ${jitter} 600ms ease-out;
    transform-origin: center;
    will-change: transform;
  }
`;
