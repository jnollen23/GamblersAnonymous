var sportsTypes = JSON.parse(`
[{
    "key": "americanfootball_ncaaf",
    "group": "American Football",
    "title": "NCAAF",
    "description": "US College Football",
    "active": true,
    "has_outrights": false
}, {
    "key": "americanfootball_nfl",
    "group": "American Football",
    "title": "NFL",
    "description": "US Football",
    "active": true,
    "has_outrights": false
}, {
    "key": "americanfootball_nfl_super_bowl_winner",
    "group": "American Football",
    "title": "NFL Super Bowl Winner",
    "description": "Super Bowl Winner 2022/2023",
    "active": true,
    "has_outrights": true
}, {
    "key": "baseball_mlb_world_series_winner",
    "group": "Baseball",
    "title": "MLB World Series Winner",
    "description": "World Series Winner 2022",
    "active": true,
    "has_outrights": true
}, {
    "key": "basketball_nba",
    "group": "Basketball",
    "title": "NBA",
    "description": "US Basketball",
    "active": true,
    "has_outrights": false
}, {
    "key": "basketball_nba_championship_winner",
    "group": "Basketball",
    "title": "NBA Championship Winner",
    "description": "Championship Winner 2022/2023",
    "active": true,
    "has_outrights": true
}, {
    "key": "basketball_ncaab",
    "group": "Basketball",
    "title": "NCAAB",
    "description": "US College Basketball",
    "active": true,
    "has_outrights": false
}, {
    "key": "cricket_big_bash",
    "group": "Cricket",
    "title": "Big Bash",
    "description": "Big Bash League",
    "active": true,
    "has_outrights": false
}, {
    "key": "cricket_odi",
    "group": "Cricket",
    "title": "One Day Internationals",
    "description": "One Day Internationals",
    "active": true,
    "has_outrights": false
}, {
    "key": "cricket_test_match",
    "group": "Cricket",
    "title": "Test Matches",
    "description": "International Test Matches",
    "active": true,
    "has_outrights": false
}, {
    "key": "golf_masters_tournament_winner",
    "group": "Golf",
    "title": "Masters Tournament Winner",
    "description": "2023 Winner",
    "active": true,
    "has_outrights": true
}, {
    "key": "golf_pga_championship_winner",
    "group": "Golf",
    "title": "PGA Championship Winner",
    "description": "2023 Winner",
    "active": true,
    "has_outrights": true
}, {
    "key": "golf_the_open_championship_winner",
    "group": "Golf",
    "title": "The Open Winner",
    "description": "2023 Winner",
    "active": true,
    "has_outrights": true
}, {
    "key": "golf_us_open_winner",
    "group": "Golf",
    "title": "US Open Winner",
    "description": "2023 Winner",
    "active": true,
    "has_outrights": true
}, {
    "key": "icehockey_nhl",
    "group": "Ice Hockey",
    "title": "NHL",
    "description": "US Ice Hockey",
    "active": true,
    "has_outrights": false
}, {
    "key": "icehockey_nhl_championship_winner",
    "group": "Ice Hockey",
    "title": "NHL Championship Winner",
    "description": "Stanley Cup Winner 2022/2023",
    "active": true,
    "has_outrights": true
}, {
    "key": "icehockey_sweden_allsvenskan",
    "group": "Ice Hockey",
    "title": "HockeyAllsvenskan",
    "description": "Swedish Hockey Allsvenskan",
    "active": true,
    "has_outrights": false
}, {
    "key": "icehockey_sweden_hockey_league",
    "group": "Ice Hockey",
    "title": "SHL",
    "description": "Swedish Hockey League",
    "active": true,
    "has_outrights": false
}, {
    "key": "mma_mixed_martial_arts",
    "group": "Mixed Martial Arts",
    "title": "MMA",
    "description": "Mixed Martial Arts",
    "active": true,
    "has_outrights": false
}, {
    "key": "rugbyleague_nrl",
    "group": "Rugby League",
    "title": "NRL",
    "description": "Aussie Rugby League",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_australia_aleague",
    "group": "Soccer",
    "title": "A-League",
    "description": "Aussie Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_belgium_first_div",
    "group": "Soccer",
    "title": "Belgium First Div",
    "description": "Belgian First Division A",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_china_superleague",
    "group": "Soccer",
    "title": "Super League - China",
    "description": "Chinese Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_efl_champ",
    "group": "Soccer",
    "title": "Championship",
    "description": "EFL Championship",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_england_efl_cup",
    "group": "Soccer",
    "title": "EFL Cup",
    "description": "League Cup",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_england_league1",
    "group": "Soccer",
    "title": "League 1",
    "description": "EFL League 1",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_england_league2",
    "group": "Soccer",
    "title": "League 2",
    "description": "EFL League 2 ",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_epl",
    "group": "Soccer",
    "title": "EPL",
    "description": "English Premier League",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_fa_cup",
    "group": "Soccer",
    "title": "FA Cup",
    "description": "Football Association Challenge Cup",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_fifa_world_cup",
    "group": "Soccer",
    "title": "FIFA World Cup",
    "description": "FIFA World Cup 2022",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_fifa_world_cup_winner",
    "group": "Soccer",
    "title": "FIFA World Cup Winner",
    "description": "FIFA World Cup Winner 2022",
    "active": true,
    "has_outrights": true
}, {
    "key": "soccer_france_ligue_one",
    "group": "Soccer",
    "title": "Ligue 1 - France",
    "description": "French Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_germany_bundesliga",
    "group": "Soccer",
    "title": "Bundesliga - Germany",
    "description": "German Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_germany_bundesliga2",
    "group": "Soccer",
    "title": "Bundesliga 2 - Germany",
    "description": "German Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_italy_serie_a",
    "group": "Soccer",
    "title": "Serie A - Italy",
    "description": "Italian Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_italy_serie_b",
    "group": "Soccer",
    "title": "Serie B - Italy",
    "description": "Italian Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_netherlands_eredivisie",
    "group": "Soccer",
    "title": "Dutch Eredivisie",
    "description": "Dutch Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_poland_ekstraklasa",
    "group": "Soccer",
    "title": "Ekstraklasa - Poland",
    "description": "Polish Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_portugal_primeira_liga",
    "group": "Soccer",
    "title": "Primeira Liga - Portugal",
    "description": "Portugese Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_spain_la_liga",
    "group": "Soccer",
    "title": "La Liga - Spain",
    "description": "Spanish Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_spain_segunda_division",
    "group": "Soccer",
    "title": "La Liga 2 - Spain",
    "description": "Spanish Soccer",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_uefa_champs_league",
    "group": "Soccer",
    "title": "UEFA Champions",
    "description": "European Champions League",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_uefa_europa_conference_league",
    "group": "Soccer",
    "title": "UEFA Europa Conference League",
    "description": "UEFA Europa Conference League",
    "active": true,
    "has_outrights": false
}, {
    "key": "soccer_uefa_europa_league",
    "group": "Soccer",
    "title": "UEFA Europa",
    "description": "European Europa League",
    "active": true,
    "has_outrights": false
}]
`);