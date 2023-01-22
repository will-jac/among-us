import './App.css';
import {useState, useEffect} from 'react';
import cookie from 'react-cookies';

const MessageTypes = {
  create_game: 'create_game',
  join_game: 'join_game',
  leave_game: 'leave_game',
  start_game: 'start_game',
  end_game: 'end_game', 
  set_player_name: 'set_name', 
  sabotage: 'sabotage',
  kill: 'kill',
  complete_task: 'complete_task',
  play_again: 'play_again',
  heartbeat: 'heartbeat',
  fix_sabotage: 'fix_sabotage',
}

const GameStatus = {
  lobby: 'lobby',
  playing: 'playing',
  sabotaged: 'sabotaged',
  emergency_meeting: 'emergency_meeting',
  kill_meeting: 'kill_meeting',
  game_over: 'game_over',
}

var W3CWebSocket = require('websocket').w3cwebsocket;

var client = new W3CWebSocket('ws://192.168.0.29:3030/', 'echo-protocol');

client.onerror = function() {
    console.log('Connection Error');
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

const sendMessage = function(msg, playerID) {
  // console.log('sending message:', msg, playerID);
  // add metadata and unpack the message
  client.send(JSON.stringify({
    player_id: playerID,
    ...msg
  }));
};

function App() {
  const [serverConnected, setServerConnected] = useState(false);
  const [availableGames, setAvailableGames] = useState([]);
  const [gameID, setGameID] = useState('');
  const [playerID, setPlayerID] = useState('');
  const [playerName, setPlayerName] = useState('');

  const [gameIdDone, setGameIdDone] = useState(false);

  const [gamestate, setGamestate] = useState({});
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    try {
      sendMessage({type:MessageTypes.heartbeat}, playerID);
    } catch {
      // no-op
    }

  }, [playerID]);

  const parseGameState = function(gamestate) {
    if (gamestate === undefined || gamestate === null) return;

    setGameID(gamestate.game_id);
    setPlayerName(gamestate.player_name);

    setGamestate(gamestate);
  };

  client.onopen = function() {
    console.log('WebSocket Client Connected');
    setServerConnected(true);
    // send a hearbeat
    setMessage('sending heartbeat');
    sendMessage({type:MessageTypes.heartbeat}, playerID);
  }; 

  client.onmessage = function(msg) {
    
    var data = JSON.parse(msg.data)
    // console.log('message', data);
    // server is ready for us
    if (data.type === 'init') {
      setAvailableGames(data.available_games);
      // if we don't have a player id yet, accept the server's
      var p_id = cookie.load('player_id')

      if (playerID === '' && (p_id === null || p_id === undefined || p_id === '' || p_id === 'undefined' || p_id === 'null')) {
        // auto-triggers a heartbeat
        console.log('accepting pid from server', data.player_id);
        setPlayerID(data.player_id);
      }
      // otherwise, use the one in the cookie and request a gamestate
      else if (playerID === '') {
        // auto-triggers a heartbeat
        console.log('accepting pid from cookie', p_id);
        setPlayerID(p_id);
      }
      return;
    }
    // not part of gamestate
    var message = data.message;
    console.log('msg:',message);
    setMessage(message); 

    var gamestate = data.gamestate;
    console.log('gamestate:',gamestate);
    parseGameState(gamestate);
    setGameIdDone(true);
    // we got a gamestate, we're ready!

    // cache the gamestate
    cookie.save('player_id', gamestate.player_id);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AMONG US</h1>
        <p>Game: {gameID} Name: {playerName} PlayerID: {playerID}</p>
        <AppState 
          serverConnected={serverConnected}
          availableGames={availableGames}
          gameID={gameID} setGameID={setGameID} gameIdDone={gameIdDone} setGameIdDone={setGameIdDone}
          playerName={playerName} setPlayerName={setPlayerName}

          message={message}
          sendMessage={(msg) => sendMessage(msg, playerID)}

          gamestate={gamestate}
        />
      </header>
    </div>
  );
}

function AppState(props) {
  if (!props.serverConnected) {
    return <p>The game server is not up, please refresh or contact the game host.</p>
  }
  if (!props.gameIdDone) {
    return <CreateOrJoinGame 
      sendCreateGame={() => props.sendMessage({type: MessageTypes.create_game, game_id: props.gameID})} 
      sendJoinGame={() => props.sendMessage({type: MessageTypes.join_game, game_id: props.gameID})}
      heartbeat={() => props.sendMessage({type: MessageTypes.heartbeat})}
      {...props}
    />
  }
  if (props.gamestate.status === GameStatus.lobby) {
    return <Lobby 
      sendName={() => props.sendMessage({type: MessageTypes.set_player_name, player_name: props.playerName})}
      sendStartGame={() => props.sendMessage({type: MessageTypes.start_game})}
      leaveGame={() => {
        props.setGameIdDone(false);
        props.sendMessage({type: MessageTypes.leave_game})
      }}
      {...props}
    />
  }
  if (props.gamestate.status === GameStatus.playing) {
    return <PlayGame 
      sendSabotage={() => props.sendMessage({type: MessageTypes.sabotage})}
      sendKill={() => props.sendMessage({type: MessageTypes.kill})}
      sendTaskComplete={(taskID) => props.sendMessage({type: MessageTypes.complete_task, id: taskID})}
      sendEndGame={() => props.sendMessage({type: MessageTypes.end_game})}
      {...props}
    />;
  }
  if (props.gamestate.status === GameStatus.sabotaged) {
    return <Sabotaged
      sendFixSabotage={() => props.sendMessage({type: MessageTypes.fix_sabotage})}
      {...props}
    />
  }
  if (props.gamestate.status === GameStatus.game_over) {
    return <GameOver 
      sendPlayAgain={() => props.sendMessage({type: MessageTypes.play_again})}
      {...props}
    />
  }
  
  return <p>Invalid gamestate</p>
}

function CreateOrJoinGame(props) {
  return <div>
    <div>
      <p>Game ID:</p> 
      <input value={props.gameID} onChange={(e) => props.setGameID(e.target.value.replace(/\s/g, ''))}/>
    </div>
    <div><button onClick={props.sendCreateGame}>Create Game</button></div>
    <div><button onClick={props.sendJoinGame}>Join Game</button></div>
    <p>{props.message}</p>
    <p>Games:</p>
    <ul>
      {props.availableGames.map((g) => {return <li key={g}>{g}</li>})}
    </ul>
  </div>
}

function Lobby(props) {
  return <div>
    Name: 
    <input value={props.playerName} onChange={(e) => props.setPlayerName(e.target.value.replace(/\s/g, ''))}/>
    <button onClick={props.sendName}>Submit</button>
    <p>{props.message}</p>
    <p>{props.gamestate.num_players} connected</p>
    <div>
      {props.gamestate.players.map((p) =>  {return <div key={p.player_id}>{p.player_name}</div>})}
    </div>
    {props.gamestate.is_admin ? 
      <button onClick={props.sendStartGame}>Start Game</button>
      : null
    }
    <button onClick={props.leaveGame}>Go Back</button>
  </div>
}

function PlayGame(props) {
  const gs = props.gamestate;
  return <div>
    <p>{gs.is_imposter ? 'Imposter' : 'Crewmate'}</p>
    <p>{gs.is_imposter ? 'Fake ' : null}Tasks</p>
    <Imposter {...props}/>
    {gs.is_sabotaged ? <h2>SABOTAGED!!</h2> : null}
    <p>{gs.message}</p>
    {gs.is_sabotaged 
      ? null 
      : <ul className='tasklist'>
        {gs.visible_tasks.map((task) => {
          return <Task 
            key={task.id}
            complete={() => props.sendTaskComplete(task.id)}
            {...task}
          />
        })}
      </ul>
    }
    {gs.is_admin 
      ? <button onClick={() => props.sendEndGame()}>End Game (Admin)</button>
      : null
    }
  </div>
}

function Imposter(props) {
  const gs = props.gamestate;
  if (!gs.is_imposter) return null;
  return <div>
    <button onClick={props.sendSabotage} disabled={gs.sabotage_timer !== 0}>
      Sabotage {gs.sabotage_timer !== 0 ? <>({gs.sabotage_timer})</> : null }
    </button>
    <button onClick={props.sendKill} disabled={gs.kill_timer !== 0}>
      Kill {gs.kill_timer !== 0 ? <>({gs.kill_timer})</> : null }
    </button>
    <p>Sabotages: {gs.sabotage_count}</p>
    <p>Kills: {gs.kill_count}</p>
  </div>
}

function Task(props) {
  console.log('displaying task:', props);

  return (
    <li className='task'>
      <p>
        {props.title}
        {props.completed ? 
          '        Done' :
          <button onClick={() => props.complete()} className='task-button'>
            Complete
          </button> 
        }
      </p>
      <p>
        {props.rules}
      </p>
    </li>
  );
}

function GameOver(props) {
  return <div>
    <h2>Game Over</h2>
    <div>{props.gamestate.winner} won</div>
    <div><button onClick={props.sendPlayAgain}>Play Again</button></div>
    <div><button onClick={props.sendNewGame}>New Game</button></div>
  </div>
}

function Sabotaged(props) {
  return <div>
    <h2>Sabotaged!</h2>
    <Imposter {...props}/>
    <div><button onClick={props.sendFixSabotage}>Fix Sabotage</button></div>
  </div>
}

export default App;
