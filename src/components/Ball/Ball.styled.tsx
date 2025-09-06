import styled from "styled-components";

export const Root = styled.div<{ $dragX: number; $dragY: number }>`
  position: relative;
  width: 50%;
  aspect-ratio: 1 / 1;
  container-type: inline-size;
  touch-action: none;
  cursor: grab;
  &.dragging {
    cursor: grabbing;
  }
  transform: translate(${(p) => p.$dragX}px, ${(p) => p.$dragY}px);
  transition: transform 180ms ease;
  &.dragging {
    transition: none;
  }
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
  font-size: clamp(16px, 18cqw, 36px);
  padding: clamp(4px, 4cqw, 12px);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  max-width: 90%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
