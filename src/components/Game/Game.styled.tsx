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
