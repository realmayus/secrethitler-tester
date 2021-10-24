export interface Player {
  username: string;
  userID: number;
  avatar: string;
  isModerator: boolean;
  token: string;
  currentGame: number;
  loggedIn: boolean;
  registered: boolean;
  ws?: WebSocket;
  game?: Game;
}


export interface Game {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  gameID?: number;
  currentAction?: any;
  role?: "hitler" | "fascist" | "liberal" | undefined;
  players?: Player[];
  deadPlayers?: number[];
  libPolicies?: number;
  fasPolicies?: number;
  ineligiblePlayers?: number[];
  spectators?: Player[];
  chatHistory?: ChatMessage[];
  typing?: number[];
  president?: number;
  chancellorNominee?: number;
  chancellor?: number;
  electionTracker?: number;
  electionData?: {
    nominee: number;
    outcome: boolean;
    votesJa: number[];
    votesNein: number[];
  }
}

interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  editedAt: undefined | number;
  author: number;
}
