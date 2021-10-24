import type { Player } from './Types';


export function playerLog(player: Player, msg: any) {
  console.log("[" + player.username + "] " + String(msg));
}