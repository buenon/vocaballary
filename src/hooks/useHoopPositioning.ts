import { useLayoutEffect, useState, type RefObject } from "react";

type HoopPosition = {
  top: number;
  left: number;
  width: number;
};

export function useHoopPositioning(boardRef: RefObject<HTMLDivElement>) {
  const [hoopPosition, setHoopPosition] = useState<HoopPosition | null>(null);

  useLayoutEffect(() => {
    const updateHoopPosition = () => {
      if (!boardRef.current) return;

      const boardRect = boardRef.current.getBoundingClientRect();
      const courtLayerRect =
        boardRef.current.parentElement?.getBoundingClientRect();

      if (!courtLayerRect) return;

      // Position hoop higher up from the bottom of the board
      const hoopTop =
        boardRect.bottom - courtLayerRect.top - boardRect.height * 0.3;
      const hoopLeft =
        boardRect.left + boardRect.width / 2 - courtLayerRect.left;
      const hoopWidth = boardRect.width * 0.4; // 40% of board width (matches InnerRect)

      setHoopPosition({
        top: hoopTop,
        left: hoopLeft,
        width: hoopWidth,
      });
    };

    updateHoopPosition();

    const resizeObserver = new ResizeObserver(updateHoopPosition);
    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }

    window.addEventListener("resize", updateHoopPosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHoopPosition);
    };
  }, [boardRef]);

  return hoopPosition;
}
