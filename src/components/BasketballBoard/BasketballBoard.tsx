import styled from "styled-components";
import { useHoop } from "../../contexts/HoopContext";
import Hoop from "./Hoop";

const BoardRoot = styled.div`
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: min(58%, 360px);
  aspect-ratio: 12 / 7; /* official backboard ~72x42 in */
  background: #fff;
  border: 6px solid black;
  border-radius: 8px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
`;

const InnerRect = styled.div`
  position: absolute;
  left: 50%;
  bottom: 15%;
  transform: translateX(-50%);
  width: 40%;
  height: 50%;
  border: 6px solid black;
  background: transparent;
`;

type BoardProps = {};

export default function BasketballBoard({}: BoardProps) {
  const { swoosh } = useHoop();

  return (
    <>
      <BoardRoot>
        <InnerRect>
          <Hoop />
        </InnerRect>
      </BoardRoot>
      <button onClick={swoosh}>Swoosh</button>
    </>
  );
}
