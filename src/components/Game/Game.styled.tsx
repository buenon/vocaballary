import styled from "styled-components";

export const CourtLayer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(12px, 2.5cqw, 24px);
  container-type: inline-size;
  /* Ensure a sensible minimum stage width for small phones (e.g., 320px) */
  min-width: 320px;
`;

export const HoopBackContainer = styled.div<{
  $top: number;
  $left: number;
  $width: number;
}>`
  position: absolute;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  width: ${(p) => p.$width}px;
  transform: translateX(-50%);
  z-index: 1;
`;

export const HoopContainer = styled.div<{
  $top: number;
  $left: number;
  $width: number;
  $front?: boolean;
}>`
  position: absolute;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  width: ${(p) => p.$width}px;
  transform: translateX(-50%);
  z-index: ${(p) => (p.$front ? 9 : 5)};
  pointer-events: none;
`;

export const WordImageContainer = styled.div`
  z-index: 2;
  &.front {
    z-index: 8; /* below hoop front (9) but above ball (7) */
  }
  /* Center the word image in the court area */
  margin-top: -20px; /* Slight adjustment to center better */
`;

export const BallContainer = styled.div<{ $xPercent: number }>`
  position: absolute;
  bottom: clamp(12px, 2.5cqw, 24px);
  left: ${(p) => p.$xPercent}%;
  transform: translateX(-50%);
  z-index: 7; /* In front by default; hoop front can override during swish */
  /* Give the container a responsive size that scales with both width and height */
  /* Each ball ~30% of the game layout width, with sensible min/max */
  width: clamp(120px, 30cqw, 200px);
  height: clamp(120px, 30cqw, 200px);
`;

export const LoadingText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #333;
  z-index: 10;
`;

export const HoopFiller = styled.div`
  height: 10%;
`;

export const BallRack = styled.div`
  height: 24%;
`;
