import React, { useEffect, useState } from 'react';
import type { Player } from './Types';
import { createGame, discard, joinGame, nominate, vote } from './Api';
import InfoTable from './InfoTable';

interface Props {
  player: Player;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

export default function PlayerCard({ player, players, setPlayers }: Props) {

  const [currentMode, setCurrentMode] = useState<null|"creategame"|"joingame"|"nominate"|"legislative">(null);

  const getRoles = () => {
    let roles = [];
    if (player.game && player.game.president && player.game.president === player.userID) {
      roles.push(<b>President • </b>);
    }
    if (player.game && player.game.chancellorNominee && player.game.chancellorNominee === player.userID) {
      roles.push(<b>Chancellor (Nominee) • </b>);
    }
    if (player.game && player.game.chancellor && player.game.chancellor === player.userID) {
      roles.push(<b>Chancellor • </b>);
    }
    if (player.game && player.game.role) {
      roles.push(<b style={{color: player.game.role === 'liberal' ? '#4c70ff' : '#ff2a2a'}}>{player.game.role}</b>)
    }
    return roles;
  }

  return (
    <div style={{border: "1px solid black", padding: 5, margin: 15, display: "flex"}}>
      <div style={{marginRight: "auto"}}>
        <b>username: {player.username}</b>
        <p>
          userID: {player.userID} • token: {player.token}
        </p>
          {  /* @ts-ignore*/}
        <small>{player.ws != null && player.ws.socketID}</small>
        <p>
          logged in: {String(player.loggedIn)} • registered: {String(player.registered)}
        </p>
        <InfoTable player={player} getRoles={getRoles}/>
        {player.game != null &&
          <div>
            <details>
              <summary>Game {}</summary>
              <div style={{ backgroundColor: '#3a3a3a', color: '#ffffff', fontWeight: 600 }}>
                <code style={{ whiteSpace: 'pre' }}>{JSON.stringify(player.game, null, 2)}</code>
              </div>
            </details>
          </div>
        }
      </div>
      <div style={{width: 200, display: "flex", flexDirection: "column"}}>
        { currentMode === null &&
          <div>
            <button disabled={player.game != null} onClick={() => {setCurrentMode("creategame")}}>Create Game</button><br/>
            <button disabled={player.game != null} onClick={() => {setCurrentMode("joingame")}}>Join Game</button><br/>
            { player.game?.president === player.userID &&
              <div>
                <button disabled={player.game.currentAction.name !== "nomination"} onClick={() => {setCurrentMode("nominate")}}>Nominate</button><br/>
              </div>
            }
            { player.game?.currentAction?.name === "election" &&
            <div style={{display: "flex"}}>
              <button onClick={async() => {
                await vote(true, player);
              }}>Ja</button><br/>
              <button onClick={async() => {
                await vote(false, player);
              }}>Nein</button><br/>
            </div>
            }
            { player.game?.currentAction?.name === "legislative" &&
            ((player.game?.currentAction?.whoseTurn === "president" && player.game.president === player.userID) ||
              (player.game?.currentAction?.whoseTurn === "chancellor" && player.game.chancellor === player.userID)) &&
                <div style={{display: "flex"}}>
                  <button onClick={() => setCurrentMode("legislative")}>Discard</button><br/>
                </div>
            }
            { player.game?.currentAction?.name === "executive" &&
              (player.game?.currentAction?.whoseTurn === "president" && player.game.president === player.userID) &&
              <div style={{display: "flex"}}>
                <button onClick={peekPolicies}>Peek Policies</button><br/>
              </div>
            }
          </div>
        }

        {currentMode === "creategame" &&
          <form onSubmit={async (e) => {
            e.preventDefault();
            // @ts-ignore
            const gameMsg = await createGame(e.target.name.value, Number(e.target.minPlayers.value), Number(e.target.maxPlayers.value), player);
            player.game = gameMsg?.game;
            setPlayers([...players.filter(pl => pl.userID !== player.userID), player]);
            setCurrentMode(null);
          }}>
            <label>Name: <input type="text" name={"name"} defaultValue={"test"}/> </label> <br/>
            <label>Min Players: <input type="range" name={"minPlayers"} min={5} max={10} defaultValue={5}/> </label><br/>
            <label>Max Players: <input type="range" name={"maxPlayers"} min={5} max={10}/> </label><br/>
            <div style={{display: "flex"}}>
              <button>OK</button><button type="button" onClick={() => setCurrentMode(null)}>Cancel</button>
            </div>
          </form>
        }

        {currentMode === "joingame" &&
          <form onSubmit={async (e) => {
            e.preventDefault();
            // @ts-ignore
            const gameMsg = await joinGame(e.target.gameID.value, player);
            player.game = gameMsg?.game;
            setPlayers([...players.filter(pl => pl.userID !== player.userID), player]);
            setCurrentMode(null);
          }}>
            <label>GameID: <input type="text" name={"gameID"}/> </label> <br/>
            <div style={{display: "flex"}}>
              <button>OK</button><button type="button" onClick={() => setCurrentMode(null)}>Cancel</button>
            </div>
          </form>
        }

        {currentMode === "nominate" &&
          <form onSubmit={async (e) => {
            e.preventDefault();
            // @ts-ignore
            const gameMsg = await nominate(e.target.nominee.value, player);
            setCurrentMode(null);
          }}>
            <label>Nominee: <select name={"nominee"}>
              {players.filter(p => p !== player && !player.game?.ineligiblePlayers?.includes(p.userID)).map(p =>
                <option value={p.userID}>{p.username}</option>
              )}
            </select> </label> <br/>
            <div style={{display: "flex"}}>
              <button>OK</button><button type="button" onClick={() => setCurrentMode(null)}>Cancel</button>
            </div>
          </form>
        }

        {currentMode === "legislative" &&
        <form onSubmit={async (e) => {
          e.preventDefault();
          // @ts-ignore
          await discard(e.target.discard.value, player);
          setCurrentMode(null);
        }}>
          <label>Discard <select name={"discard"}>
            {player.game?.currentAction?.policies?.map((p: {type: string}) =>
              <option value={p.type}>{p.type}</option>
            )}
          </select> </label> <br/>
          <div style={{display: "flex"}}>
            <button>OK</button><button type="button" onClick={() => setCurrentMode(null)}>Cancel</button>
          </div>
        </form>
        }

      </div>
    </div>
  );
}
