// this ELO logic has two assumptions:
// - the team ELO is an average of all player's ELO on that team.
// For example: 5 v 4, team0 is 25% bigger. Hence team1 elo gets lowered by 100*25% = 25 points.
// Above 6 players, no bonus is given.
// Honestly, this is a bit stupid. Maybe it should just disregard the weakest player in bigger team???
// RMS could make sense here -> good players usually make more impact than bad players

function calculateTeamElo(team_elo_array, other_team_elo_array, adjust_for_unequal_teams = true){
    //rms calc
    let team_elo = 0
    for(let i=0; i <team_elo_array.length; ++i)
        team_elo += Math.pow(team_elo_array[i], 2)
    team_elo /= team_elo_array.length
    team_elo = Math.sqrt(team_elo)
    
    //another way -> scaling depending on player count. increase bigger team's elo
    if(adjust_for_unequal_teams == true && team_elo_array.length > other_team_elo_array.length && other_team_elo_array.length < 6)
        team_elo *= Math.pow(team_elo_array.length, 0.3) / Math.pow(other_team_elo_array.length, 0.3)

    return Math.round(team_elo)
}

function calculateTeamChance(team0_elo, team1_elo){
    let denom = (1 + Math.pow(10, (team1_elo-team0_elo)/400))
    return 1 / denom
}

function calculateRandomTeam(player_count){
    let player_array = Array(player_count);
    for(let i=0; i < player_array.length; ++i)
        player_array[i] = i
    let team0_array = Array(Math.ceil(player_count/2))

    for(let i=0; i < team0_array.length; ++i){
        let randomRemainingPLayer = Math.floor(Math.random() * player_array.length)
        team0_array[i] = player_array[randomRemainingPLayer]
        player_array.splice(randomRemainingPLayer, 1) //remove from remaining list
    }

    return team0_array
}

function calculateOptimalTeam(player_elo_array){

    //if teams are unequal, team0 should be bigger
    let team0_size = Math.ceil(player_elo_array.length/2)

    team0_best = Array(team0_size);
    best_diff = 10000;

    //buckle up, recursion time!
    function recursiveSearch(startIndex, currentTeam_indexes){
        //if team full, calculate ELOs and compare
        if(currentTeam_indexes.length == team0_size){
            let Team0 = []
            let Team1 = []
            for(let i=0; i<player_elo_array.length; ++i){
                if(currentTeam_indexes.includes(i) == true)
                    Team0.push(player_elo_array[i])
                else
                    Team1.push(player_elo_array[i])
            }
            let diff = Math.abs(calculateTeamElo(Team0, Team1)-calculateTeamElo(Team1, Team0))
            if(diff < best_diff){
                best_diff = diff
                team0_best = [...currentTeam_indexes]; //cursed imho
            }
            return;
        }
        //team not full - test all available option for next player
        for (let i=startIndex; i < player_elo_array.length; ++i){
            currentTeam_indexes.push(i)
            recursiveSearch(i+1, currentTeam_indexes)
            currentTeam_indexes.pop() //remove the last index before trying another, idiot
        }
    }

    recursiveSearch(0, [])

    return team0_best
}

function updateElo(team0_array, team1_array, winner_team, k_factor = 32){
    team0_elo = calculateTeamElo(team0_array, team1_array)
    team1_elo = calculateTeamElo(team1_array, team0_array)
    team0_chance = calculateTeamChance(team0_elo, team1_elo)
    team1_chance = 1 - team0_chance
    if(isNaN(team0_chance) || isNaN(team1_chance)){
        console.log("ELO calculation error: team0_elo = " + team0_elo + ", team1_elo = " + team1_elo)
        return
    }
    team0_change = Math.round(k_factor * (1 - winner_team - team0_chance))

    for(let i=0; i < team0_array.length; ++i){
        team0_array[i] += team0_change
    }
    for(let i=0; i < team1_array.length; ++i){
        team1_array[i] -= team0_change
    }
}