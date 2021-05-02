import './App.css';
import {useState} from 'react'
import cookie from 'react-cookies'

var W3CWebSocket = require('websocket').w3cwebsocket;

var client = new W3CWebSocket('ws://localhost:3030/', 'echo-protocol');

client.onerror = function() {
    console.log('Connection Error');
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

function App() {
  const [isReady, setIsReady] = useState(false)
  const [name, setName] = useState('')
  const [nameDone, setNameDone] = useState(false)
  const [isImposter, setIsImposter] = useState(false)
  const [tasks, setTasks] = useState([])
  const [numPlayers, setNumPlayers] = useState(1)
  const [sabotage, setSabotage] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [msg, setMsg] = useState('')
  const [players, setPlayers] = useState([])
  
  var n = cookie.load('name')
  if (n !== undefined) {
    setName(n)
  }

  client.onmessage = function(e) {
    console.log('recieved gamestate', e)
    var gamestate = JSON.parse(e.data).gamestate
    console.log(gamestate)
    setIsImposter(gamestate.isImposter)
    console.log('set tasks to:', gamestate.tasks)
    setTasks(gamestate.tasks)
    
    setIsStarted(gamestate.isStarted)
    setNumPlayers(gamestate.numPlayers)
    setSabotage(gamestate.sabotage)
    setMsg(gamestate.msg)

    setPlayers(gamestate.players)
  }

  client.onopen = function() {
    console.log('WebSocket Client Connected');
    setIsReady(true)
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AMONG US</h1>
        {isReady ? <>
          {!nameDone ?
            <SetName name={name} setName={setName} submit={() => {
              cookie.save('name', name, { path: '/' })
              client.send(JSON.stringify({type:'name', name:name}))
              setNameDone(true)
            }}/> :
            <>
              <StartGame 
                numPlayers={numPlayers} 
                isStarted={isStarted}
                startGame={() => {
                  client.send(JSON.stringify({type:'start'}))
                }}
                name={name}
                players={players}
                msg={msg}
              />
              <GameState 
                isStarted={isStarted}
                isImposter={isImposter}
                tasks={tasks}
                sabotage={sabotage}
                name={name}
                msg={msg}
                endgame={() => client.send(JSON.stringify({type:'end'}))}
              />
            </>
          } </>
          : <p>Loading</p>
        }
      </header>
    </div>
  );
}

function SetName(props) {
  return(
    <p>
      Name: <input value={props.name} onChange={(e) => props.setName(e.target.value.replace(/\s/g, ''))}/>
      <button onClick={() => props.submit()}>Submit</button>
    </p>
  )
}
function StartGame(props) {
  if (!props.isStarted) { 
    return (
      <div>
        <p>{props.msg}</p>
        <p>{props.numPlayers} connected</p>
        <div>
          {props.players.map((p) =>  {return <div key={p}>{p}</div>})}
        </div>
        {props.name === 'jack' ? 
          <button onClick={() => props.startGame()}>Start Game</button>
          : null
        }
      </div>
    )
  }
  return null
}

function GameState(props) {
  if (!props.isStarted) {
    return null
  }
  return(
    <div>
      <p>{props.isImposter ? 'Imposter' : 'Crewmate'}</p>
      <p>{props.isImposter ? 'Fake ' : null}Tasks</p>
      {props.isImposter ? 
        <>
        <button onClick={() => client.send(JSON.stringify({type:'sabotage'}))}>Sabotage</button>
        <button onClick={() => client.send(JSON.stringify({type:'kill'}))}>Kill</button>
        </>
        : null
      }
      <p>{props.msg}</p>
      <ul className='tasklist'>
        {props.tasks.map((task) => {
          return(
            <Task 
              key={task.id} 
              task={task} 
              complete={() => client.send(JSON.stringify({type: 'complete', id : task.id, name : props.name}))}
            />
          );
        })}
      </ul>
      {props.name === 'jack' ? 
        <button onClick={() => props.endgame()}>End Game</button>
        : null
      }
    </div>
  );
}

function Task(props) {
  console.log('displaying task:', props)
  if (!props.task.isShown) {
    return null
  }
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
  )
}
export default App;
