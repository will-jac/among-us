// const app = require('express')();
// const cors = require('cors')
var WebSocketServer = require('websocket').server;

const tasks = [
  { 
    id : 0,
    title : 'Cup pong',
    rules : 'Shoot a ping pong into a cup from across the room (Dining Room)'
  },
  {
    id : 1,
    title : 'Shot',
    rules : 'Do a shot (Basement)'
  },
  {
    id : 2,
    title : 'Balloon Blow',
    rules : 'blow solo cups off the table with a balloon (Living Room)'
  },
  // {
  //   id : 3,
  //   title : 'Card Organize',
  //   rules : 'Shuffle then organize a deck of cards into suits (Jack\'s Room)'
  // },
  // {
  //   id : 4,
  //   title : 'Porch Pirate',
  //   rules : 'Take a dish from Yaseen\'s room to the kitchen'
  // },
  {
    id : 5,
    title : 'Dish Run',
    rules : 'Take a dish from Yaseen\'s room to the kitchen'
  },
  {
    id : 6,
    title : 'Dish Run (reverse)',
    rules : 'Take a dish from the kithen to Yaseen\'s room'
  },
  // {
  //   id : 7,
  //   title : 'Ball Lap',
  //   rules : '3 lap ball race in the basement!!'
  // },
  {
    id : 8,
    title : 'Seltzer Straw',
    rules : 'Drink a small glass of seltzer (or anything, like water, lacroix, or beer) through a straw (kitchen)'
  },
  {
    id : 9,
    title : 'Bottle Bowl',
    rules : 'Set up the bottles and bowl the soccer ball (Noah\'s room)'
  },
//  {
//    id : 10,
//    title : 'Penis Playdough',
//    rules : 'Create a penis of playdough in Will\'s Room'
//  },
  {
    id : 11,
    title : 'Shoot Bob Ross',
    rules : 'shoot Bob Ross in the dick with the blowgun (basement)'
  },
  { 
    id : 12,
    title : 'Pipe Cleaners',
    rules : 'make a dick out of pipe cleaners (Will\'s room)'
  },
  { 
    id : 13,
    title : 'Laser Gun (front porch)',
    rules : 'Shoot the laser gun at the target (front porch)'
  },
  { 
    id : 14,
    title : 'Laser Gun (back porch)',
    rules : 'Shoot the laser gun at the target (back porch)'
  },
  { 
    id : 15,
    title : 'Water',
    rules : 'Drink some water'
  },
]

var players = {
  imposter : null,
  crewmates : [],
  all_players : {},
}

const num_tasks = 5
const num_tasks_shown = 2
const sabotage_cooldown = 30 * 1000
const kill_cooldown = 30 * 1000

var started = false
var sabotage = false
var can_sabotage = true
var can_kill = true

var sabotage_counter = 0 
var kill_counter = 0 

var left_game = []

var GameOver = false

const server = require('http').createServer((req, resp) => {
  // console.log('recv request', req)
  setTimeout(() => {
    can_sabotage = true
  }, sabotage_cooldown)
  sabotage_counter = Math.floor(sabotage_cooldown / 1000)
  setTimeout(sabotage_countdown, 1000)
  sabotage = false

  update_all_players()

  resp.write('sabotage stopped!\n')
  resp.end()
});
server.listen(3030, () => {
  console.log('server listening on 3030')
})
wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
})
function sabotage_countdown() {
  sabotage_counter -= 1
  update_imp()
  if (sabotage_counter !== 0) {
    setTimeout(sabotage_countdown, 1000)
  }
}
function kill_countdown() {
  kill_counter -= 1
  update_imp()
  if (kill_counter !== 0) {
    setTimeout(kill_countdown, 1000)
  }
}
function getRandomSubarray(arr, size) {
  var shuffled = arr.slice(0), i = arr.length, temp, index;
  while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}
function update_imp() {
  var p = players.all_players[players.imposter]
  var s = 'Can Sabotage'
  var k = ' : Can Kill'
  if (sabotage && sabotage_counter == 0) {
    s = 'Sabotaged! Wait for fix'
  } else if (!can_sabotage) {
    s = 'Sabotage in ' + sabotage_counter + ' s'
  }
  if (!can_kill) {
    k = ' : Kill in ' + kill_counter + ' s'
  }
  if (GameOver) {
    s = 'GAME OVER! NO TASKS REMAIN!!'
    k = ''
  }
  p.conn.sendUTF(JSON.stringify({
    gamestate: {
      isStarted : started,
      isImposter : p.isImposter,
      tasks : p.tasks,
      numPlayers : Object.keys(players.all_players).length,
      sabotage : sabotage,
      msg : s + k,
      players : Object.keys(players.all_players)
    }
  }));
}
function update_all_players() {
  if (started) {
    update_imp()
    players.crewmates.forEach(k => {
      console.log('crew:', k)
      var p = players.all_players[k]
      var s = sabotage ? 'Sabotaged! Fix at Jack\'s computer to complete a task' : null
      if (GameOver) {
        s = 'GAME OVER! NO TASKS REMAIN!!'
      }
      p.conn.sendUTF(JSON.stringify({
        gamestate: {
          isStarted : started,
          isImposter : p.isImposter,
          tasks : p.tasks,
          numPlayers : Object.keys(players.all_players).length,
          sabotage : sabotage,
          msg : s,
          players : Object.keys(players.all_players)
        }
      }));
    }); 
  } else {
    for (k in players.all_players) {
      var p = players.all_players[k]
      p.conn.sendUTF(JSON.stringify({
        gamestate: {
          isStarted : started,
          isImposter : p.isImposter,
          tasks : p.tasks,
          numPlayers : Object.keys(players.all_players).length,
          sabotage : sabotage,
          sabotage_cooldown : sabotage_cooldown,
          kill_cooldown : kill_cooldown,
          players : Object.keys(players.all_players)
        }
      }));
    }
  }
}

wsServer.on('request', function(request) {
  
  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      // console.log(message.utf8Data)
      var msg = JSON.parse(message.utf8Data)
      // console.log(msg)
      if (msg.type === 'start') {
        // resolve any that left
        left_game.forEach((n) => {
          delete players.all_players[n]
        });

        started = true
        // assign an imposter and crewmates
        var i = Math.floor(Math.random() * Object.keys(players.all_players).length)
        names = Object.keys(players.all_players)
        players.imposter = names[i]
        // console.log('imposter is:', players.imposter)
        players.crewmates = names.slice(0,i).concat(names.slice(i+1,names.length))
        console.log('crewmates:', players.crewmates)
        players.all_players[players.imposter].isImposter = true

        // give tasks
        for (k in players.all_players) {
          // deep clone of the task array
          players.all_players[k].tasks = 
              JSON.parse(JSON.stringify(getRandomSubarray(tasks, num_tasks)))
          var i = 0
          for (t in players.all_players[k].tasks) {
            players.all_players[k].tasks[t].isComplete = false
            players.all_players[k].tasks[t].isShown = i < num_tasks_shown
            i += 1
          }
        }
      }
      else if (msg.type === 'end') {
        started = false
        sabotage = false
        GameOver = false
        can_sabotage = true
        can_kill = true
        sabotage_counter = 0
        kill_counter = 0

        players.imposter = null
        players.crewmates = []

        for (p in players.all_players) {
          players.all_players[p].isImposter = false
          players.all_players[p].tasks = []
        }

        // resolve any that left
        left_game.forEach((n) => {
          delete players.all_players[n]
        });
      }
      else if (msg.type === 'name') {
        if (started && !(msg.name in players.all_players)) {
          connection.sendUTF(JSON.stringify({
            gamestate: {
              isStarted : false,
              isImposter : false,
              tasks : [],
              numPlayers : Object.keys(players.all_players).length,
              sabotage : false,
              msg : 'Game in progress! If you left by accident, refresh and enter the exact name from before',
              players : Object.keys(players.all_players)
            }
          }));
        } else {       
          // assumed to be a name!
          console.log('new user with name:', msg.name)
          // rejoining the game
          if (msg.name in players.all_players) {
            players.all_players[msg.name].conn = connection
            // remove from left_game
            const index = left_game.indexOf(msg.name);
            if (index > -1) {
              left_game.splice(index, 1);
            }
          }
          else {
            players.all_players[msg.name] = {
              conn : connection,
              isImposter : false,
              tasks : []
            }
          } 
        }
      }
      else if (msg.type === 'complete') {
        if (sabotage) {
          // cannot do anything during sabotage
          return
        }
        var set_new_task_shown = false
        for (t in players.all_players[msg.name].tasks) {
          console.log(t)
          if (msg.id === players.all_players[msg.name].tasks[t].id) {
            console.log('setting task to complete:', msg.name, msg.id)
            players.all_players[msg.name].tasks[t].isComplete = true
            players.all_players[msg.name].tasks[t].isShown = false
            
          }
          if (!set_new_task_shown 
            && !players.all_players[msg.name].tasks[t].isComplete
            && !players.all_players[msg.name].tasks[t].isShown) {
              players.all_players[msg.name].tasks[t].isShown = true
              set_new_task_shown = true
          }
        }
        var gameOver = true
        players.crewmates.forEach((c) => {
          players.all_players[c].tasks.forEach((t) => {
            if (!t.isComplete) {
              gameOver = false
            }
          })
        })

        if (gameOver) {
          GameOver = true
          update_all_players()
        }
      }
      else if (msg.type === 'sabotage') {
        if (can_sabotage) {
          sabotage = true
          can_sabotage = false
        }
      }
      else if (msg.type === 'kill') {
        if (can_kill) {
          can_kill = false
          setTimeout(() => {
            can_kill = true
          }, kill_cooldown)
          kill_counter = Math.floor(kill_cooldown / 1000)
          setTimeout(kill_countdown, 1000)
        }
      }

      // general sending thing
      update_all_players()
    }
    else {
      console.log(message.type)
    }
  });

  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
      var name = ''
      for (k in players.all_players) {
        if (connection === players.all_players[k].conn) {
          name = k
        }
      }
      
      left_game.push(name)
  });

  // send the game state to everyone now that a new person has joined
  update_all_players()

});