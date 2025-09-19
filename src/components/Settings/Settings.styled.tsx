import styled from "styled-components";

export const SettingsButton = styled.button`
  position: absolute;
  top: 60px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #ffb703;
  border: 2px solid #d49400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 11;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 3px solid #ffb703;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const CloseButton = styled.button`
  background: #ff6b6b;
  border: 2px solid #e53e3e;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const SoundControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
`;

export const SoundControl = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SoundBtn = styled.button<{ $muted: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${(props) => (props.$muted ? "#ccc" : "#ffb703")};
  border: 2px solid ${(props) => (props.$muted ? "#999" : "#d49400")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const SoundLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
`;

export const Attribution = styled.div`
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-top: 1px solid #e0e0e0;
`;

export const AttributionText = styled.p<{ $license?: boolean }>`
  margin: 0 0 8px 0;
  font-size: ${(props) => (props.$license ? "0.6rem" : "0.9rem")};
  color: #666;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: #333;
  }

  a {
    color: #ffb703;
    text-decoration: none;
    font-weight: 500;
  }
`;
