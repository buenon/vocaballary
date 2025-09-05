import styled from "styled-components";

export const Root = styled.div`
  position: relative;
  width: 30%;
  aspect-ratio: 1 / 1;
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
  font-size: clamp(12px, 3.2vw, 48px);
  padding: clamp(4px, 1.2vw, 12px);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
`;
