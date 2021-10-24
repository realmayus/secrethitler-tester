import React, { useEffect, useState } from 'react';

import './App.css';
import type { Player } from './Types';
import { loginPlayer } from './Api';
import PlayerCard from './PlayerCard';
import { playerLog } from './Util';

interface AppProps {}

function App({}: AppProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleMessage = (p: Player, msg: any) => {
    if (msg.type === "register" && msg.success) {
      p.registered = true;
      setPlayers([...players.filter(pl => pl.userID !== p.userID), p]);
      playerLog(p, "Registered websocket")
    }
    else if (msg.type === "gameInfo") {
      p.game = msg.game;
      setPlayers([...players.filter(pl => pl.userID !== p.userID), p]);
      playerLog(p, "Received gameInfo");
    }
  }

  useEffect(() => {
    players.forEach((p) => {
      if (p.ws == null) {
        playerLog(p, "Initializing websocket")
        p.ws = new WebSocket("ws://localhost:5000");
        p.ws.onopen = () => {
          playerLog(p, "Websocket opened");
          // @ts-ignore
          p.ws.send(JSON.stringify({ type: "register", token: p.token }))
        }

        p.ws.onmessage = (msgE) => {
          let msg = JSON.parse(msgE.data);
          handleMessage(p, msg);
        }
        p.ws.onclose = () => {
          playerLog(p, "Websocket closed");
        }
        p.ws.onerror = (err) => {
          console.error("[" + p.username + "] " + err)
        }
      }
    })
  }, [players])

  const loginAll = async () => {
    setButtonClicked(true);
    const promises = [];

    promises.push(loginPlayer('testuser' + 0));
    promises.push(loginPlayer('testuser' + 1));
    promises.push(loginPlayer('testuser' + 2));
    promises.push(loginPlayer('testuser' + 3));
    promises.push(loginPlayer('testuser' + 4));
    promises.push(loginPlayer('testuser' + 5));


    let resolvedPlayers = await Promise.all(promises);

    setPlayers(resolvedPlayers);
  }

  return (
    <div>
      { !buttonClicked &&
        <button onClick={loginAll}>Log in</button>
      }
      {players.sort((a, b) => a.username > b.username).map(p => <PlayerCard key={p.userID} player={p} players={players} setPlayers={setPlayers}/>)}
    </div>
  );
}

export default App;
