import Spinner from "../Spinner/Spinner";
import * as S from "./Splash.styled.tsx";

type Props = {
  visible: boolean;
  ready?: boolean;
  onStart?: () => void;
};

export default function Splash({ visible, ready = false, onStart }: Props) {
  if (!visible) return null;
  return (
    <S.Overlay role="status" aria-live="polite" aria-busy={!ready}>
      <S.Logo src="/vocaballary/assets/logo.png" alt="Vocaballary" />
      {ready ? (
        <button
          onClick={onStart}
          style={{
            marginTop: 16,
            padding: "12px 18px",
            borderRadius: 999,
            border: "none",
            background: "#ffb703",
            color: "#222",
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
          aria-label="Start"
        >
          Start
        </button>
      ) : (
        <Spinner />
      )}
    </S.Overlay>
  );
}
