'use strict'

var numPlayers = 10,
    numGames = 20,
    gameIndex = 0,
    players,
    playerQueue

var mapPlayersWithWhomTheyPlayedAlready = new Array(numPlayers)

var skippedPlayers = []


function createPlayers(number) {
    var players = []

    for(var i = 0; i < number; i++) {
        players.push({
            name: "player" + i,
            id: i
        })

        mapPlayersWithWhomTheyPlayedAlready[i] = []
    }

    return players
}

function createGame(gamePlayers) {
    gameIndex++
    return {
        white: [gamePlayers[0], gamePlayers[1]],
        black: [gamePlayers[2], gamePlayers[3]],
        gameIndex: gameIndex
    }
}

function playerIsInGame(player, game) {
    if(game.white.includes(player)
        || game.black.includes(player))
        return true
    else
        return false
}

function removePlayerAtPos(pos ) {
    return playerQueue.splice(pos, 1)[0];
}

function removeAllWithValueFrom(value, array) {
    for(var i in array) {
        if(array[i] == value) {
            array.splice(i, 1);
            break;
        }
    }
}


function hasSamePlayerInMyTeamAgain(gamePlayerIds, me) {
    var myIndex = gamePlayerIds.length
    const threshold = 5

    // cannot happen because array is not filled that far yet
    //if(myIndex == 0 && mapPlayersWithWhomTheyPlayedAlready[me.id].includes(players[1].id))
        //return true

    if(!me) {
        console.log(gamePlayerIds)
        console.log(me)
    }

    if(myIndex == 1 && (mapPlayersWithWhomTheyPlayedAlready[me.id].includes(gamePlayerIds[0])
                    ||  mapPlayersWithWhomTheyPlayedAlready[gamePlayerIds[0]].includes(me.id))){

        if(mapPlayersWithWhomTheyPlayedAlready[me.id] > threshold)
            return false

        skippedPlayers.push(me.id)
        return true
    }
    // cannot happen because array is not filled that far yet
    //else if(myIndex == 2 && mapPlayersWithWhomTheyPlayedAlready[me.id].includes(players[3].id))
        //return true
    else if(myIndex == 3 && mapPlayersWithWhomTheyPlayedAlready[me.id].includes(gamePlayerIds[2])){

        if(mapPlayersWithWhomTheyPlayedAlready[me.id] > threshold)
            return false

        skippedPlayers.push(me.id)
        return true
    }

    return false
}

function getBestPlayerForGame(playersInGame) {
    var pos = 0,
        player = null,
        usedSkippedPlayer = false

    while (player == null) {

        if(! playersInGame.includes(playerQueue[pos].id)){
            if(! hasSamePlayerInMyTeamAgain(playersInGame, playerQueue[pos]))
                player = removePlayerAtPos(pos)
        }

        pos++
        if(pos >= playerQueue.length) {
            var playerId = skippedPlayers.splice(0, 1)[0]
            removeAllWithValueFrom(playerId, skippedPlayers)
            player = players[playerId]
            usedSkippedPlayer = true

            //pos = 0
            console.error("No best player for game found... Using player from skipped list with id: " + player.id)
            continue;
        }
    }

    if(! usedSkippedPlayer)
        playerQueue.push(player)
    return player
}

function addPlayersToPlayedWithMap(gamePlayersIds) {
    for(var i=0; i<gamePlayersIds.length; i++) {
        for(var k=0; k<gamePlayersIds.length; k++) {
            if(i == k)
                continue

            console.log(JSON.stringify(mapPlayersWithWhomTheyPlayedAlready))
            console.log(gamePlayersIds[i])

            mapPlayersWithWhomTheyPlayedAlready[gamePlayersIds[i]].push(gamePlayersIds[k])
        }
    }
}

function getGames() {
    playerQueue = players = createPlayers(numPlayers);
    console.log(playerQueue)

    var games = []

    for(var i = 0; i < numGames; i++) {
        var gamePlayers = []

        for(var k = 0; k < 4; k++) {
            var bestPlayer = getBestPlayerForGame(gamePlayers)

            if(! bestPlayer) {
                console.log("Invalid player returned...")
            }

            gamePlayers.push(bestPlayer.id)
        }

        addPlayersToPlayedWithMap(gamePlayers)

        games.push(createGame(gamePlayers))
    }

    return games
}

/****  -------------- PRINT AND RUN ------------------- ****/

function gamesPerPlayer(games) {
    var mapPlayerToGames = {}

    //for(var p in players)
}

var isNotTopeLevelArray = false
function stringify(k,v){
    if(v instanceof Array && isNotTopeLevelArray)
        return JSON.stringify(v);

    isNotTopeLevelArray = true
    return v;
}

console.log(JSON.stringify(getGames(), stringify, '  '))