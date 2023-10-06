function Board({ solution }: { solution: string[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 40px)" }}>
      {solution.map((row, rowIndex) =>
        row
          .split("")
          .map((cellType, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cellType} />
          ))
      )}
    </div>
  );
}

function Cell({ type }: { type: string }) {
  const color = {
    O: "red",
    P: "green",
    Q: "blue",
    R: "yellow",
    S: "purple",
    T: "orange",
    U: "pink",
    V: "cyan",
    W: "lime",
    X: "brown",
    Y: "magenta",
    Z: "teal",
  }[type];
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: color || "white",
        border: "1px solid black",
      }}
    ></div>
  );
}

export default Board;
