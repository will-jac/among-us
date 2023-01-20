import './App.css';
import {useState} from 'react'
import cookie from 'react-cookies'

const MessageTypes = {
  create: 'create',
  join: 'join',
  start: 'start',
  end: 'end', // end game
  name: 'name', // set name
  sabotage: 'sabotage',
  kill: 'kill',
  complete: 'complete', // task complete
}

var W3CWebSocket = require('websocket').w3cwebsocket;

var client = new W3CWebSocket('ws://localhost:3030/', 'echo-protocol');

client.onerror = function() {
    console.log('Connection Error');
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

function App() {
  const [gameID, setGameID] = useState('');
  const [name, setName] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isImposter, setIsImposter] = useState(false);
  const [nameDone, setNameDone] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [numPlayers, setNumPlayers] = useState(1);
  const [isSabotaged, setIsSabotaged] = useState(false);
  const [sabotageTimer, setSabotageTimer] = useState(0);
  const [killTimer, setKillTimer] = useState(0);
  const [message, setMessage] = useState('');
  const [players, setPlayers] = useState([]);
  
  const parseGameState = function(gamestate) {
    if (gamestate === undefined || gamestate === null) return;

    setGameID(gamestate.gameID);
    setIsStarted(gamestate.isStarted);
    setIsSabotaged(gamestate.isSabotaged);

    setIsImposter(gamestate.isImposter);
    setIsAdmin(gamestate.isAdmin);
    setName(gamestate.Name);
    setNameDone(gamestate.Name !== '' && gamestate.Name !== undefined && gamestate.Name !== null);
    setTasks(gamestate.tasks);
    setPlayers(gamestate.players);
    setNumPlayers(gamestate.numPlayers);
    
    setSabotageTimer(gamestate.sabotageTimer);
    setKillTimer(gamestate.killTimer);
  };

  const sendMessage = function(msg) {
    // add metadata and unpack the message
    client.send(JSON.stringify({
      name: name, 
      gameID: gameID,
      ...msg
    }));
    if (msg.type === MessageTypes.name) {
      setNameDone(true);
    }
  };

  // on load, try to restore the gamestate from the cookie
  parseGameState(cookie.load('gamestate'));
  
  client.onopen = function() {
    console.log('WebSocket Client Connected');
    setIsReady(true);
  }; 

  client.onmessage = function(msg) {
    console.log('recieved gamestate', msg);
    
    // not part of gamestate
    var message = JSON.parse(msg.data).message;
    setMessage(message); 

    var gamestate = JSON.parse(msg.data).gamestate;
    parseGameState(gamestate);
    // we got a gamestate, we're ready!
    setIsReady(gamestate.isReady);

    // cache the gamestate
    cookie.save('gamestate', gamestate);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AMONG US</h1>
        <AppState 
          isReady={isReady} isStarted={isStarted} isSabotaged={isSabotaged}
          isImposter={isImposter} isAdmin={isAdmin}
          name={name} setName={setName} nameDone={nameDone}
          players={players} numPlayers={numPlayers}
          sabotageTimer={sabotageTimer} killTimer={killTimer}
          tasks={tasks}
          msg={message}
          sendMessage={sendMessage}
        />
      </header>
    </div>
  );
}

function AppState(props) {
  if (!props.isReady) {
    return <CreateOrJoinGame 
      msg={props.msg} gameID={props.gameID}
      sendCreateGame={() => props.sendMessage({type: MessageTypes.create})} sendJoinGame={() => props.sendMessage({type: MessageTypes.join})}
    />
  }
  if (!props.nameDone) {
    return <SetName 
      msg={props.msg} name={props.name} setName={props.setName}
      sendName={() => props.sendMessage({type: MessageTypes.name})}
    />
  }
  if (!props.isStarted) {
    return <StartGame 
      msg={props.msg} numPlayers={props.numPlayers} players={props.players} isAdmin={props.isAdmin} 
      startGame={() => props.sendMessage({type: MessageTypes.start})}
    />
  }
  return <GameState 
    // isStarted={props.isStarted} isSabotaged={props.isSabotaged}
    // isImposter={props.isImposter} isAdmin={props.isAdmin} name={props.name}
    // sabotageTimer={props.sabotageTimer} killTimer={props.killTimer}
    // tasks={props.tasks}
    // msg={props.msg}
    sendSabotage={() => props.sendMessage({type: MessageTypes.sabotage})}
    sendKill={() => props.sendMessage({type: MessageTypes.kill})}
    sendTaskComplete={(taskID) => props.sendMessage({type: MessageTypes.complete, taskID: taskID})}
    sendEndGame={() => props.sendMessage({type: MessageTypes.end})}
    {...props}
  />;
}

function CreateOrJoinGame(props) {
  // TODO: show a list of games in progress
  return <div>
    <div>
      Game ID: 
      <input value={props.gameID} onChange={(e) => props.setGameID(e.target.value.replace(/\s/g, ''))}/>
    </div>
    <div><button onClick={props.createGame}>Create Game</button></div>
    <div><button onClick={props.joinGame}>Join Game</button></div>
    <p>{props.msg}</p>
  </div>
}

function SetName(props) {
  return <p>
    Name: 
    <input value={props.name} onChange={(e) => props.setName(e.target.value.replace(/\s/g, ''))}/>
    <button onClick={props.sendName}>Submit</button>
  </p>
}

function StartGame(props) {
  return <div>
    <p>{props.msg}</p>
    <p>{props.numPlayers} connected</p>
    <div>
      {props.players.map((p) =>  {return <div key={p}>{p}</div>})}
    </div>
    {props.admin ? 
      <button onClick={props.startGame}>Start Game</button>
      : null
    }
  </div>
}

function GameState(props) {
  return <div>
    <p>{props.isImposter ? 'Imposter' : 'Crewmate'}</p>
    <p>{props.isImposter ? 'Fake ' : null}Tasks</p>
    {props.isImposter ? 
      <>
        <button onClick={props.sendSabotage} disabled={props.sabotageTimer !== 0}>
          Sabotage {props.sabotageTimer !== 0 ? <>({Math.floor(props.sabotageTimer / 1000)})</> : null }
        </button>
        <button onClick={props.sendKill} disabled={props.killTimer !== 0}>
          Kill {props.killTimer !== 0 ? <>({Math.floor(props.killTimer / 1000)})</> : null }
        </button>
      </>
      : null
    }
    {props.isSabotaged ? <h2>SABOTAGED!!</h2> : null}
    <p>{props.msg}</p>
    {props.isSabotaged 
      ? null 
      : <ul className='tasklist'>
        {props.tasks.map((task) => {
          return <Task 
            key={task.id} 
            task={task} 
            complete={() => props.sendTaskComplete(task.id)}
          />
        })}
      </ul>
    }
    {props.isAdmin 
      ? <button onClick={() => props.endGame()}>End Game (Admin)</button>
      : null
    }
  </div>
}

function Task(props) {
  console.log('displaying task:', props);
  if (!props.task.isShown) return null;

  return (
    <li className='task'>
      <p>
        {props.task.title}
        {props.task.isComplete ? 
          '        Done' :
          <button onClick={() => props.complete()} className='task-button'>
            Complete
          </button> 
        }
      </p>
      <p>
        {props.task.rules}
      </p>
    </li>
  );
}

export default App;
