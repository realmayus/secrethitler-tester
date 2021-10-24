import type { Game, Player } from './Types';

const URL = 'http://localhost:5000';

const errorHandler = async (res: Response) => {
  if (res.status < 300) {
    return await res.json();
  } else {
    console.error("Error: ", await res.json());
  }
}

export async function loginPlayer(username: string): Promise<Player> {
  const res = await fetch(URL + '/auth/login', {
    method: "POST",
    body: JSON.stringify({ username, password: 'start123' }),
    headers: { 'Content-Type': 'application/json' }
  });
  const content = await res.json();


  return {
    username: content.username,
    userID: content.userID,
    avatar: content.avatar,
    isModerator: content.isModerator,
    token: content.token,
    currentGame: content.currentGame,
    loggedIn: true,
    registered: false,
  };
}

export async function createGame(name: string, minPlayers: number, maxPlayers: number, player: Player): Promise<{ success: boolean, game: Game } | undefined> {
  const res = await fetch(URL + '/game/create', {
    method: "POST",
    body: JSON.stringify({ name, minPlayers, maxPlayers, token: player.token}),
    headers: { 'Content-Type': 'application/json' }
  });

  return await errorHandler(res);
}

export async function joinGame(gameID: number, player: Player): Promise<{ success: boolean, game: Game } | undefined> {
  let res = await fetch(URL + '/game/join', {
    method: "POST",
    body: JSON.stringify({ gameID, token: player.token}),
    headers: { 'Content-Type': 'application/json' }
  });

  return await errorHandler(res);
}

export async function nominate(nomineeID: number, player: Player): Promise<{ success: boolean, game: Game } | undefined> {
  let res = await fetch(URL + '/game/nominate', {
    method: "POST",
    body: JSON.stringify({ nomineeID, token: player.token}),
    headers: { 'Content-Type': 'application/json' }
  });

  return await errorHandler(res);
}


export async function vote(yes: boolean, player: Player): Promise<{ success: boolean, game: Game } | undefined> {
  let res = await fetch(URL + '/game/election', {
    method: "POST",
    body: JSON.stringify({ vote: yes ? "ja" : "nein", token: player.token}),
    headers: { 'Content-Type': 'application/json' }
  });

  return await errorHandler(res);
}

export async function discard(type: "liberal"|"fascist", player: Player): Promise<{ success: boolean, game: Game } | undefined> {
  let res = await fetch(URL + '/game/legislative', {
    method: "POST",
    body: JSON.stringify({ discard: type, token: player.token}),
    headers: { 'Content-Type': 'application/json' }
  });

  return await errorHandler(res);
}

export async function peekPolicies(player: Player): Promise<{ success: boolean } | undefined> {
  let res = await fetch(URL + '/game/executive', {
    method: "POST",
    body: JSON.stringify({ token: player.token}),
    headers: { 'Content-Type': 'application/json' }
  });

  return await errorHandler(res);
}
