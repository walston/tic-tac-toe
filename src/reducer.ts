import { checkBoard, getBestMove, pause } from "./utils";
import { Player, Board } from "./types";
import { useEffect, useReducer } from "react";

type State = {
  user: Player | null;
  turn: Player;
  spaces: Board;
  winning_player: Player | null;
  /** indices of winning squares for highlighting */
  winning_squares: [number, number, number] | null;
};

type Action =
  | { type: "choose_user"; payload: Player }
  | { type: "user_play"; payload: number }
  | { type: "opponent_play" }
  | { type: "reset" };

/** Wrapping `dispatch` from useReducer this way makes the api a little bit cleaner to read in App */
type Dispatcher = {
  choose_user: (payload: Player) => void;
  user_play: (payload: number) => void;
  opponent_play: () => void;
  reset: () => void;
};

const initialState: State = {
  user: null,
  turn: "X",
  // prettier-ignore
  spaces: [ null, null, null,
            null, null, null, 
            null, null, null],
  winning_player: null,
  winning_squares: null,
};

function reducer(state: State, action: Action): State {
  const opponent = state.user === "X" ? "O" : "X";
  switch (action.type) {
    case "choose_user":
      return { ...state, user: action.payload };
    case "reset":
      return initialState;
    case "user_play": {
      if (!state.user) return state;
      if (state.winning_player) return state;
      const { payload: index } = action;
      const spaces = state.spaces.map((m, i) =>
        i === index ? state.user : m
      ) as Board;
      const winning_squares = checkBoard(spaces);
      return {
        ...state,
        spaces,
        turn: opponent,
        winning_squares,
        winning_player: winning_squares ? state.user : state.winning_player,
      };
    }
    case "opponent_play": {
      if (!state.user) return state;
      if (state.winning_player) return state;
      const index = getBestMove(state.spaces, opponent);
      const spaces = state.spaces.map((m, i) =>
        i === index ? opponent : m
      ) as Board;
      const winning_squares = checkBoard(spaces);
      return {
        ...state,
        spaces,
        turn: state.user,
        winning_squares,
        winning_player: winning_squares ? opponent : state.winning_player,
      };
    }
  }
  return state;
}

export function useAppState(): [State, Dispatcher] {
  const [state, dispatch] = useReducer(reducer, initialState);
  // prettier-ignore
  const dispatcher = {
    choose_user:    (payload: Player) => dispatch({ type: "choose_user", payload }),
    user_play:      (payload: number) => dispatch({ type: "user_play", payload }),
    opponent_play:  ()                => dispatch({ type: "opponent_play" }),
    reset:          ()                => dispatch({ type: "reset" }),
  };

  // Automatically handle opponent plays
  useEffect(() => {
    if (!state.user) return;
    const opponent = state.user === "X" ? "O" : "X";
    const firstMove = state.spaces.every((c) => c === null);
    if (state.turn === opponent)
      pause(firstMove ? 1 : 500).then(() => dispatcher.opponent_play());
  }, [state.user, state.turn]);

  return [state, dispatcher];
}
