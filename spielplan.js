'use strict'

var numPlayers = 10,
    numGames = 24

var gameIndex = 0

var players

var mapPlayersWithWhomTheyPlayedAlready = new Array(numPlayers)


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

function createGame(players) {
    gameIndex++
    return {
        white: [players[0], players[1]],
        black: [players[2], players[3]],
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
    return players.splice(pos, 1)[0];
}

function hasSamePlayerInMyTeamAgain(players, me) {
    var myIndex = players.length

    // cannot happen because array is not filled that far yet
    //if(myIndex == 0 && mapPlayersWithWhomTheyPlayedAlready[me.id].includes(players[1].id))
        //return true
    if(myIndex == 1 && mapPlayersWithWhomTheyPlayedAlready[me.id].includes(players[0].id))
        return true
    // cannot happen because array is not filled that far yet
    //else if(myIndex == 2 && mapPlayersWithWhomTheyPlayedAlready[me.id].includes(players[3].id))
        //return true
    else if(myIndex == 3 && mapPlayersWithWhomTheyPlayedAlready[me.id].includes(players[2].id))
        return true

    return false
}

function getBestPlayerForGame(playersInGame) {
    var pos = 0,
        player = null

    while (player == null) {
        if(! playersInGame.includes(players[pos])){
            if(! hasSamePlayerInMyTeamAgain(playersInGame, players[pos]))
                player = removePlayerAtPos(pos)
        }

        pos++
        if(pos > players.length) {
            console.error("No best player for game found... Array out of bounds")
            break;
        }
    }

    players.push(player)
    return player
}

function addPlayersToPlayedWithMap(gamePlayersIds) {
    for(var i=0; i<gamePlayersIds.length; i++) {
        for(var k=0; k<gamePlayersIds.length; k++) {
            if(i == k)
                continue

            //console.log(JSON.stringify(mapPlayersWithWhomTheyPlayedAlready))
            //console.log(gamePlayersIds[i])

            mapPlayersWithWhomTheyPlayedAlready[gamePlayersIds[i]].push(gamePlayersIds[k])
        }
    }
}

function getGames() {
    players = createPlayers(numPlayers);
    console.log(players)

    var games = []

    for(var i = 0; i < numGames; i++) {
        var gamePlayers = []

        for(var k = 0; k < 4; k++) {
            var bestPlayer = getBestPlayerForGame(gamePlayers)

            gamePlayers.push(bestPlayer.id)
        }

        addPlayersToPlayedWithMap(gamePlayers)

        games.push(createGame(gamePlayers))
    }

    return games
}

/****  -------------- PRINT AND RUN ------------------- ****/

var isNotTopeLevelArray = false
function stringify(k,v){
    if(v instanceof Array && isNotTopeLevelArray)
        return JSON.stringify(v);

    isNotTopeLevelArray = true
    return v;
}

console.log(JSON.stringify(getGames(), stringify, '  '))