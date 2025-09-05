import type { PropsWithChildren } from "react";
import styled from "styled-components";

type LayoutProps = PropsWithChildren<{
  backgroundSrc?: string;
}>;

const DEFAULT_BG = "/assets/background.png";

const Root = styled.div`
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
    /* sky light */ #6fbef3 35%,
    /* sky mid */ #64b85a 58%,
    /* grass */ #2e84d4 100% /* court */
  );
`;

const BgImg = styled.img`
  display: block;
  height: 100%;
  width: auto;
  user-select: none;
  pointer-events: none;
`;

const Frame = styled.div`
  position: relative;
  height: 100%;
  display: inline-block; /* shrink to fit background image width */
`;

const Content = styled.div`
  position: absolute;
  inset: 0; /* match the image bounds */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;

export default function Layout({
  children,
  backgroundSrc = DEFAULT_BG,
}: LayoutProps) {
  return (
    <Root>
      <Frame>
        <BgImg src={backgroundSrc} alt="" />
        <Content>{children}</Content>
      </Frame>
    </Root>
  );
}
