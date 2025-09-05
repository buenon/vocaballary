import styled, { keyframes } from "styled-components";

export const GameOverOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const pop = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
`;

export const GameOverCard = styled.div`
  background: #fff7e6;
  color: #3a2a00;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  width: min(92%, 420px);
  padding: 20px 20px 16px;
  text-align: center;
  font-size: clamp(16px, 4cqw, 22px);
  animation: ${pop} 400ms ease-out;
`;

export const GameOverTitle = styled.div`
  font-weight: 900;
  font-size: 1.4em;
  letter-spacing: 0.5px;
  color: #ff6b00;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
`;

export const GameOverScores = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  justify-items: center;
  margin: 8px 0 12px;
`;

export const ScorePill = styled.div`
  background: #ffe0b8;
  border-radius: 999px;
  padding: 6px 12px;
  min-width: 110px;
`;

export const PlayAgainButton = styled.button`
  font-size: clamp(16px, 4cqw, 22px);
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(180deg, #ffd066 0%, #ff9f1a 100%);
  color: #3a2a00;
  box-shadow: 0 6px 0 #cc7f13;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
  &:active {
    transform: translateY(3px);
    box-shadow: 0 3px 0 #cc7f13;
  }
`;
