import { useCallback, useEffect, useRef } from "react";
import { BoardSize, BoardType } from "./types.ts";

const Colors: Record<string, string> = {
  O: "#ff0000",
  P: "#ff8000",
  Q: "#ffff00",
  R: "#80ff00",
  S: "#00ff00",
  T: "#00ff80",
  U: "#00ffff",
  V: "#0080ff",
  W: "#0000ff",
  X: "#8000ff",
  Y: "#ff00ff",
  Z: "#ff0080",
};

function CanvasBoard({
  boardType,
  solution,
}: {
  boardType: BoardType;
  solution: string[] | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resizeCanvas = useCallback(() => {
    if (canvasRef.current) {
      const size = BoardSize[boardType];
      const unit =
        (window.innerWidth * 0.9) /
        (boardType === BoardType.Rect3x20 ? 20 : 15);
      canvasRef.current.style.height = `${unit * size.height}px`;
      canvasRef.current.style.width = `${unit * size.width}px`;
      canvasRef.current.height = 50 * size.height;
      canvasRef.current.width = 50 * size.width;
    }
  }, [boardType]);
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas, boardType]);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (!solution) {
      return;
    }
    solution.forEach((row, rowIndex) => {
      row.split("").forEach((col, colIndex) => {
        ctx.fillStyle = Colors[col] || "black";
        ctx.fillRect(colIndex * 50, rowIndex * 50, 50, 50);
        ctx.strokeStyle = "darkdarkgray";
        if (rowIndex === 0 || solution[rowIndex - 1].charAt(colIndex) !== col) {
          ctx.beginPath();
          ctx.moveTo(colIndex * 50, rowIndex * 50);
          ctx.lineTo(colIndex * 50 + 50, rowIndex * 50);
          ctx.stroke();
        }
        if (colIndex === 0 || row.charAt(colIndex - 1) !== col) {
          ctx.beginPath();
          ctx.moveTo(colIndex * 50, rowIndex * 50);
          ctx.lineTo(colIndex * 50, rowIndex * 50 + 50);
          ctx.stroke();
        }
        if (
          rowIndex === solution.length - 1 ||
          solution[rowIndex + 1].charAt(colIndex) !== col
        ) {
          ctx.beginPath();
          ctx.moveTo(colIndex * 50, rowIndex * 50 + 50);
          ctx.lineTo(colIndex * 50 + 50, rowIndex * 50 + 50);
          ctx.stroke();
        }
        if (
          colIndex === solution[rowIndex].length - 1 ||
          row.charAt(colIndex + 1) !== col
        ) {
          ctx.beginPath();
          ctx.moveTo(colIndex * 50 + 50, rowIndex * 50);
          ctx.lineTo(colIndex * 50 + 50, rowIndex * 50 + 50);
          ctx.stroke();
        }
      });
    });
  }, [canvasRef, solution]);
  const onClick = useCallback(() => {
    const newWindow = window.open("", "_blank");
    canvasRef.current?.toBlob((blob) => {
      if (blob && newWindow) {
        newWindow.location.href = URL.createObjectURL(blob);
      }
    }, "image/png");
  }, [canvasRef]);
  return (
    <div className="flex justify-center mb-4">
      <canvas
        ref={canvasRef}
        style={{ cursor: solution ? "pointer" : "default" }}
        onClick={solution ? onClick : () => {}}
        className="border-gray-200 border-double border-2"
      />
    </div>
  );
}

export default CanvasBoard;
