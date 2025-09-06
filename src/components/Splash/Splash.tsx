import Spinner from "../Spinner/Spinner";
import * as S from "./Splash.styled.tsx";

type Props = {
  visible: boolean;
};

export default function Splash({ visible }: Props) {
  if (!visible) return null;
  return (
    <S.Overlay role="status" aria-live="polite" aria-busy="true">
      <S.Logo src="/assets/logo.png" alt="Vocaballary" />
      <Spinner />
    </S.Overlay>
  );
}
