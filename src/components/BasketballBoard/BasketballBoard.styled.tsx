import styled from "styled-components";

export const BoardRoot = styled.div`
  position: relative;
  width: min(58%, 360px);
  aspect-ratio: 12 / 7;
  background: #fff;
  border: 6px solid black;
  border-radius: 8px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
  z-index: 1;
`;

export const InnerRect = styled.div`
  position: absolute;
  left: 50%;
  bottom: 15%;
  transform: translateX(-50%);
  width: 40%;
  height: 50%;
  border: 6px solid black;
  background: transparent;
`;
