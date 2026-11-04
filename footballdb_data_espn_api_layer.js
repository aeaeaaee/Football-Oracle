/**
 * ============================================================================
 * FOOTBALLDB — STANDALONE DATABASE & ESPN API INGESTION LAYER (football_db.js)
 * ============================================================================
 * Pipeline Architecture (per BEHAVIOUR.md):
 *   1. ESPN API (/standings, /scoreboard, /teams/{id}/schedule)
 *   2. Write & persist into FootballDB (football_db.js / localStorage + Exportable .js)
 *   3. Webpage UI Layer (premier_league_predictor.html) reads strictly from FootballDB
 */

(function (global) {
    'use strict';

    const leagueConfigs = {
        PL: {
            name: "Premier League",
            espnSlug: "eng.1",
            logo: "https://a.espncdn.com/i/leaguelogos/soccer/500/23.png",
            defaultHome: "EVE",
            defaultAway: "COV",
            matchesPerRound: 10,
            maxTeams: 20,
            totalRounds: 38,
            roundPrefix: "MW",
            activeRound: "MW10"
        },
        LALIGA: {
            name: "La Liga",
            espnSlug: "esp.1",
            logo: "https://a.espncdn.com/i/leaguelogos/soccer/500/15.png",
            defaultHome: "ESP",
            defaultAway: "DEP",
            matchesPerRound: 10,
            maxTeams: 20,
            totalRounds: 38,
            roundPrefix: "MD",
            activeRound: "MD12"
        },
        UCL: {
            name: "UEFA Champions League",
            espnSlug: "uefa.champions",
            logo: "https://a.espncdn.com/i/leaguelogos/soccer/500/2.png",
            defaultHome: "FEN",
            defaultAway: "LIV",
            matchesPerRound: 18,
            maxTeams: 36,
            totalRounds: 8,
            roundPrefix: "UCL",
            activeRound: "UCL4"
        }
    };

    const plTeamsData = {
        ARS: { espnId: 359, name: "Arsenal", short: "ARS", color: "#EF0107", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png", xg: 2.02, xga: 0.78, shots: 16, sot: 6, bigChances: 3, poss: 58, played: 9, gf: 14, ga: 5, gd: 9, pts: 24, espnRank: 1, form: ['W','W','W','W','L'] },
        MCI: { espnId: 382, name: "Manchester City", short: "MCI", color: "#6CABDD", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/382.png", xg: 2.15, xga: 0.92, shots: 17, sot: 6, bigChances: 3, poss: 62, played: 9, gf: 20, ga: 10, gd: 10, pts: 21, espnRank: 2, form: ['W','W','W','L','L'] },
        BHA: { espnId: 331, name: "Brighton & Hove Albion", short: "BHA", color: "#0057B8", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/331.png", xg: 1.94, xga: 0.95, shots: 15, sot: 6, bigChances: 3, poss: 56, played: 9, gf: 24, ga: 7, gd: 17, pts: 19, espnRank: 3, form: ['D','W','W','L','W'] },
        CHE: { espnId: 363, name: "Chelsea", short: "CHE", color: "#034694", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png", xg: 1.82, xga: 1.18, shots: 15, sot: 6, bigChances: 3, poss: 57, played: 9, gf: 19, ga: 15, gd: 4, pts: 16, espnRank: 4, form: ['W','L','W','W','L'] },
        LIV: { espnId: 364, name: "Liverpool", short: "LIV", color: "#C8102E", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png", xg: 1.88, xga: 0.98, shots: 16, sot: 6, bigChances: 3, poss: 58, played: 9, gf: 11, ga: 9, gd: 2, pts: 15, espnRank: 5, form: ['D','D','W','W','W'] },
        BRE: { espnId: 337, name: "Brentford", short: "BRE", color: "#E30613", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/337.png", xg: 1.62, xga: 1.15, shots: 13, sot: 5, bigChances: 2, poss: 48, played: 9, gf: 16, ga: 9, gd: 7, pts: 14, espnRank: 6, form: ['D','D','W','D','W'] },
        EVE: { espnId: 368, name: "Everton", short: "EVE", color: "#003399", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/368.png", xg: 1.32, xga: 1.12, shots: 12, sot: 4, bigChances: 2, poss: 45, played: 9, gf: 9, ga: 9, gd: 0, pts: 13, espnRank: 7, form: ['D','L','L','W','W'] },
        BOU: { espnId: 349, name: "Bournemouth", short: "BOU", color: "#DA291C", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/349.png", xg: 1.48, xga: 1.28, shots: 13, sot: 5, bigChances: 2, poss: 48, played: 9, gf: 14, ga: 13, gd: 1, pts: 12, espnRank: 8, form: ['D','L','D','W','W'] },
        TOT: { espnId: 367, name: "Tottenham Hotspur", short: "TOT", color: "#132257", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/367.png", xg: 1.68, xga: 1.20, shots: 15, sot: 5, bigChances: 3, poss: 56, played: 9, gf: 10, ga: 10, gd: 0, pts: 12, espnRank: 9, form: ['D','L','D','W','W'] },
        AVL: { espnId: 362, name: "Aston Villa", short: "AVL", color: "#670E36", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/362.png", xg: 1.45, xga: 1.32, shots: 13, sot: 5, bigChances: 2, poss: 52, played: 9, gf: 10, ga: 13, gd: -3, pts: 12, espnRank: 10, form: ['W','W','D','L','D'] },
        HUL: { espnId: 306, name: "Hull City", short: "HUL", color: "#F5A12D", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/306.png", xg: 1.28, xga: 1.25, shots: 11, sot: 4, bigChances: 2, poss: 46, played: 9, gf: 11, ga: 10, gd: 1, pts: 11, espnRank: 11, form: ['D','W','L','D','D'] },
        LEE: { espnId: 357, name: "Leeds United", short: "LEE", color: "#1D428A", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/357.png", xg: 1.30, xga: 1.18, shots: 12, sot: 4, bigChances: 2, poss: 49, played: 9, gf: 9, ga: 8, gd: 1, pts: 11, espnRank: 12, form: ['D','W','D','D','L'] },
        NEW: { espnId: 361, name: "Newcastle United", short: "NEW", color: "#241F20", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/361.png", xg: 1.52, xga: 1.38, shots: 14, sot: 5, bigChances: 2, poss: 52, played: 9, gf: 12, ga: 15, gd: -3, pts: 11, espnRank: 13, form: ['L','D','W','L','L'] },
        IPS: { espnId: 373, name: "Ipswich Town", short: "IPS", color: "#3A64A3", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/373.png", xg: 1.34, xga: 1.56, shots: 11, sot: 4, bigChances: 2, poss: 44, played: 9, gf: 14, ga: 18, gd: -4, pts: 11, espnRank: 14, form: ['W','L','D','W','L'] },
        FUL: { espnId: 370, name: "Fulham", short: "FUL", color: "#000000", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/370.png", xg: 1.32, xga: 1.30, shots: 12, sot: 4, bigChances: 2, poss: 50, played: 9, gf: 9, ga: 11, gd: -2, pts: 9, espnRank: 15, form: ['L','W','D','L','D'] },
        COV: { espnId: 388, name: "Coventry City", short: "COV", color: "#0593D0", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/388.png", xg: 1.24, xga: 1.52, shots: 11, sot: 4, bigChances: 2, poss: 46, played: 9, gf: 9, ga: 16, gd: -7, pts: 9, espnRank: 16, form: ['W','W','L','L','W'] },
        MUN: { espnId: 360, name: "Manchester United", short: "MUN", color: "#DA291C", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/360.png", xg: 1.35, xga: 1.48, shots: 13, sot: 4, bigChances: 2, poss: 52, played: 9, gf: 10, ga: 15, gd: -5, pts: 7, espnRank: 17, form: ['L','D','L','L','L'] },
        CRY: { espnId: 384, name: "Crystal Palace", short: "CRY", color: "#1B458F", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/384.png", xg: 1.18, xga: 1.68, shots: 11, sot: 4, bigChances: 1, poss: 44, played: 9, gf: 9, ga: 21, gd: -12, pts: 7, espnRank: 18, form: ['L','W','L','L','L'] },
        NFO: { espnId: 393, name: "Nottingham Forest", short: "NFO", color: "#DD0000", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/393.png", xg: 1.12, xga: 1.38, shots: 11, sot: 3, bigChances: 1, poss: 43, played: 9, gf: 6, ga: 12, gd: -6, pts: 6, espnRank: 19, form: ['D','L','D','L','L'] },
        SUN: { espnId: 366, name: "Sunderland", short: "SUN", color: "#EB172B", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/366.png", xg: 1.05, xga: 1.65, shots: 10, sot: 3, bigChances: 1, poss: 42, played: 9, gf: 7, ga: 17, gd: -10, pts: 5, espnRank: 20, form: ['L','D','L','L','L'] }
    };

    const laLigaTeamsData = {
        BAR: { espnId: 83, name: "FC Barcelona", short: "BAR", color: "#A50044", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/83.png", xg: 2.32, xga: 0.94, shots: 17, sot: 7, bigChances: 4, poss: 64, played: 11, gf: 33, ga: 10, gd: 23, pts: 30, espnRank: 1, form: ['W','W','L','W','W'] },
        RMA: { espnId: 86, name: "Real Madrid", short: "RMA", color: "#FEBE10", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png", xg: 2.18, xga: 0.90, shots: 18, sot: 7, bigChances: 4, poss: 61, played: 11, gf: 24, ga: 11, gd: 13, pts: 27, espnRank: 2, form: ['W','W','W','L','W'] },
        ATM: { espnId: 1068, name: "Atlético Madrid", short: "ATM", color: "#CB3524", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png", xg: 1.72, xga: 0.84, shots: 14, sot: 5, bigChances: 3, poss: 52, played: 11, gf: 18, ga: 7, gd: 11, pts: 23, espnRank: 3, form: ['D','W','D','L','W'] },
        VIL: { espnId: 102, name: "Villarreal CF", short: "VIL", color: "#FFE667", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/102.png", xg: 1.66, xga: 1.32, shots: 14, sot: 5, bigChances: 3, poss: 51, played: 11, gf: 20, ga: 18, gd: 2, pts: 21, espnRank: 4, form: ['L','D','L','W','W'] },
        OSA: { espnId: 97, name: "CA Osasuna", short: "OSA", color: "#D91A2A", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/97.png", xg: 1.32, xga: 1.28, shots: 12, sot: 4, bigChances: 2, poss: 46, played: 11, gf: 16, ga: 16, gd: 0, pts: 21, espnRank: 5, form: ['D','W','L','W','W'] },
        ATH: { espnId: 93, name: "Athletic Club", short: "ATH", color: "#EE2523", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/93.png", xg: 1.58, xga: 1.05, shots: 14, sot: 5, bigChances: 2, poss: 50, played: 11, gf: 18, ga: 12, gd: 6, pts: 18, espnRank: 6, form: ['D','L','W','D','D'] },
        BET: { espnId: 244, name: "Real Betis", short: "BET", color: "#0BB363", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/244.png", xg: 1.50, xga: 1.12, shots: 14, sot: 5, bigChances: 2, poss: 53, played: 11, gf: 12, ga: 10, gd: 2, pts: 18, espnRank: 7, form: ['W','W','W','W','D'] },
        MLL: { espnId: 84, name: "RCD Mallorca", short: "MLL", color: "#E20613", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/84.png", xg: 1.22, xga: 1.12, shots: 11, sot: 4, bigChances: 2, poss: 45, played: 11, gf: 11, ga: 10, gd: 1, pts: 17, espnRank: 8, form: ['W','W','L','D','L'] },
        RAY: { espnId: 101, name: "Rayo Vallecano", short: "RAY", color: "#E53027", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/101.png", xg: 1.26, xga: 1.22, shots: 13, sot: 4, bigChances: 2, poss: 49, played: 11, gf: 12, ga: 11, gd: 1, pts: 16, espnRank: 9, form: ['D','D','W','W','L'] },
        RSO: { espnId: 89, name: "Real Sociedad", short: "RSO", color: "#0067B1", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/89.png", xg: 1.45, xga: 0.98, shots: 13, sot: 4, bigChances: 2, poss: 56, played: 11, gf: 10, ga: 10, gd: 0, pts: 15, espnRank: 10, form: ['D','W','L','W','W'] },
        GIR: { espnId: 9812, name: "Girona FC", short: "GIR", color: "#CD2534", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/9812.png", xg: 1.48, xga: 1.28, shots: 13, sot: 5, bigChances: 2, poss: 57, played: 11, gf: 15, ga: 14, gd: 1, pts: 15, espnRank: 11, form: ['D','W','L','L','W'] },
        SEV: { espnId: 243, name: "Sevilla FC", short: "SEV", color: "#D41920", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/243.png", xg: 1.30, xga: 1.35, shots: 12, sot: 4, bigChances: 2, poss: 51, played: 11, gf: 12, ga: 15, gd: -3, pts: 15, espnRank: 12, form: ['W','D','W','L','L'] },
        CEL: { espnId: 85, name: "Celta Vigo", short: "CEL", color: "#8AC3EE", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/85.png", xg: 1.40, xga: 1.38, shots: 13, sot: 5, bigChances: 2, poss: 51, played: 11, gf: 16, ga: 17, gd: -1, pts: 14, espnRank: 13, form: ['L','W','D','L','W'] },
        DEP: { espnId: 90, name: "Deportivo La Coruña", short: "DEP", color: "#0055A4", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/90.png", xg: 1.25, xga: 1.38, shots: 12, sot: 4, bigChances: 2, poss: 48, played: 11, gf: 13, ga: 15, gd: -2, pts: 13, espnRank: 14, form: ['W','D','L','W','D'] },
        RAC: { espnId: 3842, name: "Racing Santander", short: "RAC", color: "#009640", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/3842.png", xg: 1.24, xga: 1.46, shots: 11, sot: 4, bigChances: 2, poss: 46, played: 11, gf: 12, ga: 17, gd: -5, pts: 12, espnRank: 15, form: ['W','D','L','W','L'] },
        MAL: { espnId: 99, name: "Málaga CF", short: "MAL", color: "#009EE2", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/99.png", xg: 1.18, xga: 1.34, shots: 11, sot: 4, bigChances: 2, poss: 46, played: 11, gf: 10, ga: 13, gd: -3, pts: 12, espnRank: 16, form: ['D','W','L','D','W'] },
        ALA: { espnId: 96, name: "Deportivo Alavés", short: "ALA", color: "#0057A3", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/96.png", xg: 1.16, xga: 1.42, shots: 11, sot: 4, bigChances: 1, poss: 44, played: 11, gf: 13, ga: 18, gd: -5, pts: 10, espnRank: 17, form: ['L','L','L','W','W'] },
        ESP: { espnId: 88, name: "RCD Espanyol", short: "ESP", color: "#007FC8", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/88.png", xg: 1.14, xga: 1.52, shots: 11, sot: 3, bigChances: 1, poss: 44, played: 11, gf: 10, ga: 19, gd: -9, pts: 10, espnRank: 18, form: ['L','W','L','W','L'] },
        VAL: { espnId: 94, name: "Valencia CF", short: "VAL", color: "#FF6600", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/94.png", xg: 1.15, xga: 1.48, shots: 11, sot: 3, bigChances: 1, poss: 46, played: 11, gf: 9, ga: 16, gd: -7, pts: 10, espnRank: 19, form: ['D','L','D','D','L'] },
        LEV: { espnId: 1538, name: "Levante UD", short: "LEV", color: "#0055A4", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/1538.png", xg: 1.12, xga: 1.54, shots: 10, sot: 3, bigChances: 1, poss: 45, played: 11, gf: 10, ga: 18, gd: -8, pts: 9, espnRank: 20, form: ['L','D','W','L','L'] }
    };

    const uclTeamsData = {
        RMA: { espnId: 86, name: "Real Madrid", short: "RMA", color: "#FEBE10", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png", xg: 2.25, xga: 0.95, shots: 18, sot: 7, bigChances: 4, poss: 60, played: 3, gf: 10, ga: 5, pts: 9, form: ['W','W','W','L','W'] },
        MCI: { espnId: 382, name: "Manchester City", short: "MCI", color: "#6CABDD", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/382.png", xg: 2.30, xga: 0.85, shots: 18, sot: 7, bigChances: 4, poss: 64, played: 3, gf: 9, ga: 2, pts: 9, form: ['W','W','W','L','L'] },
        LIV: { espnId: 364, name: "Liverpool", short: "LIV", color: "#C8102E", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png", xg: 2.12, xga: 0.98, shots: 17, sot: 6, bigChances: 3, poss: 58, played: 3, gf: 8, ga: 4, pts: 9, form: ['W','W','W','W','D'] },
        BET: { espnId: 244, name: "Real Betis", short: "BET", color: "#0BB363", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/244.png", xg: 1.62, xga: 1.05, shots: 14, sot: 5, bigChances: 2, poss: 53, played: 3, gf: 7, ga: 4, pts: 9, form: ['L','W','W','W','D'] },
        DOR: { espnId: 124, name: "Borussia Dortmund", short: "DOR", color: "#FDE100", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/124.png", xg: 1.88, xga: 1.18, shots: 15, sot: 6, bigChances: 3, poss: 55, played: 3, gf: 8, ga: 4, pts: 9, form: ['W','L','L','L','W'] },
        AVL: { espnId: 362, name: "Aston Villa", short: "AVL", color: "#670E36", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/362.png", xg: 1.74, xga: 1.10, shots: 14, sot: 5, bigChances: 3, poss: 53, played: 3, gf: 8, ga: 4, pts: 9, form: ['W','W','D','L','D'] },
        PSG: { espnId: 160, name: "Paris Saint-Germain", short: "PSG", color: "#004170", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/160.png", xg: 2.18, xga: 1.02, shots: 17, sot: 7, bigChances: 4, poss: 62, played: 3, gf: 12, ga: 4, pts: 7, form: ['D','W','W','W','W'] },
        BAY: { espnId: 132, name: "Bayern Munich", short: "BAY", color: "#DC052D", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/132.png", xg: 2.35, xga: 0.98, shots: 19, sot: 7, bigChances: 4, poss: 63, played: 3, gf: 9, ga: 3, pts: 7, form: ['W','D','W','W','W'] },
        ARS: { espnId: 359, name: "Arsenal", short: "ARS", color: "#EF0107", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png", xg: 1.98, xga: 0.86, shots: 16, sot: 6, bigChances: 3, poss: 58, played: 3, gf: 6, ga: 2, pts: 7, form: ['W','D','W','W','D'] },
        STU: { espnId: 134, name: "VfB Stuttgart", short: "STU", color: "#E32219", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/Mb7ftPNxpqXK9QE8744byg_500x500.png", xg: 1.72, xga: 1.08, shots: 15, sot: 5, bigChances: 3, poss: 55, played: 3, gf: 7, ga: 2, pts: 7, form: ['L','D','W','W','D'] },
        PSV: { espnId: 148, name: "PSV Eindhoven", short: "PSV", color: "#ED1C24", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/FylTPR72JXIGFzqwQocSAQ_500x500.png", xg: 1.65, xga: 1.05, shots: 14, sot: 5, bigChances: 2, poss: 54, played: 3, gf: 5, ga: 2, pts: 7, form: ['W','W','W','W','L'] },
        INT: { espnId: 110, name: "Inter Milan", short: "INT", color: "#010E80", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/110.png", xg: 1.85, xga: 0.82, shots: 15, sot: 5, bigChances: 3, poss: 54, played: 3, gf: 5, ga: 2, pts: 6, form: ['W','W','D','W','W'] },
        BAR: { espnId: 83, name: "FC Barcelona", short: "BAR", color: "#A50044", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/83.png", xg: 2.28, xga: 1.04, shots: 17, sot: 7, bigChances: 4, poss: 63, played: 3, gf: 9, ga: 6, pts: 6, form: ['W','W','L','W','W'] },
        COM: { espnId: 2572, name: "Como 1907", short: "COM", color: "#0055A4", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/13phr148I8nZgDiw1df0dQ_500x500.png", xg: 1.60, xga: 1.18, shots: 14, sot: 5, bigChances: 2, poss: 53, played: 3, gf: 9, ga: 4, pts: 6, form: ['D','W','L','L','D'] },
        GAL: { espnId: 432, name: "Galatasaray", short: "GAL", color: "#FDB912", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/XjWqAG8vQD_B6ffzIOan6g_500x500.png", xg: 1.68, xga: 1.32, shots: 15, sot: 5, bigChances: 3, poss: 54, played: 3, gf: 7, ga: 6, pts: 6, form: ['W','W','W','W','W'] },
        NAP: { espnId: 114, name: "SSC Napoli", short: "NAP", color: "#008FD7", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/ueX_32AIja-hLmJSHpUuFg_500x500.png", xg: 1.76, xga: 1.12, shots: 15, sot: 5, bigChances: 3, poss: 55, played: 3, gf: 6, ga: 5, pts: 6, form: ['W','W','W','W','L'] },
        BRU: { espnId: 570, name: "Club Brugge", short: "BRU", color: "#0055A4", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/5FQBXpID1LAQJb0BOnmTpw_500x500.png", xg: 1.48, xga: 1.24, shots: 13, sot: 5, bigChances: 2, poss: 49, played: 3, gf: 6, ga: 4, pts: 6, form: ['W','L','W','W','W'] },
        LASK: { espnId: 3732, name: "LASK Linz", short: "LASK", color: "#000000", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/qq1stza-ORAmIqpXD-IaUA_500x500.png", xg: 1.35, xga: 1.32, shots: 12, sot: 4, bigChances: 2, poss: 47, played: 3, gf: 5, ga: 4, pts: 6, form: ['W','W','L','W','D'] },
        ROM: { espnId: 104, name: "AS Roma", short: "ROM", color: "#8E1F2F", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/BQdP4jUBFJfG7U_JBsFIMg_500x500.png", xg: 1.68, xga: 1.18, shots: 14, sot: 5, bigChances: 3, poss: 54, played: 3, gf: 8, ga: 5, pts: 4, form: ['L','W','L','W','L'] },
        SHK: { espnId: 493, name: "Shakhtar Donetsk", short: "SHK", color: "#FF6600", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/3rx1dndeeE1gb97w6et-GA_500x500.png", xg: 1.36, xga: 1.28, shots: 12, sot: 4, bigChances: 2, poss: 49, played: 3, gf: 4, ga: 3, pts: 4, form: ['W','L','D','W','W'] },
        ATM: { espnId: 1068, name: "Atlético Madrid", short: "ATM", color: "#CB3524", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png", xg: 1.68, xga: 1.02, shots: 14, sot: 5, bigChances: 2, poss: 51, played: 3, gf: 4, ga: 4, pts: 4, form: ['W','D','L','W','W'] },
        SCP: { espnId: 2250, name: "Sporting CP", short: "SCP", color: "#008057", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/-PPQu5xhZzd2nn2VwEaXFg_500x500.png", xg: 1.72, xga: 1.15, shots: 15, sot: 5, bigChances: 3, poss: 56, played: 3, gf: 6, ga: 5, pts: 3, form: ['W','L','W','W','W'] },
        MUN: { espnId: 360, name: "Manchester United", short: "MUN", color: "#DA291C", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/360.png", xg: 1.48, xga: 1.42, shots: 13, sot: 5, bigChances: 2, poss: 52, played: 3, gf: 6, ga: 6, pts: 3, form: ['L','D','L','L','L'] },
        LEN: { espnId: 175, name: "RC Lens", short: "LEN", color: "#EC1C24", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/TUvwItKazVFpgThEhhlN1Q_500x500.png", xg: 1.38, xga: 1.34, shots: 13, sot: 4, bigChances: 2, poss: 49, played: 3, gf: 4, ga: 6, pts: 3, form: ['D','W','L','L','L'] },
        AEK: { espnId: 887, name: "AEK Athens", short: "AEK", color: "#FDE100", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/AsO4CJclxhZUbsowELZRTw_500x500.png", xg: 1.25, xga: 1.58, shots: 11, sot: 4, bigChances: 1, poss: 46, played: 3, gf: 3, ga: 8, pts: 3, form: ['D','L','L','W','W'] },
        FEY: { espnId: 142, name: "Feyenoord", short: "FEY", color: "#E30613", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/36g41WN3WdjCRsSFiurazw_500x500.png", xg: 1.45, xga: 1.36, shots: 13, sot: 4, bigChances: 2, poss: 52, played: 3, gf: 4, ga: 7, pts: 3, form: ['W','L','W','L','W'] },
        POR: { espnId: 437, name: "FC Porto", short: "POR", color: "#0055A4", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/QkkllEKwkj60jEVtOEZWAg_500x500.png", xg: 1.56, xga: 1.20, shots: 14, sot: 5, bigChances: 2, poss: 54, played: 3, gf: 2, ga: 4, pts: 3, form: ['W','L','W','W','W'] },
        RBL: { espnId: 11420, name: "RB Leipzig", short: "RBL", color: "#DD0741", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/R7-Lqc_SDxd97uWgoeUQ-g_500x500.png", xg: 1.58, xga: 1.42, shots: 14, sot: 5, bigChances: 2, poss: 52, played: 3, gf: 4, ga: 9, pts: 3, form: ['W','L','W','W','L'] },
        VIL: { espnId: 102, name: "Villarreal CF", short: "VIL", color: "#FFE667", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/102.png", xg: 1.62, xga: 1.38, shots: 14, sot: 5, bigChances: 2, poss: 50, played: 3, gf: 6, ga: 8, pts: 3, form: ['D','L','W','W','W'] },
        LIL: { espnId: 166, name: "LOSC Lille", short: "LIL", color: "#E01E13", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/D2AQe8qoyPIP4K8MzLvwuA_500x500.png", xg: 1.46, xga: 1.35, shots: 13, sot: 4, bigChances: 2, poss: 51, played: 3, gf: 5, ga: 8, pts: 3, form: ['D','L','W','W','D'] },
        FEN: { espnId: 436, name: "Fenerbahçe SK", short: "FEN", color: "#002B5C", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/am1hqNcHXX7QHNzqOjT6qw_500x500.png", xg: 1.44, xga: 1.34, shots: 13, sot: 4, bigChances: 2, poss: 51, played: 3, gf: 4, ga: 5, pts: 2, form: ['D','D','D','W','W'] },
        SLA: { espnId: 494, name: "Slavia Prague", short: "SLA", color: "#E30613", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/gfoznySB_HVFREKTmomtlg_500x500.png", xg: 1.32, xga: 1.45, shots: 12, sot: 4, bigChances: 2, poss: 48, played: 3, gf: 5, ga: 7, pts: 1, form: ['W','D','W','W','D'] },
        BOD: { espnId: 2980, name: "FK Bodø/Glimt", short: "BOD", color: "#FFD700", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/LP_MW8fDEgJarq60qjdyvA_500x500.png", xg: 1.34, xga: 1.56, shots: 12, sot: 4, bigChances: 2, poss: 49, played: 3, gf: 4, ga: 10, pts: 1, form: ['D','L','W','L','D'] },
        VIK: { espnId: 910, name: "Viking FK", short: "VIK", color: "#002B5C", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/1z47bdpzXrZK9K4wu-8MVw_500x500.png", xg: 1.18, xga: 1.62, shots: 11, sot: 3, bigChances: 1, poss: 45, played: 3, gf: 3, ga: 8, pts: 0, form: ['D','L','W','W','W'] },
        SLO: { espnId: 527, name: "Slovan Bratislava", short: "SLO", color: "#0095D9", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/At_RY6yVgrmSW0hTKQ6X6Q_500x500.png", xg: 1.05, xga: 1.85, shots: 9, sot: 3, bigChances: 1, poss: 41, played: 3, gf: 1, ga: 13, pts: 0, form: ['W','L','W','W','W'] },
        SAB: { espnId: 21580, name: "Sabah FK", short: "SAB", color: "#4B2E83", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/v6mEQSNxXxroXdqhpR3rdQ_500x500.png", xg: 1.08, xga: 1.78, shots: 10, sot: 3, bigChances: 1, poss: 43, played: 3, gf: 1, ga: 9, pts: 0, form: ['D','L','D','W','D'] }
    };

    // PURGED LA LIGA SEED FIXTURES: La Liga starts empty (`LALIGA: []`) so it is 100% populated from the live ESPN API!
    const leagueFixturesData = {
        PL: [
            { round: 'MW9', homeCode: 'NEW', awayCode: 'EVE', shortLabel: 'NEW 0-1 EVE', utcIso: '2026-11-02T20:00:00Z', status: 'FT', hScore: 0, aScore: 1, name: 'NEW 0 - 1 EVE (MW9 FT)', homeShots: 14, homeSot: 4, awayShots: 11, awaySot: 5, homePoss: 54 },
            { round: 'MW9', homeCode: 'LIV', awayCode: 'ARS', shortLabel: 'LIV 2-1 ARS', utcIso: '2026-11-01T16:30:00Z', status: 'FT', hScore: 2, aScore: 1, name: 'LIV 2 - 1 ARS (MW9 FT)', homeShots: 16, homeSot: 6, awayShots: 13, awaySot: 4, homePoss: 53 },
            { round: 'MW10', featured: true, homeCode: 'EVE', awayCode: 'COV', shortLabel: '⭐ EVE vs COV', utcIso: '2026-11-06T20:00:00Z', status: 'MW10', name: '⭐ EVE vs COV (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', featured: true, homeCode: 'LEE', awayCode: 'TOT', shortLabel: '⭐ LEE vs TOT', utcIso: '2026-11-07T12:30:00Z', status: 'MW10', name: '⭐ LEE vs TOT (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', featured: true, homeCode: 'ARS', awayCode: 'HUL', shortLabel: '⭐ ARS vs HUL', utcIso: '2026-11-07T15:00:00Z', status: 'MW10', name: '⭐ ARS vs HUL (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'FUL', awayCode: 'NEW', shortLabel: 'FUL vs NEW', utcIso: '2026-11-07T15:00:00Z', status: 'MW10', name: 'FUL vs NEW (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', featured: true, homeCode: 'NFO', awayCode: 'MCI', shortLabel: '⭐ NFO vs MCI', utcIso: '2026-11-07T17:30:00Z', status: 'MW10', name: '⭐ NFO vs MCI (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'BHA', awayCode: 'BRE', shortLabel: 'BHA vs BRE', utcIso: '2026-11-08T14:00:00Z', status: 'MW10', name: 'BHA vs BRE (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', featured: true, homeCode: 'CRY', awayCode: 'LIV', shortLabel: '⭐ CRY vs LIV', utcIso: '2026-11-08T14:00:00Z', status: 'MW10', name: '⭐ CRY vs LIV (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'IPS', awayCode: 'BOU', shortLabel: 'IPS vs BOU', utcIso: '2026-11-08T14:00:00Z', status: 'MW10', name: 'IPS vs BOU (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', featured: true, homeCode: 'SUN', awayCode: 'CHE', shortLabel: '⭐ SUN vs CHE', utcIso: '2026-11-08T14:00:00Z', status: 'MW10', name: '⭐ SUN vs CHE (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', featured: true, homeCode: 'MUN', awayCode: 'AVL', shortLabel: '⭐ MUN vs AVL', utcIso: '2026-11-08T16:30:00Z', status: 'MW10', name: '⭐ MUN vs AVL (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 }
        ],
        LALIGA: [],
        UCL: [
            { round: 'UCL4', homeCode: 'GAL', awayCode: 'STU', shortLabel: 'GAL 2-1 STU', utcIso: '2026-11-03T17:45:00Z', status: 'FT', hScore: 2, aScore: 1, name: 'GAL 2 - 1 STU (UCL MD4 FT)', homeShots: 14, homeSot: 5, awayShots: 11, awaySot: 4, homePoss: 52 },
            { round: 'UCL4', homeCode: 'SHK', awayCode: 'SCP', shortLabel: 'SHK 1-2 SCP', utcIso: '2026-11-03T17:45:00Z', status: 'FT', hScore: 1, aScore: 2, name: 'SHK 1 - 2 SCP (UCL MD4 FT)', homeShots: 10, homeSot: 3, awayShots: 15, awaySot: 6, homePoss: 46 },
            { round: 'UCL4', featured: true, homeCode: 'ATM', awayCode: 'BAY', shortLabel: 'ATM 1-1 BAY', utcIso: '2026-11-03T20:00:00Z', status: 'FT', hScore: 1, aScore: 1, name: 'ATM 1 - 1 BAY (UCL MD4 FT)', homeShots: 12, homeSot: 4, awayShots: 16, awaySot: 6, homePoss: 43 },
            { round: 'UCL4', featured: true, homeCode: 'BAR', awayCode: 'AVL', shortLabel: 'BAR 3-1 AVL', utcIso: '2026-11-03T20:00:00Z', status: 'FT', hScore: 3, aScore: 1, name: 'BAR 3 - 1 AVL (UCL MD4 FT)', homeShots: 18, homeSot: 7, awayShots: 9, awaySot: 3, homePoss: 63 },
            { round: 'UCL4', featured: true, homeCode: 'VIL', awayCode: 'PSG', shortLabel: 'VIL 1-2 PSG', utcIso: '2026-11-03T20:00:00Z', status: 'FT', hScore: 1, aScore: 2, name: 'VIL 1 - 2 PSG (UCL MD4 FT)', homeShots: 11, homeSot: 4, awayShots: 17, awaySot: 7, homePoss: 41 },
            { round: 'UCL4', featured: true, homeCode: 'MUN', awayCode: 'ROM', shortLabel: 'MUN 2-1 ROM', utcIso: '2026-11-03T20:00:00Z', status: 'FT', hScore: 2, aScore: 1, name: 'MUN 2 - 1 ROM (UCL MD4 FT)', homeShots: 15, homeSot: 5, awayShots: 12, awaySot: 4, homePoss: 54 },
            { round: 'UCL4', featured: true, homeCode: 'FEY', awayCode: 'INT', shortLabel: 'FEY 0-2 INT', utcIso: '2026-11-03T20:00:00Z', status: 'FT', hScore: 0, aScore: 2, name: 'FEY 0 - 2 INT (UCL MD4 FT)', homeShots: 9, homeSot: 2, awayShots: 14, awaySot: 6, homePoss: 47 },
            { round: 'UCL4', homeCode: 'BOD', awayCode: 'LIL', shortLabel: 'BOD 1-1 LIL', utcIso: '2026-11-03T20:00:00Z', status: 'FT', hScore: 1, aScore: 1, name: 'BOD 1 - 1 LIL (UCL MD4 FT)', homeShots: 11, homeSot: 4, awayShots: 12, awaySot: 4, homePoss: 49 },
            { round: 'UCL4', homeCode: 'LASK', awayCode: 'SLO', shortLabel: 'LASK 2-0 SLO', utcIso: '2026-11-03T20:00:00Z', status: 'FT', hScore: 2, aScore: 0, name: 'LASK 2 - 0 SLO (UCL MD4 FT)', homeShots: 14, homeSot: 5, awayShots: 7, awaySot: 2, homePoss: 56 },
            { round: 'UCL4', featured: true, homeCode: 'FEN', awayCode: 'LIV', shortLabel: '⭐ FEN vs LIV', utcIso: '2026-11-04T17:45:00Z', status: 'UCL4', name: '⭐ FEN vs LIV (UCL MD4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', featured: true, homeCode: 'AEK', awayCode: 'RMA', shortLabel: '⭐ AEK vs RMA', utcIso: '2026-11-04T17:45:00Z', status: 'UCL4', name: '⭐ AEK vs RMA (UCL MD4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', featured: true, homeCode: 'RBL', awayCode: 'MCI', shortLabel: '⭐ RBL vs MCI', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: '⭐ RBL vs MCI (UCL MD4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', featured: true, homeCode: 'DOR', awayCode: 'BET', shortLabel: '⭐ DOR vs BET', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: '⭐ DOR vs BET (UCL MD4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', featured: true, homeCode: 'SLA', awayCode: 'ARS', shortLabel: '⭐ SLA vs ARS', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: '⭐ SLA vs ARS (UCL MD4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'POR', awayCode: 'NAP', shortLabel: 'POR vs NAP', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: 'POR vs NAP (UCL MD4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'PSV', awayCode: 'BRU', shortLabel: 'PSV vs BRU', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: 'PSV vs BRU (UCL MD4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'LEN', awayCode: 'COM', shortLabel: 'LEN vs COM', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: 'LEN vs COM (UCL MD4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'VIK', awayCode: 'SAB', shortLabel: 'VIK vs SAB', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: 'VIK vs SAB (UCL MD4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 }
        ]
    };

    const topClubs = new Set(['MCI', 'ARS', 'LIV', 'CHE', 'TOT', 'NEW', 'BAR', 'RMA', 'ATM', 'BAY', 'INT', 'PSG', 'AVL', 'VIL', 'DOR', 'EVE', 'RSO', 'BET', 'ATH', 'SEV', 'MAL', 'RAC', 'DEP', 'ESP']);

    function sortFixturesChronologically(list) {
        return [...list].sort((a, b) => {
            const tA = a.utcIso ? new Date(a.utcIso).getTime() : Number.MAX_SAFE_INTEGER;
            const tB = b.utcIso ? new Date(b.utcIso).getTime() : Number.MAX_SAFE_INTEGER;
            if (tA !== tB) return tA - tB;
            if ((b.featured ? 1 : 0) !== (a.featured ? 1 : 0)) {
                return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            }
            return (a.homeCode || '').localeCompare(b.homeCode || '');
        });
    }

    function parseFormString(str) {
        if (!str || typeof str !== 'string') return null;
        const cleaned = str.toUpperCase().replace(/[^WDL]/g, '').slice(-5);
        if (cleaned.length !== 5) return null;
        return cleaned.split('');
    }

    function matchTeamNameToCode(rawName) {
        if (!rawName) return null;
        const n = rawName.toLowerCase();
        if (n.includes('villarreal')) return 'VIL';
        if (n.includes('aston villa')) return 'AVL';
        if (n.includes('manchester city') || n.includes('man city')) return 'MCI';
        if (n.includes('arsenal')) return 'ARS';
        if (n.includes('brighton')) return 'BHA';
        if (n.includes('chelsea')) return 'CHE';
        if (n.includes('liverpool')) return 'LIV';
        if (n.includes('tottenham') || n.includes('spurs')) return 'TOT';
        if (n.includes('newcastle')) return 'NEW';
        if (n.includes('bournemouth')) return 'BOU';
        if (n.includes('brentford')) return 'BRE';
        if (n.includes('fulham')) return 'FUL';
        if (n.includes('nottingham') || n.includes('forest')) return 'NFO';
        if (n.includes('coventry')) return 'COV';
        if (n.includes('everton')) return 'EVE';
        if (n.includes('leeds')) return 'LEE';
        if (n.includes('crystal palace') || n.includes('palace')) return 'CRY';
        if (n.includes('manchester united') || n.includes('man united') || n.includes('man utd')) return 'MUN';
        if (n.includes('hull')) return 'HUL';
        if (n.includes('ipswich')) return 'IPS';
        if (n.includes('sunderland')) return 'SUN';
        if (n.includes('wolverhampton') || n.includes('wolves')) return 'WOL';
        if (n.includes('west ham')) return 'WHU';
        if (n.includes('leicester')) return 'LEI';
        if (n.includes('southampton')) return 'SOU';
        if (n.includes('burnley')) return 'BUR';
        if (n.includes('sheffield')) return 'SHU';
        if (n.includes('barcelona') || n.includes('barça')) return 'BAR';
        if (n.includes('real madrid')) return 'RMA';
        if (n.includes('atletico') || n.includes('atlético')) return 'ATM';
        if (n.includes('athletic')) return 'ATH';
        if (n.includes('betis')) return 'BET';
        if (n.includes('osasuna')) return 'OSA';
        if (n.includes('sociedad')) return 'RSO';
        if (n.includes('sevilla')) return 'SEV';
        if (n.includes('girona')) return 'GIR';
        if (n.includes('valencia')) return 'VAL';
        if (n.includes('valladolid')) return 'VLL';
        if (n.includes('racing') || n.includes('santander')) return 'RAC';
        if (n.includes('malaga') || n.includes('málaga')) return 'MAL';
        if (n.includes('alaves') || n.includes('alavés')) return 'ALA';
        if (n.includes('deportivo') || n.includes('coruna') || n.includes('coruña')) return 'DEP';
        if (n.includes('castellon') || n.includes('castellón')) return 'CAS';
        if (n.includes('cordoba') || n.includes('córdoba')) return 'COR';
        if (n.includes('almeria') || n.includes('almería')) return 'ALM';
        if (n.includes('granada')) return 'GRA';
        if (n.includes('cadiz') || n.includes('cádiz')) return 'CAD';
        if (n.includes('zaragoza')) return 'ZAR';
        if (n.includes('celta')) return 'CEL';
        if (n.includes('mallorca')) return 'MLL';
        if (n.includes('rayo') || n.includes('vallecano')) return 'RAY';
        if (n.includes('getafe')) return 'GET';
        if (n.includes('espanyol')) return 'ESP';
        if (n.includes('leganes') || n.includes('leganés')) return 'LEG';
        if (n.includes('las palmas')) return 'LPA';
        if (n.includes('oviedo')) return 'OVI';
        if (n.includes('levante')) return 'LEV';
        if (n.includes('elche')) return 'ELC';
        if (n.includes('bayern')) return 'BAY';
        if (n.includes('inter') || n.includes('internazionale')) return 'INT';
        if (n.includes('paris') || n.includes('psg')) return 'PSG';
        if (n.includes('dortmund')) return 'DOR';
        if (n.includes('stuttgart')) return 'STU';
        if (n.includes('psv')) return 'PSV';
        if (n.includes('como')) return 'COM';
        if (n.includes('galatasaray')) return 'GAL';
        if (n.includes('napoli')) return 'NAP';
        if (n.includes('brugge')) return 'BRU';
        if (n.includes('lask')) return 'LASK';
        if (n.includes('roma')) return 'ROM';
        if (n.includes('shakhtar')) return 'SHK';
        if (n.includes('sporting')) return 'SCP';
        if (n.includes('lens')) return 'LEN';
        if (n.includes('aek')) return 'AEK';
        if (n.includes('feyenoord')) return 'FEY';
        if (n.includes('porto')) return 'POR';
        if (n.includes('leipzig')) return 'RBL';
        if (n.includes('lille')) return 'LIL';
        if (n.includes('fenerbahce') || n.includes('fenerbahçe')) return 'FEN';
        if (n.includes('slavia')) return 'SLA';
        if (n.includes('bodo') || n.includes('bodø') || n.includes('glimt')) return 'BOD';
        if (n.includes('viking')) return 'VIK';
        if (n.includes('slovan') || n.includes('bratislava')) return 'SLO';
        if (n.includes('sabah')) return 'SAB';
        return null;
    }

    function resolveOrRegisterTeamFromESPN(teamObj, targetTeamsMap, allowRegisterNew = true) {
        if (!teamObj) return null;
        const rawName = teamObj.displayName || teamObj.name || '';
        let code = matchTeamNameToCode(rawName);
        if (!code && teamObj.abbreviation) {
            code = teamObj.abbreviation.toUpperCase().slice(0, 4);
        }
        if (!code) {
            code = rawName.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3) || 'CLB';
        }
        if (!targetTeamsMap[code]) {
            if (!allowRegisterNew) return null;
            targetTeamsMap[code] = {
                espnId: teamObj.id ? Number(teamObj.id) : null,
                name: rawName || code,
                short: code,
                color: teamObj.color ? `#${teamObj.color}` : '#00ff85',
                logo: teamObj.logos?.[0]?.href || teamObj.logo || '',
                xg: 1.38,
                xga: 1.35,
                shots: 12,
                sot: 4,
                bigChances: 2,
                poss: 50,
                played: 11,
                gf: 12,
                ga: 13,
                pts: 12,
                form: ['W', 'D', 'L', 'D', 'W']
            };
        } else {
            if (teamObj.id) targetTeamsMap[code].espnId = Number(teamObj.id);
            if (teamObj.logos?.[0]?.href) targetTeamsMap[code].logo = teamObj.logos[0].href;
            else if (teamObj.logo) targetTeamsMap[code].logo = teamObj.logo;
            if (rawName) targetTeamsMap[code].name = rawName;
        }
        return code;
    }

    function ensureCompleteRoundMatches(primaryMatches, seedMatches, targetTeams, roundCode, matchesPerRound = 10, allowSyntheticFill = false) {
        const result = [];
        const usedClubs = new Set();

        (primaryMatches || []).forEach(fix => {
            if (!fix || !fix.homeCode || !fix.awayCode) return;
            if (result.length >= matchesPerRound) return;
            if (!usedClubs.has(fix.homeCode) && !usedClubs.has(fix.awayCode)) {
                result.push({ ...fix, round: roundCode });
                usedClubs.add(fix.homeCode);
                usedClubs.add(fix.awayCode);
            }
        });

        (seedMatches || []).forEach(seedFix => {
            if (result.length >= matchesPerRound) return;
            if (!seedFix || !seedFix.homeCode || !seedFix.awayCode) return;
            if (targetTeams[seedFix.homeCode] && targetTeams[seedFix.awayCode]) {
                if (!usedClubs.has(seedFix.homeCode) && !usedClubs.has(seedFix.awayCode)) {
                    result.push({ ...seedFix, round: roundCode });
                    usedClubs.add(seedFix.homeCode);
                    usedClubs.add(seedFix.awayCode);
                }
            }
        });

        if (allowSyntheticFill && result.length < matchesPerRound) {
            const unusedClubCodes = Object.keys(targetTeams).filter(code => !usedClubs.has(code));
            let slotIdx = 0;
            for (let i = 0; i + 1 < unusedClubCodes.length && result.length < matchesPerRound; i += 2) {
                const hCode = unusedClubCodes[i];
                const aCode = unusedClubCodes[i + 1];
                const isFeatured = topClubs.has(hCode) || topClubs.has(aCode);
                const fallbackSlots = [
                    '2026-11-07T15:15:00Z',
                    '2026-11-09T20:00:00Z',
                    '2026-11-08T13:00:00Z',
                    '2026-11-08T15:15:00Z'
                ];
                const utcIso = fallbackSlots[slotIdx % fallbackSlots.length];
                slotIdx++;

                const shortLabel = `${isFeatured ? '⭐ ' : ''}${hCode} vs ${aCode}`;
                result.push({
                    round: roundCode,
                    featured: isFeatured,
                    homeCode: hCode,
                    awayCode: aCode,
                    shortLabel,
                    utcIso,
                    status: roundCode,
                    name: `${shortLabel} (${roundCode})`,
                    homeShots: 0,
                    homeSot: 0,
                    awayShots: 0,
                    awaySot: 0,
                    homePoss: 0
                });
                usedClubs.add(hCode);
                usedClubs.add(aCode);
            }
        }

        return sortFixturesChronologically(result);
    }

    const FootballDB = {
        DB_VERSION: '2026.11.v33.espn_38gw_exact',
        STORAGE_KEY: 'football_prediction_engine_espn_db_v33',
        state: null,
        lastRawESPNFixtureSample: null,
        leagueConfigs,
        plTeamsData,
        laLigaTeamsData,
        uclTeamsData,
        leagueFixturesData,
        sortFixturesChronologically,
        ensureCompleteRoundMatches,
        matchTeamNameToCode,
        resolveOrRegisterTeamFromESPN,
        parseFormString,

        buildStandingsSnapshot(teamsObj) {
            const codes = Object.keys(teamsObj);
            const totalTeams = Math.max(2, codes.length);
            const rows = codes.map(code => {
                const t = teamsObj[code];
                const played = Math.max(1, t.played || 1);
                const gf = t.gf ?? Math.round(t.xg * played);
                const ga = t.ga ?? Math.round(t.xga * played);
                const gd = (t.gd !== undefined) ? t.gd : (gf - ga);
                const pts = t.pts ?? Math.round(played * 1.4);
                const ppg = Number((pts / played).toFixed(2));
                const espnRank = t.espnRank ? Number(t.espnRank) : null;
                return { code, name: t.name, played, gf, ga, gd, pts, ppg, espnRank, xg: t.xg, form: t.form };
            }).sort((a, b) => {
                if (a.espnRank !== null && b.espnRank !== null && a.espnRank !== b.espnRank) {
                    return a.espnRank - b.espnRank;
                }
                if (b.pts !== a.pts) return b.pts - a.pts;
                if (b.gd !== a.gd) return b.gd - a.gd;
                if (b.gf !== a.gf) return b.gf - a.gf;
                return (b.xg || 0) - (a.xg || 0);
            });

            rows.forEach((r, idx) => {
                const rank = r.espnRank || (idx + 1);
                r.rank = rank;
                const rankPct = (totalTeams - idx) / Math.max(1, totalTeams - 1);
                const ppgNorm = Math.min(1, r.ppg / 2.6);
                r.strengthIndex = Math.round((rankPct * 65 + ppgNorm * 35));

                if (teamsObj[r.code]) {
                    teamsObj[r.code].rank = rank;
                    teamsObj[r.code].gd = r.gd;
                    teamsObj[r.code].ppg = r.ppg;
                    teamsObj[r.code].strengthIndex = r.strengthIndex;
                }
            });

            return rows;
        },

        init() {
            try {
                const raw = localStorage.getItem(this.STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed && parsed.version === this.DB_VERSION && parsed.leagues) {
                        this.state = parsed;
                        return;
                    }
                }
            } catch (e) {}

            const plCopy = JSON.parse(JSON.stringify(plTeamsData));
            const laLigaCopy = JSON.parse(JSON.stringify(laLigaTeamsData));
            const uclCopy = JSON.parse(JSON.stringify(uclTeamsData));

            this.state = {
                version: this.DB_VERSION,
                leagues: {
                    PL: {
                        teams: plCopy,
                        standings: this.buildStandingsSnapshot(plCopy),
                        fixtures: [...leagueFixturesData.PL],
                        fullSeasonSeededFromESPN: false,
                        formSeededFromESPN: false,
                        lastSyncedAt: new Date().toISOString()
                    },
                    LALIGA: {
                        teams: laLigaCopy,
                        standings: this.buildStandingsSnapshot(laLigaCopy),
                        fixtures: [...leagueFixturesData.LALIGA],
                        fullSeasonSeededFromESPN: false,
                        formSeededFromESPN: false,
                        lastSyncedAt: new Date().toISOString()
                    },
                    UCL: {
                        teams: uclCopy,
                        standings: this.buildStandingsSnapshot(uclCopy),
                        fixtures: [...leagueFixturesData.UCL],
                        fullSeasonSeededFromESPN: false,
                        formSeededFromESPN: false,
                        lastSyncedAt: new Date().toISOString()
                    }
                }
            };
            this.save();
        },

        save() {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
            } catch (e) {}
        },

        getLeague(leagueKey) {
            if (!this.state) this.init();
            return this.state.leagues[leagueKey];
        },

        getRoundFixtures(leagueKey, roundCode) {
            const league = this.getLeague(leagueKey);
            if (!league || !league.fixtures) return [];
            return sortFixturesChronologically(league.fixtures.filter(f => f.round === roundCode));
        },

        saveLeague(leagueKey, teamsObj, fixturesArr, markSeeded = true) {
            if (!this.state) this.init();
            const prev = this.state.leagues[leagueKey] || {};
            const teamsCopy = JSON.parse(JSON.stringify(teamsObj));
            const standingsSnapshot = this.buildStandingsSnapshot(teamsCopy);
            this.state.leagues[leagueKey] = {
                teams: teamsCopy,
                standings: standingsSnapshot,
                fixtures: JSON.parse(JSON.stringify(fixturesArr)),
                fullSeasonSeededFromESPN: markSeeded ? true : (prev.fullSeasonSeededFromESPN || false),
                formSeededFromESPN: prev.formSeededFromESPN || false,
                lastSyncedAt: new Date().toISOString()
            };
            this.save();
        },

        /**
         * Purges cached fixtures for a specific league & round (or entire league) before fresh ESPN ingestion
         */
        purgeLeagueFixtures(leagueKey, roundCode = null) {
            if (!this.state) this.init();
            const lg = this.state.leagues[leagueKey];
            if (!lg) return;
            if (roundCode) {
                lg.fixtures = (lg.fixtures || []).filter(f => f.round !== roundCode);
            } else {
                lg.fixtures = [];
            }
            lg.fullSeasonSeededFromESPN = false;
            this.save();
        },

        /**
         * AUTHORITATIVE ESPN API → FOOTBALLDB INGESTION ENGINE (`FootballDB.syncFromESPN`)
         * Step 1: Purges any stale/fallback fixtures when syncing from ESPN.
         * Step 2: Downloads official 20-club table from `/standings`.
         * Step 3: Downloads all 20 clubs' 38-match schedules from `/teams/{id}/schedule` AND
         *         assigns each club's N-th chronological league match (`idx + 1`) to Round `N` (`MD1`..`MD38`),
         *         plus identifies each club's immediate next unplayed match for the active Matchday!
         * Step 4: Downloads active `/scoreboard` to pin current Matchday live status & times.
         * Step 5: Persists everything into `FootballDB` (`localStorage` + exportable `football_db.js`).
         */
        async syncFromESPN(leagueKey, forceRefresh = false) {
            const dbLeague = this.getLeague(leagueKey);
            if (!dbLeague) return null;

            const cfg = leagueConfigs[leagueKey];
            let activeRound = cfg.activeRound;
            const cachedRoundMatches = (dbLeague.fixtures || []).filter(f => f.round === activeRound);

            if (dbLeague.fullSeasonSeededFromESPN && !forceRefresh && cachedRoundMatches.length >= cfg.matchesPerRound) {
                return {
                    teams: dbLeague.teams,
                    fixtures: dbLeague.fixtures,
                    activeRound,
                    fromCache: true
                };
            }

            // PURGE FIRST: Clear stale fixtures for La Liga (or when forceRefresh is triggered) before writing from ESPN
            if (leagueKey === 'LALIGA' || forceRefresh) {
                this.purgeLeagueFixtures(leagueKey);
            }

            let targetTeams = JSON.parse(JSON.stringify(dbLeague.teams));
            const espnIdToCode = {};
            const abbrToCode = {};
            Object.keys(targetTeams).forEach(c => {
                if (targetTeams[c]?.espnId) espnIdToCode[String(targetTeams[c].espnId)] = c;
                abbrToCode[c.toUpperCase()] = c;
            });

            // STEP 1: Fetch Official 20-Club Standings from ESPN API into Database Layer
            try {
                const standingsRes = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${cfg.espnSlug}/standings`);
                if (standingsRes.ok) {
                    const standingsData = await standingsRes.json();
                    const rawEntries = standingsData?.children?.[0]?.standings?.entries || standingsData?.standings?.entries || [];
                    const maxAllowed = cfg.maxTeams || 20;
                    const entries = rawEntries.slice(0, maxAllowed);

                    if (entries.length >= Math.min(18, maxAllowed)) {
                        const freshTeams = {};
                        const freshIdMap = {};
                        const freshAbbrMap = {};

                        entries.forEach((entry, idx) => {
                            const teamIdStr = entry.team?.id ? String(entry.team.id) : null;
                            let code = (teamIdStr && espnIdToCode[teamIdStr]) ? espnIdToCode[teamIdStr] : null;
                            if (!code) {
                                code = resolveOrRegisterTeamFromESPN(entry.team, {});
                            }
                            if (!code) return;

                            if (freshTeams[code]) {
                                const altAbbr = (entry.team?.abbreviation || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
                                code = (altAbbr && !freshTeams[altAbbr]) ? altAbbr : `${code.slice(0, 2)}${idx + 1}`;
                            }

                            const baseClub = targetTeams[code] || plTeamsData[code] || laLigaTeamsData[code] || uclTeamsData[code] || {};
                            freshTeams[code] = JSON.parse(JSON.stringify(baseClub));
                            if (entry.team?.id) {
                                freshTeams[code].espnId = Number(entry.team.id);
                                freshIdMap[String(entry.team.id)] = code;
                            }
                            if (entry.team?.abbreviation) {
                                freshAbbrMap[entry.team.abbreviation.toUpperCase()] = code;
                            }
                            freshAbbrMap[code.toUpperCase()] = code;

                            if (entry.team?.displayName || entry.team?.name) freshTeams[code].name = entry.team.displayName || entry.team.name;
                            if (entry.team?.logos?.[0]?.href) freshTeams[code].logo = entry.team.logos[0].href;
                            freshTeams[code].short = code;
                            freshTeams[code].color = freshTeams[code].color || (entry.team?.color ? `#${entry.team.color}` : '#00ff85');

                            const stats = {};
                            (entry.stats || []).forEach(s => {
                                if (s.name) stats[s.name] = s.value ?? Number(s.displayValue);
                                if (s.type) stats[s.type] = s.value ?? Number(s.displayValue);
                                if (s.abbreviation) stats[s.abbreviation] = s.value ?? Number(s.displayValue);
                            });

                            const gp = Math.max(1, Number(stats.gamesPlayed ?? stats.GP ?? freshTeams[code].played ?? 1));
                            const gf = Number(stats.pointsFor ?? stats.F ?? freshTeams[code].gf ?? 0);
                            const ga = Number(stats.pointsAgainst ?? stats.A ?? freshTeams[code].ga ?? 0);
                            const gd = Number(stats.pointDifferential ?? stats.GD ?? (gf - ga));
                            const pts = Number(stats.points ?? stats.P ?? freshTeams[code].pts ?? 0);
                            const officialRank = Number(stats.rank ?? entry.note?.rank ?? (idx + 1));

                            const gfPerGame = gf / gp;
                            const gaPerGame = ga / gp;

                            freshTeams[code].xg = Number(Math.max(0.75, Math.min(2.8, (gfPerGame * 0.78) + ((freshTeams[code].xg || 1.35) * 0.22))).toFixed(2));
                            freshTeams[code].xga = Number(Math.max(0.65, Math.min(2.4, (gaPerGame * 0.78) + ((freshTeams[code].xga || 1.35) * 0.22))).toFixed(2));
                            freshTeams[code].shots = Math.max(8, Math.min(20, Math.round(freshTeams[code].xg * 7.8)));
                            freshTeams[code].sot = Math.max(2, Math.min(9, Math.round(freshTeams[code].xg * 2.9)));
                            freshTeams[code].bigChances = Math.max(1, Math.min(5, Math.round(freshTeams[code].xg * 1.4)));
                            freshTeams[code].played = gp;
                            freshTeams[code].gf = gf;
                            freshTeams[code].ga = ga;
                            freshTeams[code].gd = gd;
                            freshTeams[code].pts = pts;
                            freshTeams[code].espnRank = officialRank;
                            freshTeams[code].rank = officialRank;
                            freshTeams[code].form = freshTeams[code].form || ['W','D','L','D','W'];

                            const formStat = (entry.stats || []).find(s => s.name === 'form' || s.type === 'form' || s.abbreviation === 'FORM');
                            const parsedForm = parseFormString(formStat?.displayValue || formStat?.stringValue || formStat?.value);
                            if (parsedForm && leagueKey !== 'UCL') {
                                freshTeams[code].form = parsedForm;
                            }
                        });

                        if (Object.keys(freshTeams).length === maxAllowed || Object.keys(freshTeams).length >= 18) {
                            targetTeams = freshTeams;
                            Object.assign(espnIdToCode, freshIdMap);
                            Object.assign(abbrToCode, freshAbbrMap);
                        }
                    }
                }
            } catch (e) {}

            const resolveScoreboardTeamCode = (teamObj) => {
                if (!teamObj) return null;
                if (teamObj.id && espnIdToCode[String(teamObj.id)] && targetTeams[espnIdToCode[String(teamObj.id)]]) {
                    return espnIdToCode[String(teamObj.id)];
                }
                const rawAbbr = (teamObj.abbreviation || '').toUpperCase();
                if (rawAbbr && abbrToCode[rawAbbr] && targetTeams[abbrToCode[rawAbbr]]) {
                    return abbrToCode[rawAbbr];
                }
                const byName = matchTeamNameToCode(teamObj.displayName || teamObj.name || teamObj.shortDisplayName);
                if (byName && targetTeams[byName]) {
                    if (teamObj.id) espnIdToCode[String(teamObj.id)] = byName;
                    return byName;
                }
                const lowerTarget = (teamObj.displayName || teamObj.name || '').toLowerCase();
                if (lowerTarget) {
                    for (const existingCode of Object.keys(targetTeams)) {
                        const existingName = (targetTeams[existingCode].name || '').toLowerCase();
                        if (existingName && (existingName.includes(lowerTarget) || lowerTarget.includes(existingName))) {
                            if (teamObj.id) espnIdToCode[String(teamObj.id)] = existingCode;
                            return existingCode;
                        }
                    }
                }
                const canAddTeam = Object.keys(targetTeams).length < (cfg.maxTeams || 20);
                return resolveOrRegisterTeamFromESPN(teamObj, targetTeams, canAddTeam);
            };

            const isESPNEventCompleted = (comp) => {
                if (!comp) return false;
                const st = comp.status?.type;
                if (st?.completed === true) return true;
                if (st?.state === 'post') return true;
                if (st?.name === 'STATUS_FULL_TIME' || st?.name === 'STATUS_FINAL_AET' || st?.name === 'STATUS_FINAL_PEN') return true;
                if (st?.shortDetail === 'FT' || st?.description === 'Full Time') return true;
                return false;
            };

            const parseRawESPNEvent = (ev, explicitRoundCode = null, forceUnplayedStatus = false) => {
                const comp = ev.competitions?.[0];
                if (!comp) return null;
                const homeComp = (comp.competitors || []).find(c => c.homeAway === 'home');
                const awayComp = (comp.competitors || []).find(c => c.homeAway === 'away');
                if (!homeComp || !awayComp) return null;

                const hCode = resolveScoreboardTeamCode(homeComp.team);
                const aCode = resolveScoreboardTeamCode(awayComp.team);
                if (!hCode || !aCode || !targetTeams[hCode] || !targetTeams[aCode]) return null;

                if (!this.lastRawESPNFixtureSample) {
                    this.lastRawESPNFixtureSample = {
                        id: ev.id,
                        date: ev.date,
                        name: ev.name,
                        shortName: ev.shortName,
                        week: ev.week || null,
                        competition: {
                            date: comp.date,
                            status: comp.status?.type,
                            competitors: (comp.competitors || []).map(c => ({
                                id: c.id,
                                homeAway: c.homeAway,
                                winner: c.winner,
                                score: c.score,
                                team: {
                                    id: c.team?.id,
                                    displayName: c.team?.displayName,
                                    abbreviation: c.team?.abbreviation,
                                    logo: c.team?.logo || c.team?.logos?.[0]?.href
                                }
                            }))
                        }
                    };
                }

                const isDone = forceUnplayedStatus ? false : isESPNEventCompleted(comp);
                const hScore = homeComp.score?.displayValue ?? homeComp.score?.value ?? homeComp.score ?? '0';
                const aScore = awayComp.score?.displayValue ?? awayComp.score?.value ?? awayComp.score ?? '0';
                const isFeatured = topClubs.has(hCode) || topClubs.has(aCode);

                const extractStat = (competitor, names) => {
                    const st = (competitor.statistics || []).find(s => names.includes(s.name) || names.includes(s.abbreviation));
                    return st ? parseFloat(st.displayValue || st.value || 0) : 0;
                };

                const weekNum = ev.week?.number || comp.week?.number || null;
                const roundCode = explicitRoundCode || (weekNum ? `${cfg.roundPrefix}${weekNum}` : null);
                const shortLabel = isDone
                    ? `${hCode} ${hScore}-${aScore} ${aCode}`
                    : `${isFeatured ? '⭐ ' : ''}${hCode} vs ${aCode}`;

                return {
                    eventId: String(ev.id || `${hCode}_${aCode}_${ev.date}`),
                    round: roundCode,
                    weekNumber: weekNum ? Number(weekNum) : null,
                    featured: isFeatured,
                    homeCode: hCode,
                    awayCode: aCode,
                    shortLabel,
                    utcIso: ev.date || comp.date,
                    status: isDone ? 'FT' : (roundCode || activeRound),
                    hScore: isDone ? Number(hScore) : undefined,
                    aScore: isDone ? Number(aScore) : undefined,
                    name: isDone
                        ? `${hCode} ${hScore} - ${aScore} ${aCode} (${roundCode || 'FT'})`
                        : `${shortLabel} (${roundCode || activeRound})`,
                    homeShots: extractStat(homeComp, ['totalShots', 'shots', 'SH']),
                    homeSot: extractStat(homeComp, ['shotsOnTarget', 'SOT']),
                    awayShots: extractStat(awayComp, ['totalShots', 'shots', 'SH']),
                    awaySot: extractStat(awayComp, ['shotsOnTarget', 'SOT']),
                    homePoss: extractStat(homeComp, ['possessionPct', 'possession', 'POSS'])
                };
            };

            // STEP 2: Harvest All 380 Season Fixtures from all 20 clubs' `/schedule` (results) + `/schedule?fixture=true` (upcoming) + `/scoreboard`
            const harvestedByEventId = new Map();
            const eventRoundVotes = new Map(); // eventId -> array of 1-based matchday indices (1..38) from both teams' full 38-match schedules
            const activeScoreboardMatches = [];

            // 2A. Query Default Scoreboard FIRST to see what ESPN considers the live active week and matches
            try {
                const sbRes = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${cfg.espnSlug}/scoreboard?limit=100`);
                if (sbRes.ok) {
                    const sbData = await sbRes.json();
                    if (sbData.week?.number && leagueKey !== 'LALIGA') {
                        activeRound = `${cfg.roundPrefix}${sbData.week.number}`;
                    }
                    (sbData.events || []).forEach(ev => {
                        const parsed = parseRawESPNEvent(ev, activeRound);
                        if (parsed) {
                            harvestedByEventId.set(parsed.eventId, parsed);
                            if (parsed.status !== 'FT' && !activeScoreboardMatches.some(m => m.eventId === parsed.eventId)) {
                                activeScoreboardMatches.push({ ...parsed, round: activeRound, status: activeRound });
                            }
                        }
                    });
                }
            } catch (e) {}

            // 2B. Query BOTH `/teams/{id}/schedule` (past results) AND `/teams/{id}/schedule?fixture=true` (upcoming fixtures) for all 20 clubs
            const clubCodesWithId = Object.keys(targetTeams).filter(c => targetTeams[c]?.espnId);
            await Promise.allSettled(clubCodesWithId.map(async (code) => {
                const espnId = targetTeams[code].espnId;
                try {
                    const [pastRes, futureRes] = await Promise.allSettled([
                        fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${cfg.espnSlug}/teams/${espnId}/schedule`),
                        fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${cfg.espnSlug}/teams/${espnId}/schedule?fixture=true`)
                    ]);

                    const combinedEventMap = new Map();
                    if (pastRes.status === 'fulfilled' && pastRes.value.ok) {
                        const pastData = await pastRes.value.json();
                        (pastData.events || []).forEach(ev => {
                            if (ev && ev.id) combinedEventMap.set(String(ev.id), ev);
                        });
                    }
                    if (futureRes.status === 'fulfilled' && futureRes.value.ok) {
                        const futureData = await futureRes.value.json();
                        (futureData.events || []).forEach(ev => {
                            if (ev && ev.id) combinedEventMap.set(String(ev.id), ev);
                        });
                    }

                    // Filter strictly to valid league events between the 20 league clubs & sort chronologically (0..37 -> GW1..GW38)
                    const validLeagueEvents = [];
                    Array.from(combinedEventMap.values()).forEach(ev => {
                        const parsed = parseRawESPNEvent(ev, null);
                        if (parsed) {
                            validLeagueEvents.push({ rawEv: ev, parsed });
                        }
                    });

                    validLeagueEvents.sort((a, b) => new Date(a.rawEv.date).getTime() - new Date(b.rawEv.date).getTime());

                    // Extract 5-match chronological form from completed league matches
                    const completedLeagueItems = validLeagueEvents.filter(item => item.parsed.status === 'FT');
                    if (completedLeagueItems.length >= 3 && leagueKey !== 'UCL') {
                        const last5 = completedLeagueItems.slice(-5).map(({ rawEv }) => {
                            const comp = rawEv.competitions[0];
                            const ourSide = (comp.competitors || []).find(c => String(c.team?.id) === String(espnId) || String(c.id) === String(espnId));
                            const oppSide = (comp.competitors || []).find(c => String(c.team?.id) !== String(espnId) && String(c.id) !== String(espnId));
                            if (!ourSide || !oppSide) return 'D';
                            if (ourSide.winner === true) return 'W';
                            if (oppSide.winner === true) return 'L';
                            const ourScore = parseFloat(ourSide.score?.value ?? ourSide.score?.displayValue ?? ourSide.score ?? NaN);
                            const oppScore = parseFloat(oppSide.score?.value ?? oppSide.score?.displayValue ?? oppSide.score ?? NaN);
                            if (!isNaN(ourScore) && !isNaN(oppScore)) {
                                if (ourScore > oppScore) return 'W';
                                if (ourScore < oppScore) return 'L';
                            }
                            return 'D';
                        });
                        while (last5.length < 5) last5.unshift('D');
                        targetTeams[code].form = last5.slice(-5);
                    }

                    // Assign each club's chronological league match (0..37) to its exact 1-based Gameweek (1..38)
                    validLeagueEvents.slice(0, cfg.totalRounds).forEach(({ parsed }, idx) => {
                        const explicitWeek = parsed.weekNumber;
                        const inferredRoundNum = explicitWeek
                            ? Math.min(cfg.totalRounds, Math.max(1, explicitWeek))
                            : Math.min(cfg.totalRounds, idx + 1);
                        if (!eventRoundVotes.has(parsed.eventId)) {
                            eventRoundVotes.set(parsed.eventId, []);
                        }
                        eventRoundVotes.get(parsed.eventId).push(inferredRoundNum);
                        harvestedByEventId.set(parsed.eventId, parsed);
                    });
                } catch (e) {}
            }));

            // STEP 3: Bucket Harvested ESPN Fixtures Strictly by Their Assigned Gameweek (`MD1`..`MD38` / `MW1`..`MW38`)
            const allHarvested = sortFixturesChronologically(Array.from(harvestedByEventId.values()));
            const finalFixtures = [];

            if (allHarvested.length >= 10 && leagueKey !== 'UCL') {
                const roundBuckets = {};
                const roundClubUsed = {};
                for (let r = 1; r <= cfg.totalRounds; r++) {
                    const rCode = `${cfg.roundPrefix}${r}`;
                    roundBuckets[rCode] = [];
                    roundClubUsed[rCode] = new Set();
                }

                const placedEventIds = new Set();

                // Compute each event's consensus Round Number (1..38) from the two participating clubs' 38-match schedules
                const getConsensusRoundNum = (fix) => {
                    if (fix.weekNumber && fix.weekNumber >= 1 && fix.weekNumber <= cfg.totalRounds) {
                        return fix.weekNumber;
                    }
                    const votes = eventRoundVotes.get(fix.eventId) || [];
                    if (votes.length > 0) {
                        return Math.min(cfg.totalRounds, Math.max(1, Math.round(votes.reduce((a, b) => a + b, 0) / votes.length)));
                    }
                    return null;
                };

                // Pass A: Place every fixture into its exact consensus Gameweek (`rNum`)
                allHarvested.forEach(fix => {
                    if (placedEventIds.has(fix.eventId)) return;
                    const rNum = getConsensusRoundNum(fix);
                    if (!rNum) return;

                    const rCode = `${cfg.roundPrefix}${rNum}`;
                    if (roundBuckets[rCode] &&
                        roundBuckets[rCode].length < cfg.matchesPerRound &&
                        !roundClubUsed[rCode].has(fix.homeCode) &&
                        !roundClubUsed[rCode].has(fix.awayCode)) {
                        const isDone = (fix.status === 'FT');
                        const shortLabel = isDone
                            ? fix.shortLabel
                            : `${fix.featured ? '⭐ ' : ''}${fix.homeCode} vs ${fix.awayCode}`;
                        const cloned = {
                            ...fix,
                            round: rCode,
                            status: isDone ? 'FT' : rCode,
                            shortLabel,
                            name: isDone ? `${fix.homeCode} ${fix.hScore} - ${fix.aScore} ${fix.awayCode} (${rCode} FT)` : `${shortLabel} (${rCode})`
                        };
                        roundBuckets[rCode].push(cloned);
                        roundClubUsed[rCode].add(fix.homeCode);
                        roundClubUsed[rCode].add(fix.awayCode);
                        placedEventIds.add(fix.eventId);
                    }
                });

                // Pass B: For any match where one club had a 1-week schedule offset due to a postponed game, check `rNum - 1` or `rNum + 1` ONLY (never jump from GW1 to GW12!)
                allHarvested.forEach(fix => {
                    if (placedEventIds.has(fix.eventId)) return;
                    const rNum = getConsensusRoundNum(fix);
                    if (!rNum) return;
                    const nearbyRounds = [rNum - 1, rNum + 1, rNum - 2, rNum + 2].filter(n => n >= 1 && n <= cfg.totalRounds);
                    for (const candNum of nearbyRounds) {
                        const rCode = `${cfg.roundPrefix}${candNum}`;
                        if (roundBuckets[rCode].length < cfg.matchesPerRound &&
                            !roundClubUsed[rCode].has(fix.homeCode) &&
                            !roundClubUsed[rCode].has(fix.awayCode)) {
                            const isDone = (fix.status === 'FT');
                            const shortLabel = isDone
                                ? fix.shortLabel
                                : `${fix.featured ? '⭐ ' : ''}${fix.homeCode} vs ${fix.awayCode}`;
                            roundBuckets[rCode].push({
                                ...fix,
                                round: rCode,
                                status: isDone ? 'FT' : rCode,
                                shortLabel,
                                name: isDone ? `${fix.homeCode} ${fix.hScore} - ${fix.aScore} ${fix.awayCode} (${rCode} FT)` : `${shortLabel} (${rCode})`
                            });
                            roundClubUsed[rCode].add(fix.homeCode);
                            roundClubUsed[rCode].add(fix.awayCode);
                            placedEventIds.add(fix.eventId);
                            break;
                        }
                    }
                });

                Object.keys(roundBuckets).forEach(rCode => {
                    finalFixtures.push(...sortFixturesChronologically(roundBuckets[rCode]));
                });
            } else {
                const rawSeedFixtures = leagueFixturesData[leagueKey] || [];
                const seedActive = rawSeedFixtures.filter(f => f.round === activeRound);
                const completeActive = ensureCompleteRoundMatches(
                    activeScoreboardMatches,
                    seedActive,
                    targetTeams,
                    activeRound,
                    cfg.matchesPerRound,
                    false
                ).map(f => ({ ...f, status: activeRound }));
                finalFixtures.push(...rawSeedFixtures.filter(f => f.round !== activeRound), ...completeActive);
            }

            dbLeague.formSeededFromESPN = true;
            this.saveLeague(leagueKey, targetTeams, finalFixtures, true);

            return {
                teams: this.getLeague(leagueKey).teams,
                fixtures: this.getLeague(leagueKey).fixtures,
                activeRound,
                fromCache: false
            };
        },

        exportSnapshot() {
            if (!this.state) this.init();
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
            const a = document.createElement('a');
            a.setAttribute("href", dataStr);
            a.setAttribute("download", `football_db_snapshot_${this.DB_VERSION}.json`);
            document.body.appendChild(a);
            a.click();
            a.remove();
        },

        /**
         * Exports a ready-to-save `football_db.js` file containing the live ESPN-synced
         * teams, standings, 5-match forms, and all 380 fixtures baked directly into the JS file.
         */
        exportAsJSFile() {
            if (!this.state) this.init();
            const jsSource = `// Auto-generated FootballDB Snapshot from Live ESPN API (${new Date().toISOString()})\nwindow.__PRELOADED_FOOTBALL_DB_STATE__ = ${JSON.stringify(this.state, null, 2)};\n`;
            const dataStr = "data:text/javascript;charset=utf-8," + encodeURIComponent(jsSource);
            const a = document.createElement('a');
            a.setAttribute("href", dataStr);
            a.setAttribute("download", "football_db_espn_synced.js");
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    FootballDB.init();
    global.FootballDB = FootballDB;
})(window);