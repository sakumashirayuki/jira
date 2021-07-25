import { useCallback, useState } from "react";

export const useUdo = <T>(initialPresent: T) => {
  // past用于记录历史操作：最新的操作在数组最后
  // future用于记录将来的操作：最新的操作在数组最前

  const [state, setState] = useState<{
    past: T[];
    present: T;
    future: T[];
  }>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    setState((prevState) => {
      const { past, present, future } = prevState;
      if (past.length === 0) return prevState;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prevState) => {
      const { past, present, future } = prevState;
      if (future.length === 0) return prevState;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const set = useCallback((newPresent: T) => {
    setState((prevState) => {
      const { past, present } = prevState;
      if (newPresent === present) return prevState;
      const newPrevious = present;
      return {
        past: [...past, newPrevious],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
    setState({
      past: [],
      present: newPresent,
      future: [],
    });
  }, []);

  return [state, { undo, redo, set, reset, canUndo, canRedo }] as const;
};
