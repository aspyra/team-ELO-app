let db_players
let db_matches

function db_init(){
    db_players = localStorage.getItem(("db_players"))
    if(db_players == null){
        db_players = [
        { id: 1, name: "Olek", surname: "Spyra", elo: [1234], wins: 0, losses: 0, active: true, hidden: false, team0: true},
        { id: 2, name: "Natalia", surname: "Spyra", elo: [1000], wins: 1, losses: 3, active: false, hidden: false, team0: false},
        { id: 3, name: "test", surname: "123", elo: [123], wins: 0, losses: 0, active: false, hidden: true, team0: true},
        { id: 4, name: "Bartek", surname: "Kowalski", elo: [1300], wins: 0, losses: 4, active: true, hidden: false, team0: true},
        { id: 5, name: "Bartek", surname: "Borys", elo: [1250], wins: 2, losses: 2, active: false, hidden: false, team0: false},
        { id: 6, name: "Artur", surname: "Doberstein", elo: [1100], wins: 3, losses: 0, active: true, hidden: false, team0: true},
        { id: 7, name: "Szymon", surname: "Chyrzyński", elo: [1150], starting_elo: 1200, wins: 2, losses: 1, active: true, hidden: false, team0: false},
        { id: 8, name: "Babka", surname: "Weronika", elo: [1400], starting_elo: 1200, wins: 2, losses: 1, active: true, hidden: false, team0: false},
        { id: 9, name: "Marcin", surname: "Kowalski", elo: [1050], starting_elo: 1200, wins: 2, losses: 4, active: true, hidden: false, team0: false}
        ]
        localStorage.setItem("db_players", JSON.stringify(db_players))
    }
    else{
        db_players = JSON.parse(db_players)
    }

    db_matches = localStorage.getItem("db_matches")
    if(db_matches == null){
        localStorage.setItem("db_matches", JSON.stringify([]))
        db_matches = []
    }
    else{
        db_matches = JSON.parse(db_matches)
    }
    console.log(db_players)
    console.log(db_matches)
}

function db_save_players(){
    localStorage.setItem("db_players", JSON.stringify(db_players))
}

function db_save_matches(){
    localStorage.setItem("db_matches", JSON.stringify(db_matches))
}

function db_add_player(name, surname, starting_elo = 1200, wins = 0, losses = 0, active = true, hidden = false, team0 = true){
    let new_player = {
        id: Math.max(0, ...db_players.map(p => p.id)) + 1, //fancy, huh
        name: name,
        surname: surname,
        elo: [starting_elo],
        wins: wins,
        losses: losses,
        active: active,
        hidden: hidden,
        team0: team0
    }
    db_players.push(new_player)
    db_save_players()
}

function db_add_match(team0_ids, team1_ids, winner_team){
    let new_match = {
        id: Math.max(0, ...db_matches.map(m => m.id)) + 1,
        team0_ids: team0_ids,
        team1_ids: team1_ids,
        winner_team: winner_team
    }
    db_matches.push(new_match)
    db_save_matches()
}

//localStorage.clear() //TODO: remove this line, it's just for testing
db_init()