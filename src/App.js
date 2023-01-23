import './App.css';
import {useState, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
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
  settings: 'settings',
  delete_game: 'delete',
  ack: 'ack',
}

const GameStatus = {
  lobby: 'lobby',
  playing: 'playing',
  sabotaged: 'sabotaged',
  emergency_meeting: 'emergency_meeting',
  kill_meeting: 'kill_meeting',
  game_over: 'game_over',
}

const W3CWebSocket = require('websocket').w3cwebsocket;

const client = new W3CWebSocket('ws://localhost:9030/', 'echo-protocol');

client.onerror = function() {
  console.log('Connection Error');
};

const sendMessage = function(msg, playerID) {
  // console.log('sending message:', msg, playerID);
  // add metadata and unpack the message
  client.send(JSON.stringify({
    player_id: playerID,
    ...msg
  }));
};

const useCookie = true;

function App() {
  const [playGame, setPlayGame] = useState(false);
  const [editGame, setEditGame] = useState(false);

  const [serverConnected, setServerConnected] = useState(false);
  const [availableGames, setAvailableGames] = useState([]);
  const [gameID, setGameID] = useState('');
  const [playerID, setPlayerID] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameIdDone, setGameIdDone] = useState(false);
  const [gamestate, setGamestate] = useState({});
  const [settings, setSettings] = useState({});
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
    // don't overwrite the player's name!!!
    // setPlayerName(gamestate.player_name);

    setGamestate(gamestate);
    setSettings(gamestate.settings);
  };

  client.onopen = function() {
    console.log('WebSocket Client Connected');
    setServerConnected(true);
    // send a hearbeat
    sendMessage({type:MessageTypes.heartbeat}, playerID);
  }; 

  client.onclose = function() {
    console.log('echo-protocol Client Closed');
  };

  client.onmessage = function(msg) {
    
    let data = JSON.parse(msg.data)
    // console.log('message', data);
    // server is ready for us
    if (data.type === 'init') {
      setAvailableGames(data.available_games);
      setGameIdDone(false);

      // if we don't have a player id yet, accept the server's
      if (playerID === '') {
        let p_id = cookie.load('player_id')
        if ((!useCookie) || (p_id === null || p_id === undefined || p_id === '' || p_id === 'undefined' || p_id === 'null')) {
          // auto-triggers a heartbeat
          console.log('accepting pid from server', data.player_id);
          setPlayerID(data.player_id);
        }
        else {
          // otherwise, use the one in the cookie and request a gamestate
          // auto-triggers a heartbeat
          console.log('accepting pid from cookie', p_id);
          setPlayerID(p_id);
        }
      }
      return;
    }
    // not part of gamestate
    let message = data.message;
    console.log('msg:',message);
    setMessage(message); 

    let gamestate = data.gamestate;
    console.log('gamestate:',gamestate);
    parseGameState(gamestate);
    setGameIdDone(true);
    // we got a gamestate, we're ready!

    // cache the gamestate
    cookie.save('player_id', gamestate.player_id);

    // send a response - this will keep the connection alive
    sendMessage({type: MessageTypes.ack}, playerID);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AMONG US</h1>
        <p>Game: {gameID} Name: {playerName} PlayerID: {playerID}</p>
        <AppState 
          playGame={playGame} setPlayGame={setPlayGame} editGame={editGame} setEditGame={setEditGame}
          serverConnected={serverConnected}
          availableGames={availableGames}
          gameID={gameID} setGameID={setGameID} gameIdDone={gameIdDone} setGameIdDone={setGameIdDone}
          playerName={playerName} setPlayerName={setPlayerName}

          message={message}
          sendMessage={(msg) => sendMessage(msg, playerID)}

          gamestate={gamestate}
          settings={settings} setSettings={setSettings}
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
      sendJoinGame={(game_id) => props.sendMessage({type: MessageTypes.join_game, game_id: game_id})}
      heartbeat={() => props.sendMessage({type: MessageTypes.heartbeat})}
      {...props}
    />
  }
  if (props.gamestate.status === GameStatus.lobby) {
    if (props.editGame) {
      return <GameEditor 
        {...props}
      />
    } 

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
    <table className="gameJoinTable">
      <tr>
        {/* <td>Game ID:</td> */}
        <td>
          <input className="taskInput" value={props.gameID} onChange={(e) => props.setGameID(e.target.value)}/>
        </td>
        <td>
         <button onClick={props.sendCreateGame}>Create Game</button>
        </td>
      </tr>
    </table>
    <p>{props.message}</p>
    <p>Games:</p>
    <table className="gameJoinTable">
      {props.availableGames.map((g) => {
        return <tr key={g}>
          <td>{g}</td>
          <td>
            <button onClick={() => props.sendJoinGame(g)}>Join</button>
          </td>
        </tr>
      })}
    </table>
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
    <button onClick={() => props.setEditGame(true)}>Edit Game Settings</button>
    {props.gamestate.is_admin ? 
      <button onClick={props.sendStartGame}>Start Game</button>
      : null
    }
    <button onClick={props.leaveGame}>Go Back</button>
  </div>
}

function GameEditor(props) {
  const [shouldSend, setShouldSend] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const [editingTask, setEditingTask] = useState({editing: false, difficulty: 'easy', index: -1});

  const {sendMessage, settings, setSettings} = props;

  // update at most every second
  useEffect(() => {
    if (canSend && shouldSend) {
      setCanSend(false);
      setShouldSend(false);
      sendMessage({type: MessageTypes.settings, settings: settings});
    }
    setTimeout(() => setCanSend(true), 500);
  }, [settings, sendMessage, canSend, shouldSend])

  if (editingTask.editing) {
    return <TaskEditor
      index={editingTask.index}
      task={settings.possible_tasks[editingTask.difficulty][editingTask.index]}
      setDone={() => setEditingTask({...editingTask, editing: false})}
      setTask={(index, id, title, rules) => {
        setShouldSend(true);
        let tasks = settings.possible_tasks;
        tasks[editingTask.difficulty][index] = { id: id, title: title, rules: rules };
        setSettings({...settings, possible_tasks: tasks});
      }}
      const deleteTask={() => {
        setShouldSend(true);
        let tasks = settings.possible_tasks;
        tasks[editingTask.difficulty].splice(editingTask.index, 1);
        setSettings({...settings, possible_tasks: tasks});
        // delete = done
        setEditingTask({...editingTask, editing: false});
      }}
    />
  }

  return <div className='taskEditor'>
    <table className='gameEditorTable'>
      <SettingEditor settings={settings} setSettings={setSettings} setShouldSend={setShouldSend}
        description="Number of Imposters" setting_name="num_imposters" type="number"
      />
      <SettingEditor settings={settings} setSettings={setSettings} setShouldSend={setShouldSend}
        description="Kill Cooldown" setting_name="kill_cooldown" type="number"
      />
      <SettingEditor settings={settings} setSettings={setSettings} setShouldSend={setShouldSend}
        description="Sabotage Allowed" setting_name="sabotage_allowed" type="checkbox"
      />
      <SettingEditor settings={settings} setSettings={setSettings} setShouldSend={setShouldSend}
        description="Sabotage Cooldown" setting_name="sabotage_cooldown" type="number"
      />
      <TaskListEditor settings={settings} setSettings={setSettings} setShouldSend={setShouldSend} setEditingTask={setEditingTask} difficulty={'easy'}/>
      <TaskListEditor settings={settings} setSettings={setSettings} setShouldSend={setShouldSend} setEditingTask={setEditingTask} difficulty={'medium'}/>
      <TaskListEditor settings={settings} setSettings={setSettings} setShouldSend={setShouldSend} setEditingTask={setEditingTask} difficulty={'hard'}/>
      <tr>
        <td>
          {props.gamestate.is_admin 
            ? <button onClick={() => {
              sendMessage({type: MessageTypes.delete_game}, props.playerID);
            }}>Delete Game</button>
            : null
          }
        </td>
        <td>
          <button onClick={() => props.setEditGame(false)}>Go Back</button>  
        </td>
      </tr>
    </table>
  </div>
}

function SettingEditor(props) {
  const {setting_name, description, settings, setSettings, setShouldSend, type} = props
  return <tr>
    <td>{description}</td>
    <td>
      <input value={settings[setting_name]} type={type}
        onChange={(e) => {
          setShouldSend(true);
          let s = settings;
          s[setting_name] = (type === 'checkbox') ? e.target.checked : e.target.value;
          setSettings(s);
        }} 
      />
    </td>
  </tr>
}

function TaskListEditor(props) {
  const {difficulty, settings, setSettings, setShouldSend, setEditingTask} = props
  
  const addTask = () => {
    setShouldSend(true);
    let tasks = settings.possible_tasks;
    tasks[difficulty].push({ id: uuidv4(), title: '', rules: '' });
    setSettings({...settings, possible_tasks: tasks});
  }

  return <>
    <tr>
      <th>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} tasks:</th>
      <td>
        <input 
          value={settings.num_tasks[difficulty]} type='number'
          onChange={(e) => {
            setShouldSend(true);
            let num_tasks = settings.num_tasks;
            num_tasks[difficulty] = e.target.value
            setSettings({...settings, num_tasks: num_tasks});
          }} 
        />
      </td>
    </tr>
    <tr>
      <td colSpan='2'>
        <table className="gameEditorTable">
          <tr>
            <th>Title</th><th>Rules</th><th></th>
          </tr>
        {settings.possible_tasks[difficulty].map((t, index) => {
          return <tr key={t.id}>
            <td>{t.title}
              {/* <input className="taskInput" value={t.title} onChange={(e) => {setTasks(index, t.id, e.target.value, t.rules)}} /> */}
            </td>
            <td>{t.rules}
              {/* <input className="taskInput" value={t.rules} onChange={(e) => {setTasks(index, t.id, t.title, e.target.value)}} /> */}
            </td>
            <td>
              <button onClick={() => setEditingTask({editing:true, difficulty: difficulty, index: index})}>Edit Task</button>
            </td>
          </tr>
        })}
        </table>
      </td>
    </tr>
    <tr colSpan='2' className='centerButton'>
      <button className="centerButton" onClick={() => addTask()}>Add {difficulty} Task</button>
    </tr>
  </>
}

function TaskEditor(props) {
  const {index, task, setTask, deleteTask, setDone} = props;
  const [title, setTitle] = useState(task.title);
  const [rules, setRules] = useState(task.title);

return <div>
    <h3>Title:</h3>
    <div>
      <input className="taskInput" value={title} onChange={(e) => setTitle(e.target.value)} />
    </div>
    <h3>Description:</h3>
    <div>
      <textarea className="taskInput" value={rules} onChange={(e) => setRules(e.target.value)} />
    </div>
    <table className="gameEditorTable">
      <tr>
        <th>
          <button onClick={deleteTask}>Delete Task</button>
        </th>
        <th>
          <button onClick={() => {
            // send the task to the server
            setTask(index, task.id, title, rules);
            setDone();
          }}>Done</button>
        </th>
      </tr>
    </table>
  </div>
}

function PlayGame(props) {
  const gs = props.gamestate;
  return <div>
    <p>{gs.is_imposter ? 'Imposter' : 'Crewmate'}</p>
    <p>{gs.is_imposter ? 'Fake ' : null}Tasks</p>
    <Imposter {...props}/>
    <p>{gs.message}</p>
    <ul className='tasklist'>
      {gs.visible_tasks.map((task) => {
        return <Task 
          key={task.id}
          complete={() => props.sendTaskComplete(task.id)}
          {...task}
        />
      })}
    </ul>
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
    {gs.sabotage_allowed 
      ? <button onClick={props.sendSabotage} disabled={gs.sabotage_timer !== 0}>
          Sabotage {gs.sabotage_timer !== 0 ? <>({gs.sabotage_timer})</> : null }
        </button>
      : null
    }
    <button onClick={props.sendKill} disabled={gs.kill_timer !== 0}>
      Kill {gs.kill_timer !== 0 ? <>({gs.kill_timer})</> : null }
    </button>
    {gs.sabotage_allowed ? <p>Sabotages: {gs.sabotage_count}</p> : null}
    <p>Kills: {gs.kill_count}</p>
  </div>
}

function Task(props) {

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
