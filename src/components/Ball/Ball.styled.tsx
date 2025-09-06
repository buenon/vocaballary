import styled from "styled-components";

export const Root = styled.div<{
  $dragX: number;
  $dragY: number;
  $scale: number;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  container-type: inline-size;
  touch-action: none;
  cursor: grab;
  &.dragging {
    cursor: grabbing;
  }
  transform: translate3d(${(p) => p.$dragX}px, ${(p) => p.$dragY}px, 0)
    scale(${(p) => p.$scale});
  transition: transform 180ms ease, scale 180ms ease;
  /* Avoid CSS transitions fighting scripted rAF animations */
  &[data-animating="true"] {
    transition: none;
  }
  &.dragging {
    transition: none;
  }
  will-change: transform;
  backface-visibility: hidden; /* Force GPU acceleration */
`;

export const Layer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Img = styled.img`
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
`;

export const Label = styled.div`
  font-weight: 700;
  color: white;
  /* Scale directly based on the ball container size using container queries */
  font-size: clamp(14px, 12cqw, 24px);
  padding: clamp(4px, 3cqw, 10px);
  background: rgba(0, 0, 0, 0.7);
  border-radius: clamp(6px, 2cqw, 12px);
  max-width: 90%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
