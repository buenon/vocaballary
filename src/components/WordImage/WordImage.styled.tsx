import styled from "styled-components";

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const Frame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  width: clamp(120px, 32vw, 260px);
  aspect-ratio: 1 / 1;
`;

export const Img = styled.img`
  width: 70%;
  height: 70%;
`;
