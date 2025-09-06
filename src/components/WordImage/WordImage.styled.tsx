import styled from "styled-components";

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
  z-index: 2; /* behind ball by default */
  &.front {
    z-index: 8; /* above ball (7), below hoop front (9) */
  }
`;

export const Frame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  /* Bigger on phones, unchanged caps for tablets/desktop */
  width: clamp(120px, 45cqw, 260px);
  aspect-ratio: 1 / 1;
`;

export const Img = styled.img`
  width: 70%;
  height: 70%;
`;

export const SpinnerWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
