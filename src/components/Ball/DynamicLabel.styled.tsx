import styled from "styled-components";

export const DynamicLabel = styled.div<{ $fontSize: number }>`
  font-weight: 700;
  color: white;
  font-size: ${(p) => p.$fontSize}px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  line-height: 1.2;
  display: inline-block;
  text-align: center;

  > div {
    white-space: nowrap;
  }
`;
