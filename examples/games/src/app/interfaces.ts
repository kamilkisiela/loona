export interface BaseGame {
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
}

export interface Game extends BaseGame {
  id: number;
}

export interface CurrentGame extends BaseGame {}

export interface CurrentGameStatus {
  error: boolean;
  created: boolean;
}

export interface GameInput extends BaseGame {}
