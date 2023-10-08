import { SubmitHandler, useFormContext } from "react-hook-form";
import { BoardType } from "./types.ts";

export interface Changes {
  board_type: BoardType;
  unique: boolean;
}

export type Inputs = {
  board_type: BoardType;
  unique: boolean;
};

function Form({ onSubmit }: { onSubmit: SubmitHandler<Inputs> }) {
  const { handleSubmit, register } = useFormContext<Inputs>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <button type="submit">solve</button>
    </form>
  );
}

export default Form;
