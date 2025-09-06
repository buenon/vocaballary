import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div<{
  $size: number;
  $color: string;
  $track: string;
}>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border: 4px solid ${(p) => p.$track};
  border-top-color: ${(p) => p.$color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
