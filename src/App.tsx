import React from "react";
import { checkBoard, getBestMove, wait } from "./utils";
import { Player, Board } from "./types";
import "./App.css";

type State = {
  user: Player | null;
  turn: Player;
  spaces: Board;
  winning_player: Player | null;
  /** indices of winning squares for highlighting */
  winning_squares: [number, number, number] | null;
};

type Action =
  | {
      type: "choose_user";
      user: Player;
    }
  | {
      type: "user_play";
      index: number; // index
    }
  | {
      type: "opponent_play";
    }
  | {
      type: "reset";
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
      return { ...state, user: action.user };
    case "reset":
      return initialState;
    case "user_play": {
      if (!state.user) return state;
      if (state.winning_player) return state;
      const { index } = action;
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

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  let boardClasses = "board";
  let message;

  if (state.winning_player) {
    boardClasses = "board game-over";
    message = `The Champion is ${state.winning_player}`;
  } else if (!state.spaces.includes(null) && state.winning_player === null) {
    boardClasses = "board game-over";
    message = "This game is for the cats";
  } else {
    message = `Current Player: ${state.turn}`;
  }

  return (
    <div className="App">
      {state.user === null ? (
        <p>
          Who will you play?
          <button
            onClick={() => {
              dispatch({ type: "choose_user", user: "X" });
            }}
          >
            X
          </button>
          <button
            onClick={() => {
              dispatch({ type: "choose_user", user: "O" });
              dispatch({ type: "opponent_play" });
            }}
          >
            O
          </button>
        </p>
      ) : null}
      <div className={boardClasses}>
        {state.spaces.map((value, index) => {
          const isWinningSquare = state.winning_squares?.includes(index);
          const disabled =
            value !== null || state.user === null || state.turn !== state.user;
          return (
            <button
              className={isWinningSquare ? "square winner-declared" : "square"}
              disabled={disabled}
              key={index}
              onClick={async () => {
                dispatch({ type: "user_play", index });
                await wait(500);
                dispatch({ type: "opponent_play" });
              }}
            >
              {value || null}
            </button>
          );
        })}
      </div>
      <div className="game-play">
        <div className="turns">{message}</div>
        <button className="reset" onClick={() => dispatch({ type: "reset" })}>
          Reset game
        </button>
      </div>
    </div>
  );
}
