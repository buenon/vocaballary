import styled from "styled-components";

export const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  inset: 0;
  background: linear-gradient(
    180deg,
    #8fd3ff 0%,
    #6fbef3 35%,
    #64b85a 58%,
    #2e84d4 100%
  );
`;

export const BgImg = styled.img`
  display: block;
  height: 100%;
  width: auto;
  user-select: none;
  pointer-events: none;
`;

export const Frame = styled.div`
  position: relative;
  height: 100%;
  display: inline-block;
`;

export const Content = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;
