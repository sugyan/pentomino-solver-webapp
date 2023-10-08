import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BoardType } from "./types.ts";

type Inputs = {
  board_type: BoardType;
  unique: boolean;
};

interface Props {
  defaultValues: Inputs;
  onSubmit: SubmitHandler<Inputs>;
  onChangeValues: ({ board_type }: { board_type: BoardType }) => void;
}

function Form({ defaultValues, onSubmit, onChangeValues }: Props) {
  const { handleSubmit, register, watch } = useForm<Inputs>({
    defaultValues,
  });
  const boardType = watch("board_type");
  useEffect(() => {
    onChangeValues({ board_type: boardType });
  }, [boardType, onChangeValues]);
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
