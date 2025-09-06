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

export const HoopContainer = styled.div`
  position: absolute;
  /* Position hoop at the same location as it was inside the board */
  /* Board is at gap position from HUD, so we calculate from there */
  top: calc(
    clamp(12px, 2.5cqw, 24px) + min(58%, 360px) * 7 / 12 * 0.15 +
      min(58%, 360px) * 7 / 12 * 0.5 * 0.7
  );
  left: 50%;
  transform: translateX(-50%);
  /* Width matches the InnerRect width (40% of board width) */
  width: calc(min(58%, 360px) * 0.4);
  z-index: 5;
  pointer-events: none;
`;

export const WordImageContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  /* Center the word image in the court area */
  margin-top: -20px; /* Slight adjustment to center better */
`;

export const BallContainer = styled.div<{ $xPercent: number }>`
  position: absolute;
  bottom: clamp(12px, 2.5cqw, 24px);
  left: ${(p) => p.$xPercent}%;
  transform: translateX(-50%);
  z-index: 3; /* Behind the net */
  /* Give the container a proper size for the ball to reference */
  width: clamp(160px, 32cqw, 220px);
  height: clamp(160px, 32cqw, 220px);
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
