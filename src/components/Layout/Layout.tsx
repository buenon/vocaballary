import * as S from "./Layout.styled";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <S.Root>
      <S.Frame>
        <S.BgImg src="/vocaballary/assets/background.png" alt="" />
        <S.Content>{children}</S.Content>
      </S.Frame>
    </S.Root>
  );
}
