import React from "react";

export default function InfoTable({ player, getRoles }) {
  if (player.game == null) {
    return <div/>
  }
  return (<div>
    <table style={{borderSpacing: 15, border: "1px solid #aaaaaa"}}>
      <tr>
        <th>GameID</th>
        <th>Phase</th>
        <th>Roles</th>
        <th>Policies</th>
        <th>Election Tracker</th>
        { player.game.electionData &&
        <th>Election Results</th>}
        <th>Ineligibles</th>
      </tr>
      <tr>
        <td><code>{player.game.gameID}</code></td>
        <td>{player.game.currentAction?.name}{player.game.currentAction?.name === "executive" && ": " + player.game.currentAction?.executiveType}</td>
        <td>{getRoles().map((Element: JSX.IntrinsicAttributes) => Element)}</td>
        <td>Lib: {player.game.libPolicies}, Fas: {player.game.fasPolicies}</td>
        <td>{player.game.electionTracker}</td>
        { player.game.electionData != null &&
        <td>
          <details>
            <summary>Ja</summary>
            <ul>
              {
                player.game.electionData?.votesJa?.map(x => <li>{player.game?.players?.find(p => p.userID === x)?.username}</li>)
              }
            </ul>
          </details>
          <details>
            <summary>Nein</summary>
            <ul>
              {
                player.game.electionData?.votesNein?.map(x => <li>{player.game?.players?.find(p => p.userID === x)?.username}</li>)
              }
            </ul>
          </details>
        </td>}
        <td>{player.game?.ineligiblePlayers?.map(x => <span>{player.game?.players?.find(p => p.userID === x)?.username}</span>)}</td>

      </tr>
    </table>

  </div>);
}