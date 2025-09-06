import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    #8fd3ff 0%,
    #6fbef3 35%,
    #64b85a 58%,
    #2e84d4 100%
  );
  z-index: 9999;
`;

export const Logo = styled.img`
  width: clamp(120px, 40vw, 240px);
  height: auto;
  margin-bottom: 24px;
  user-select: none;
`;
