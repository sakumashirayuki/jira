import { useCallback, useReducer } from "react";

const UNDO = "UNDO";
const REDO = "REDO";
const SET = "SET";
const RESET = "RESET";

type State<T> = {
  past: T[];
  present: T;
  future: T[];
};

type Action<T> = {
  newPresent?: T;
  type: typeof UNDO | typeof REDO | typeof SET | typeof RESET;
};

const undoReducer = <T>(state: State<T>, action: Action<T>) => {
  // reducer的工作机制：从前一个state，推断出当前的state
  const { past, present, future } = state;
  const { type, newPresent } = action;
  switch (type) {
    case UNDO:
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    case REDO:
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    case SET:
      if (newPresent === present) return state;
      const newPrevious = present;
      return {
        past: [...past, newPrevious],
        present: newPresent,
        future: [],
      };
    case RESET:
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    default:
      return state;
  }
};

export const useUdo = <T>(initialPresent: T) => {
  // past用于记录历史操作：最新的操作在数组最后
  // future用于记录将来的操作：最新的操作在数组最前
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: [],
  } as State<T>);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => dispatch({ type: UNDO }), []);

  const redo = useCallback(() => dispatch({ type: REDO }), []);

  const set = useCallback(
    (newPresent: T) => dispatch({ newPresent, type: SET }),
    []
  );

  const reset = useCallback(
    (newPresent: T) => dispatch({ newPresent, type: RESET }),
    []
  );

  return [state, { undo, redo, set, reset, canUndo, canRedo }] as const;
};
