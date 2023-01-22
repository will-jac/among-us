// const app = require('express')();
// const cors = require('cors')
var uuidv4 = require('uuid').v4;
var WebSocketServer = require('websocket').server;

// set up the HTTP server (websockets hosts off this as well)
const server = require('http').createServer((req, resp) => {
  // HANDLE SABOTAGE from external site (eg laptop)
  //   console.log('recv request', req)
  
  //   // setup the gamestate
  //   setTimeout(() => {can_sabotage = true}, sabotage_cooldown);
  //   // NOT SURE WHAT THIS DOES
  //   sabotage_counter = Math.floor(sabotage_cooldown / 1000)
  //   setTimeout(sabotage_countdown, 1000)
  //   sabotage = false
  
  //   update_all_players()
  
  //   resp.write('sabotage stopped!\n')
  //   resp.end()
});
  
// init server
server.listen(3030, () => {
  console.log('server listening on port 3030')
});

// init websocket server
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

// default task list
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

const names = shuffle([  
  'Açaí',
  'Akebi',
  'Ackee',
  'African Cherry Orange',
  'American Mayapple',
  'Apple',
  'Apricot',
  'Araza',
  'Avocado',
  'Banana',
  'Bilberry',
  'Blackberry',
  'Blackcurrant',
  'Black sapote',
  'Blueberry',
  'Boysenberry',
  'Breadfruit',
  'Cactus pear',
  'Cashew',
  'Cempedak',
  'Cherry',
  'Chico fruit',
  'Cloudberry',
  'Coconut',
  'Crab apple',
  'Cranberry',
  'Currant',
  'Damson',
  'Date',
  'Dragonfruit',
  'Durian',
  'Elderberry',
  'Feijoa',
  'Fig',
  'Finger Lime',
  'Goji berry',
  'Gooseberry',
  'Grape',
  'Raisin',
  'Grapefruit',
  'Guava',
  'Hala Fruit',
  'Honeyberry',
  'Huckleberry',
  'Jackfruit',
  'Jambul',
  'Japanese plum',
  'Jostaberry',
  'Jujube',
  'Juniper berry',
  'Kaffir Lime',
  'horned melon',
  'Kiwifruit',
  'Kumquat',
  'Lemon',
  'Lime',
  'Loganberry',
  'Longan',
  'Loquat',
  'Lulo',
  'Lychee',
  'Magellan Barberry',
  'Mamey Apple',
  'Mamey Sapote',
  'Mango',
  'Mangosteen',
  'Marionberry',
  'Melon',
  'Cantaloupe',
  'Galia melon',
  'Honeydew',
  'Mouse melon',
  'Musk melon',
  'Watermelon',
  'Miracle fruit',
  'Momordica fruit',
  'Monstera deliciosa',
  'Mulberry',
  'Nance',
  'Nectarine',
  'Orange',
  'Blood orange',
  'Clementine',
  'Mandarine',
  'Tangerine',
  'Papaya',
  'Passionfruit',
  'Pawpaw',
  'Peach',
  'Pear',
  'Persimmon',
  'Plantain',
  'Plum',
  'Prune',
  'Pineapple',
  'Pineberry',
  'Pluot',
  'Pomegranate',
  'Pomelo',
  'Purple mangosteen',
  'Quince',
  'Raspberry',
  'Salmonberry',
  'Rambutan',
  'Redcurrant',
  'Rose apple',
  'Salal berry',
  'Salak',
  'Sapodilla',
  'Sapote',
  'Satsuma',
  'Hawthorn Berry',
  'Soursop',
  'Star apple',
  'Star fruit',
  'Strawberry',
  'Surinam cherry',
  'Tamarillo',
  'Tamarind',
  'Tangelo',
  'Tayberry',
  'Ugli fruit',
  'White currant',
  'White sapote',
  'Ximenia',
  'Yuzu',
  'Bell pepper',
  'Chile pepper',
  'Corn kernel',
  'Cucumber',
  'Eggplant (or Brinjal)',
  'Jalapeño',
  'Olive',
  'Pea',
  'Pumpkin',
  'Squash',
  'Tomato',
  'Zucchini',
])
var next_name_idx = 0;

// map gameID -> gamestate
const games = {}
// map of uuid -> {player}
const players = {}

// map connection -> {gameID, name}
const connections = {}

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

const InitialTaskState = {
  id : 0,
  title : '',
  rules : '',
}

const InitialPlayerState = {
  player_id: '',
  player_name: '',
  game_id: '',
  connection: null,

  is_alive: true,
  //is_admin: false, // calculated on sending - not actually stored!
  //is_imposter: false, // calculated on sending - not actually stored!
  invisible_tasks: [],
  visible_tasks: [],
  all_tasks_complete: false,
  can_emergency_meeting: true,
  // only for imposters
  can_kill: true,  
  kill_count: 0,
  kill_timer: 0,
  sabotage_count: 0,
}

const InitialGameState = {
  // Game Configuration - editable by admin
  num_tasks: {
    easy: 2,
    medium: 2,
    hard: 1,
  },
  num_tasks_shown: 2,
  possible_tasks: {
    easy: [
      {
        id : 1,
        title : 'Shot',
        rules : 'Do a shot (Basement)'
      },
      { 
        id : 0,
        title : 'Cup pong',
        rules : 'Shoot a ping pong into a cup from across the room (Dining Room)'
      },
      { 
        id : 12,
        title : 'Pipe Cleaners',
        rules : 'make a dick out of pipe cleaners (Will\'s room)'
      },
      { 
        id : 15,
        title : 'Water',
        rules : 'Drink some water'
      },
    ],
    medium: [
      {
        id : 9,
        title : 'Bottle Bowl',
        rules : 'Set up the bottles and bowl the soccer ball (Noah\'s room)'
      },
      {
        id : 2,
        title : 'Balloon Blow',
        rules : 'blow solo cups off the table with a balloon (Living Room)'
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
    ],
    hard: [
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
      {
        id : 11,
        title : 'Shoot Bob Ross',
        rules : 'shoot Bob Ross in the dick with the blowgun (basement)'
      },
    ]
  },
  sabotage_cooldown: 1,
  kill_cooldown: 1,
  num_imposters: 1,
  emergency_meetings_allowed: 0, 

  // game state
  // public
  game_id: '',
  status: GameStatus.lobby,
  winner: '',

  // num_players: 0, // calculated on sending
  public_kill_count: 0,
  unreported_dead_bodies: 0,
  // num_tasks: 0 // calculated on sending
  // num_tasks_complete: 0 // calculated on sending
  // TODO
  active_event: null,

  // player roles -> name
  player_roles: {
    admin: '',
    imposters: [],
    crewmates: [],
    all_players: []
  },
  // any one who has left the game :(
  disconnected_players: [],

  // imposter-only (sabotage timer is 'global')
  can_sabotage: false,
  sabotage_timer: 0,
  // these have player and game level counters
  sabotage_count: 0,
  kill_count: 0,

  // actual player data - public to those players
  // names -> player data
  players: {},
  // only used to make sure names are unique
  player_names: [],
}

function sabotage_countdown(game_id) {
  if (!(game_id in games)) {
    console.log('failed sabotage countdown', game_id);
    return;
  }
  games[game_id].sabotage_timer -= 1;
  if (games[game_id].sabotage_timer === 0) {
    games[game_id].can_sabotage = true;
  } else {
    // keep counting down
    setTimeout(() => sabotage_countdown(game_id), 1000);
  }
  // update all imposters
  console.log('updating', games[game_id].player_roles.imposters, games[game_id].sabotage_timer);
  games[game_id].player_roles.imposters.forEach(p_id => send_player_update(p_id));
}

function kill_countdown(game_id, player_id) {
  if (!(game_id in games) || !(player_id in games[game_id].players)) {
    console.log('failed kill countdown', game_id, player_id);
    return;
  }
  games[game_id].players[player_id].kill_timer -= 1;
  if (games[game_id].players[player_id].kill_timer === 0) {
    games[game_id].players[player_id].can_kill = true;
  } else {
    // keep counting down
    setTimeout(() => kill_countdown(game_id, player_id), 1000);
  }
  // update the imposter
  send_player_update(player_id);
}

// shuffle things
function shuffle(array) {
  var shuffled = array.slice(0), i = array.length, temp, index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
}
  return shuffled;
}

function getRandomSubarray(array, size) {
  return shuffle(array).slice(0, size);
}

function get_player_gamestate(player_id) {
  const p = players[player_id];

  const gs = games[p.game_id];
  const is_player = player_id in gs.players
  const is_admin = is_player ? player_id === gs.player_roles.admin : false;
  const is_imposter = is_player ? gs.player_roles.imposters.includes(player_id) : false;

  // public to all players
  var gamestate = {
    game_id: gs.game_id,
    status: gs.status,
    winner: gs.winner,

    num_players: gs.player_roles.all_players.length,
    players: gs.player_roles.all_players.map(p_id => {
      return {
        // TODO: color, photo, etc
        player_id: p_id,
        player_name: gs.players[p_id].player_name,
        is_alive: gs.players[p_id].is_alive,
      }
    }),
    public_kill_count: gs.public_kill_count,
    // TODO: memoize this
    num_tasks: gs.player_roles.all_players.map(p_id => gs.players[p_id].tasks ? gs.players[p_id].tasks.length : 0).reduce((s,a) => s + a, 0),
    // map tasks -> 1,0 for done / not done
    num_tasks_complete: gs.player_roles.all_players
      .map(p_id => gs.players[p_id].tasks? gs.players[p_id].tasks.map(t => t.complete ? 1 : 0).reduce((s, a) => s + a, 0) : 0)
      .reduce((s, a) => s + a, 0),

    // player-specific data
    player_id: player_id,
    player_name: p.player_name,
    is_admin: is_admin,
    is_imposter: is_imposter,
    visible_tasks: is_player ? p.visible_tasks : [],
    all_tasks_complete: is_player ? p.all_tasks_complete : false,
    num_tasks_player: !is_player ? 0 : (!p.tasks ? 0 : p.tasks.length),
    num_tasks_complete_player: !is_player ? 0 : (!p.tasks ? 0 : (
      p.tasks.map(t => t.complete ? 1 : 0).reduce((s,a) => s+a, 0)
    )),
    // imposter data
    can_kill: is_imposter ? p.can_kill : false,
    kill_timer: is_imposter ? p.kill_timer : 0,
    kill_count: is_imposter ? p.kill_count: 0,
    can_sabotage: is_imposter ? gs.can_sabotage : false,
    sabotage_timer: is_imposter ? gs.sabotage_timer : 0,
    sabotage_count: is_imposter ? p.sabotage_count : 0,
    imposters: is_imposter ? gs.player_roles.imposters : [],
    // TODO: admin data?
    // TODO: game event?
  }
  return gamestate;
}

function send_player_update(player_id, message='', gamestate_override={}) {
  if (!(player_id in players)) {
    console.error('player not found, this is not recoverable', player_id);
    return;
  }
  
  if (!(players[player_id].game_id in games)) {
    console.log('game not found, sending heartbeat');
    players[player_id].connection.sendUTF(JSON.stringify({
      type: 'init',
      player_id: player_id,
      available_games: Object.keys(games),
    }));
    return;
  }

  var gamestate = get_player_gamestate(player_id);

  // send the gamestate and message to the connection
  // console.log('sending gamestate', player_id, gamestate);
  players[player_id].connection.sendUTF(JSON.stringify({
    message: message,
    gamestate: {...gamestate, ...gamestate_override}
  }));
}

function update_all_players(game_id, message='') {
  if (!(game_id in games)) {
    console.error('cannot update players for non-existent game', game_id);
    return;
  }
  console.log('updating all players:', games[game_id].player_roles.all_players);

  games[game_id].player_roles.all_players.forEach(p_id => send_player_update(p_id, message));
}

//#########################################################
// primary function - where everything happens in the game
//#########################################################
wsServer.on('request', function(request) {
  
  const connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');

  // connection init, send an init with the available games
  connection.sendUTF(JSON.stringify({
    type: 'init',
    player_id: uuidv4(),
    available_games: Object.keys(games),
  }));

  connection.on('message', function(message) {
    if (message.type !== 'utf8') {
      console.log("Error, unrecognized message type!", message);
      return;
    }
    // print a debug message:
    // console.log('available games:', games);

    // console.log(message.utf8Data)
    var msg = JSON.parse(message.utf8Data);
    console.log('recv message:', msg);
    // parse the message
    const player_id = msg.player_id;
    
    // if we don't have this player yet, create the player and cache them
    if (!(player_id in players)) {
      players[player_id] = JSON.parse(JSON.stringify(InitialPlayerState));
      players[player_id].player_id = player_id;
      
      // there is a chance of name collision, but it's pretty small
      players[player_id].player_name = names[next_name_idx % names.length];
      next_name_idx += 1;
    }

    // make sure our connection is current
    players[player_id].connection = connection;
    connections[connection] = player_id;

    const player = players[player_id];

    if (msg.type === MessageTypes.heartbeat) {
      send_player_update(player_id);
      return;
    }

    // CREATE GAME
    if (msg.type === MessageTypes.create_game) 
    {
      if (msg.game_id in games) {
        // TODO
        send_player_update(player_id, 'Game already exists');
        return;
      }
      // succeed, create the game (deep copy) via stringify / parse
      games[msg.game_id] = JSON.parse(JSON.stringify(InitialGameState));
      
      // double link the player to the game
      player.game_id = msg.game_id;
      games[msg.game_id].game_id = msg.game_id;
      games[msg.game_id].players[player_id] = player;
      games[msg.game_id].player_roles.all_players.push(player_id);
      games[msg.game_id].player_names.push(player.player_name);
      // make the creator the admin
      games[msg.game_id].player_roles.admin = player_id;

      console.log('created game:', games[msg.game_id]);

      update_all_players(msg.game_id);
    
      return;
    } 
    // JOIN GAME
    if (msg.type === MessageTypes.join_game) {
      if (!(msg.game_id in games)) {
        send_player_update(player_id, 'Game does not exist');
        return;
      }
      if (games[msg.game_id].status !== GameStatus.lobby) {
        console.log('That game is in progress! You cannot join a game that has started already.', msg.game_id, player_id);
        send_player_update(player_id, 'That game is in progress! You cannot join a game that has started already.');
        return;
      }
      // Success, tell the player about the game
      players[player_id].game_id = msg.game_id;
      games[msg.game_id].players[player_id] = player;
      games[msg.game_id].player_roles.all_players.push(player_id);
      games[msg.game_id].player_names.push(player.player_name);

      update_all_players(msg.game_id);
      return;
    }
    // at this point, assume we have a good gamestate associated with the player
    const game_id = player.game_id;

    // LEAVE GAME
    if (msg.type === MessageTypes.leave_game) {
      if (!(game_id in games)) {
        send_player_update(player_id, 'Game does not exist');
        return;
      }
      if (games[game_id].status !== GameStatus.lobby) {
        console.log('That game is in progress! You cannot leave a game that has started already.', game_id, player_id);
        send_player_update(player_id, 'That game is in progress! You cannot leave a game that has started already.');
        return;
      }
      
      // remove the player from the game
      delete games[game_id].players[player_id];
      games[game_id].player_roles.all_players = games[game_id].player_roles.all_players.filter((value) => value !== player.player_id);
      games[game_id].player_names = games[game_id].player_names.filter((value) => value !== player.player_name);
      player.game_id = '';

      update_all_players(game_id);
      send_player_update(player_id);
      return;
    }


    if (!(game_id in games)) {
      // failure! Disregard the message, can't do anything with it
      console.error('failed to process message', msg);
      // tell the client of the error
      send_player_update(player_id, "Unknown Game: That didn't work out, please try again or make a bug report:" + msg);
      return;
    }
    const gs = games[game_id];

    // set name (and thus join game)
    // TODO: join an in-progress game?
    if (msg.type === MessageTypes.set_player_name) {
      console.log('trying to change name:', player.player_name, msg.player_name);
      if (gs.status !== GameStatus.lobby) {
        console.log('You cannot change your name in a game that has started already!', game_id, player_id);
        send_player_update(player_id, 'You cannot change your name in a game that has started already!');
        return;
      }
      
      // if a player with that name is already in the game, reject
      if (gs.player_names.includes(msg.player_name)) {
        console.log('Player {'+msg.player_name+'} is already in the game, please choose a different name!');
        send_player_update(player_id, 'Player {'+msg.player_name+'} is already in the game, please choose a different name!');
        return;
      }

      // allow the name to be changed
      gs.player_names = gs.player_names.filter((value) => value !== players[player_id].player_name);
      players[player_id].player_name = msg.player_name;
      gs.player_names.push(msg.player_name);

      update_all_players(game_id);
      return;
      // always allow rejoining the game
      // if (!(player_id in gs.players) && (player_id in gs.disconnected_players)) {
      //   console.log('restoring player with name:', player_id);
      //   // re-add the player and update the connection
      //   gs.players[player_id] = gs.disconnected_players[player_id];
      //   gs.players[player_id].conn = connection;
      //   // no longer disconnected
      //   delete gs.disconnected_players[player_id];
      //   send_player_update(player_id, 'reconnected');
      //   return;
      // }
    }

    // start game
    else if (msg.type === MessageTypes.start_game) {
      if (player_id !== gs.player_roles.admin) {
        // disregard, illegal request - only admin can start the game
        send_player_update(player_id, 'Only an admin can start the game!');
        console.error('illegal request: player ' + player_id + ' tried to start game ' + game_id + ' when admin is ' + gs.player_roles.admin);
        return;
      }
      // remove any players that left
      Object.keys(gs.disconnected_players).forEach((p_id) => delete gs.players[p_id]);

      // start the game and ensure all the values are correct
      gs.status = GameStatus.playing;
      gs.winner = ''
      gs.public_kill_count = 0;
      gs.unreported_dead_bodies = 0;
      gs.active_event = null;
      gs.can_sabotage = false;
      gs.sabotage_timer = gs.sabotage_cooldown+1;
      // assign an imposter and crewmates
      gs.player_roles.imposters = getRandomSubarray(gs.player_roles.all_players, gs.num_imposters);
      gs.player_roles.crewmates = [];
      gs.player_roles.all_players.forEach(n => {
        if (!(gs.player_roles.imposters.includes(n))) {
          gs.player_roles.crewmates.push(n);
        }
      });

      gs.player_roles.all_players.forEach(p_id => {
        const p = gs.players[p_id];

        p.is_alive = true;
        p.invisible_tasks = [];
        p.visible_tasks = [];
        p.completed_tasks = []
        p.all_tasks_complete = false;
        p.can_emergency_meeting = gs.emergency_meetings_allowed > 0;
        p.can_kill = false;
        p.kill_timer = gs.kill_cooldown+1;
        p.kill_count = 0;
        p.sabotage_count = 0;

        // deep clone of the task array - for easy / medium / hard
        p.invisible_tasks = shuffle([]
          .concat(JSON.parse(JSON.stringify(getRandomSubarray(gs.possible_tasks.easy, gs.num_tasks.easy))))
          .concat(JSON.parse(JSON.stringify(getRandomSubarray(gs.possible_tasks.medium, gs.num_tasks.medium))))
          .concat(JSON.parse(JSON.stringify(getRandomSubarray(gs.possible_tasks.hard, gs.num_tasks.hard))))
        );

        // only show some tasks for the players
        p.visible_tasks = [];
        for (var i = 0; i < gs.num_tasks_shown; i++) {
          p.visible_tasks.push(p.invisible_tasks.pop());
        }
      });

      console.log('starting game!');
      console.log(gs);
      // alert everyone that the game has started and their role / teammates
      update_all_players(game_id, 'game started!');
      // actually start the game (clear the message with a server update)
      setTimeout(() => update_all_players(game_id), 5000);

      // TODO: start imposter kill / sabotage counts
      gs.player_roles.imposters.forEach(p_id => {
        console.log('starting kill countdown', game_id, p_id);
        kill_countdown(game_id, p_id);
      });
      console.log('starting sabotage countdown');
      sabotage_countdown(game_id);
    }
    else if (msg.type === MessageTypes.end_game) {
      gs.status = GameStatus.game_over;
      gs.winner = 'No one '
      
      // show a wrap-up message
      update_all_players(game_id, 'Game Over!');
      return;
    }
    else if (msg.type === MessageTypes.play_again) {
      // game must be ended
      if (gs.status !== 'game_over') {
        send_player_update(player_id, 'Cannot reset a game in progress!');
        console.error('illegal state, tried to restart a game that is not over!', msg, gs);
        return;
      }
      // reset what we need to reset
      gs.status = GameStatus.lobby;
      update_all_players(game_id, 'Playing again');
      return;
    }
    
    else if (msg.type === MessageTypes.complete_task) {
      if (gs.status !== GameStatus.playing) {
        // cannot do anything during sabotage
        send_player_update(player_id, 'Cannot complete a task while ' + gs.status);
        console.error('cannot complete a task right now!', gs, msg);
        return;
      }
      
      // check that the client isn't lying
      var complete_task = false;
      var task_idx;
      for (task_idx = 0; task_idx < player.visible_tasks.length; task_idx++) {
        if (player.visible_tasks[task_idx].id === msg.id && !player.visible_tasks[task_idx].completed) {
          complete_task = true;
          break;
        }
      }
      if (!complete_task) {
        send_player_update(player_id, 'Cannot complete this task (it is not visible for you) ' + msg.id);
        console.error('cheater: lied about task!', msg, player.visible_tasks);
        return;
      }
      // visible -> completed

      player.completed_tasks.push(player.visible_tasks[task_idx]);
      player.visible_tasks.splice(task_idx, 1);

      // if more tasks left, show them 
      if (player.invisible_tasks.length > 0) {
        player.visible_tasks.push(player.invisible_tasks.pop());
      } else {
        // check if we're done (last task completed)
        player.all_tasks_complete = player.visible_tasks.length === 0;
      }

      if (player.all_tasks_complete) {
        // do any other crewmates have tasks left?

        if (gs.player_roles.crewmates.reduce((all_complete, n) => all_complete && gs.players[n].all_tasks_complete, true)) {
          // game over - crewmates win!!
          gs.status = GameStatus.game_over;
          gs.winner = 'Crewmates'
          update_all_players(game_id);
          return;
        }
      }

      // only need to update the player who completed the task
      send_player_update(player_id);
    }
    else if (msg.type === MessageTypes.sabotage) {
      if (!gs.can_sabotage || gs.status !== GameStatus.playing) {
        send_player_update(player_id, 'Cannot sabotage right now!');
        console.error('illegal message, cannot sabotage right now', gs, msg);
        return;
      }
      gs.status = GameStatus.sabotaged;
      gs.can_sabotage = false;
      player.sabotage_count += 1;
      gs.sabotage_count += 1;

      // update the client with the sabotage cooldown every second
      gs.sabotage_timer = gs.sabotage_cooldown + 1;

      update_all_players(game_id);
      return;
    }
    else if (msg.type === MessageTypes.kill) {
      if (!player.can_kill || gs.status !== GameStatus.playing) {
        send_player_update(player_id, 'Cannot kill right now!');
        console.error('illegal message, cannot kill right now', gs, msg);
        return;
      }
      // TODO: verify the player that was killed

      player.can_kill = false;
      player.kill_count += 1;
      gs.kill_count += 1;
      gs.unreported_dead_bodies += 1;

      // update the client with the kill cooldown every second
      player.kill_timer = gs.kill_cooldown + 1;
      kill_countdown(player_id);

      // TODO: check if the game is over
      
      return;
    }
    else if (msg.type === MessageTypes.fix_sabotage) {
      if (gs.status !== GameStatus.sabotaged) {
        console.log('cannot fix sabotage right now');
        return;
      }
      gs.status = GameStatus.playing;
      sabotage_countdown(game_id);
      update_all_players(game_id);
    }
    // TODO: support other messages
    // - emergency meeting
    // - dead body reported
  });

  
  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');

    if (!(connection in connections)) {
      // player never made it in to a game
      // can't recover if we can't find the connection
      console.log('cannot prune connection, it is not cached');
      return;
    }
    
    var player_id = connections[connection];
    
    if (!(player_id in players)) {
      console.log('cannot prune player, it is not cached');
      return;
    }
    const p = players[player_id];
    if (!(p.game_id in games)) {
      console.log('cannot prune game, it is not cached');
      return;
    }
    const gs = games[p.game_id];

    // add player to disconnected players
    if (!gs.disconnected_players.includes(player_id)) {
      gs.disconnected_players.push(player_id);
    }

    // if this is the last player, kill the game
    if (gs.player_roles.all_players.length === gs.disconnected_players.length) {
      console.log('killing game',p.game_id,'due to inactivity', gs.players.length, gs.disconnected_players.length);
      delete games[p.game_id];
      return;
    }

    // game still going - re-assign admin if needed
    if (player_id === gs.player_roles.admin) {
      console.log('re-assigning admin');
      // get the next player (that's not in disconnected players) and make them the admin
      for (var i = 0; i < gs.player_roles.all_players.length; i++) {
        const n = gs.player_roles.all_players[i];
        if (!(n in gs.disconnected_players)) {
          games[p.game_id].player_roles.admin = n;
          break;
        }
      }
    }
  });
});