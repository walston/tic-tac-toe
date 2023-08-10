import { Board, Cell, Player } from "./types";

export const POSSIBLE_WINS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function matches(a: Cell, b: Cell, c: Cell) {
  if (a === null) return false;
  if (b !== a) return false;
  if (c !== b) return false;
  return a;
}

export function checkBoard(board: Board): [number, number, number] | null {
  for (const [a, b, c] of POSSIBLE_WINS) {
    const thereIsAMatch = matches(board[a], board[b], board[c]);
    if (thereIsAMatch) {
      return [a, b, c];
    }
  }
  return null;
}

export function getBestMove(board: Board, player: Player): number {
  /**
   * @note
   * we need a way of traversing different paths so we'll use recursion
   * we'll do that by defining a function that:
   * - takes in the board on a current turn
   * - knows the player who's turn it is
   * - returns a fractional value represetning
   *    - how many turns it took to get to a win or loss
   */

  /** what we want: given a board where ...
   * 1. the current move can win, should return the winning cell.
   * 2. the opponent could win next move, should return that cell
   */
  const empties = board.reduce((emptySlots: number[], curr, index) => {
    if (curr === null) emptySlots.push(index);
    return emptySlots;
  }, []);

  if (empties.length === 1) {
    return empties[0];
  }

  // scan for player win opportunities
  for (const empty of empties) {
    const myBoard = [...board];
    myBoard[empty] = player;
    const win = checkBoard(myBoard);
    if (win) {
      return empty;
    }
  }

  // block their win
  for (const empty of empties) {
    const theirBoard = [...board];
    theirBoard[empty] = player === "O" ? "X" : "O";
    const theirWin = checkBoard(theirBoard);
    if (theirWin) {
      return empty;
    }
  }

  // choose randomly
  const random = empties[Math.floor(Math.random() * empties.length)];
  return random;
}
