import { SubmitHandler, useFormContext } from "react-hook-form";
import { BoardType, SolverType } from "./types.ts";

export type Inputs = {
  solver_type: SolverType;
  board_type: BoardType;
  unique: boolean;
};

function Form({
  onSubmit,
  isReady,
}: {
  onSubmit: SubmitHandler<Inputs>;
  isReady: boolean;
}) {
  const { handleSubmit, register } = useFormContext<Inputs>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        solver:
        {Object.entries(SolverType).map(([key, value]) => {
          return (
            <label key={key}>
              <input {...register("solver_type")} type="radio" value={value} />
              {value}
            </label>
          );
        })}
      </div>
      <div>
        board type:
        <select {...register("board_type")}>
          {Object.values(BoardType).map((value) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        unique:
        <input {...register("unique")} type="checkbox" />
      </div>
      <button type="submit" disabled={!isReady}>
        solve
      </button>
    </form>
  );
}

export default Form;
