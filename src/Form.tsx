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
      <div className="flex items-center justify-start">
        <label className="mr-2 text-right w-16">Solver:</label>
        {Object.entries(SolverType).map(([key, value]) => {
          return (
            <label key={key} className="mr-2 cursor-pointer">
              <input
                {...register("solver_type")}
                type="radio"
                value={value}
                className="mr-1"
              />
              {value}
            </label>
          );
        })}
      </div>
      <div className="flex items-center justify-start">
        <label className="mr-2 text-right w-16">Board:</label>
        <select
          {...register("board_type")}
          className="bg-gray-700 text-gray-200 rounded-md"
        >
          {Object.values(BoardType).map((value) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex items-center justify-start">
        <label className="mr-2 text-right w-16">Unique:</label>
        <input {...register("unique")} type="checkbox" />
      </div>
      <div className="flex">
        <label className="mr-2 text-right w-16"></label>
        <button
          type="submit"
          disabled={!isReady}
          className={`${
            isReady ? "bg-blue-600" : "bg-gray-700"
          } hover:bg-blue-500 text-white px-2 py-1 rounded`}
        >
          solve
        </button>
      </div>
    </form>
  );
}

export default Form;
