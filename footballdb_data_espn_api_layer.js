(function (global) {
    'use strict';

    const leagueConfigs = {
        PL: {
            name: "Premier League",
            espnSlug: "eng.1",
            matchesPerRound: 10,
            maxTeams: 20,
            totalRounds: 38,
            roundPrefix: "MW",
            activeRound: "MW10"
        },
        LALIGA: {
            name: "La Liga",
            espnSlug: "esp.1",
            matchesPerRound: 10,
            maxTeams: 20,
            totalRounds: 38,
            roundPrefix: "MD",
            activeRound: "MD12"
        },
        UCL: {
            name: "UEFA Champions League",
            espnSlug: "uefa.champions",
            matchesPerRound: 18,
            maxTeams: 36,
            totalRounds: 8,
            roundPrefix: "UCL",
            activeRound: "UCL4"
        },
        UNL: {
            name: "UEFA Nations League",
            espnSlug: "uefa.nations",
            logo: "https://en.wikipedia.org/wiki/Special:FilePath/UEFA_Nations_League.svg",
            matchesPerRound: 26,
            maxTeams: 54,
            totalRounds: 6,
            roundPrefix: "UNL",
            activeRound: "UNL5",
            phaseType: "GROUP_STAGE",
            totalGroups: 14
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

    // Official 2026-27 UEFA Nations League — All 14 Groups (Groups A–N / 54 National Teams)
    const unlTeamsData = {
        // Group A (League A1): France, Italy, Belgium, Türkiye
        FRA: { espnId: 478, name: "France", short: "FRA", group: "Group A (League A1)", groupOrder: 1, groupRank: 1, color: "#002654", logo: "https://a.espncdn.com/i/teamlogos/countries/500/fra.png", xg: 2.12, xga: 0.85, shots: 17, sot: 6, bigChances: 4, poss: 59, played: 4, gf: 7, ga: 2, gd: 5, pts: 10, espnRank: 1, form: ['W','W','W','D','W'] },
        ITA: { espnId: 162, name: "Italy", short: "ITA", group: "Group A (League A1)", groupOrder: 1, groupRank: 2, color: "#0064AA", logo: "https://a.espncdn.com/i/teamlogos/countries/500/ita.png", xg: 1.94, xga: 1.08, shots: 15, sot: 6, bigChances: 3, poss: 55, played: 4, gf: 8, ga: 5, gd: 3, pts: 7, espnRank: 2, form: ['W','L','W','D','W'] },
        BEL: { espnId: 459, name: "Belgium", short: "BEL", group: "Group A (League A1)", groupOrder: 1, groupRank: 3, color: "#E30613", logo: "https://a.espncdn.com/i/teamlogos/countries/500/bel.png", xg: 1.66, xga: 1.28, shots: 14, sot: 5, bigChances: 2, poss: 54, played: 4, gf: 6, ga: 5, gd: 1, pts: 6, espnRank: 3, form: ['L','W','L','W','L'] },
        TUR: { espnId: 465, name: "Türkiye", short: "TUR", group: "Group A (League A1)", groupOrder: 1, groupRank: 4, color: "#E30A17", logo: "https://a.espncdn.com/i/teamlogos/countries/500/tur.png", xg: 1.15, xga: 1.95, shots: 11, sot: 4, bigChances: 1, poss: 46, played: 4, gf: 2, ga: 11, gd: -9, pts: 0, espnRank: 4, form: ['W','L','L','L','L'] },

        // Group B (League A2): Netherlands, Greece, Germany, Serbia
        NED: { espnId: 449, name: "Netherlands", short: "NED", group: "Group B (League A2)", groupOrder: 2, groupRank: 1, color: "#F36C21", logo: "https://a.espncdn.com/i/teamlogos/countries/500/ned.png", xg: 1.88, xga: 1.10, shots: 15, sot: 6, bigChances: 3, poss: 58, played: 4, gf: 7, ga: 5, gd: 2, pts: 8, espnRank: 5, form: ['W','D','W','D','W'] },
        GRE: { espnId: 456, name: "Greece", short: "GRE", group: "Group B (League A2)", groupOrder: 2, groupRank: 2, color: "#0D5EAF", logo: "https://a.espncdn.com/i/teamlogos/countries/500/gre.png", xg: 1.56, xga: 0.96, shots: 13, sot: 5, bigChances: 2, poss: 49, played: 4, gf: 5, ga: 3, gd: 2, pts: 8, espnRank: 6, form: ['W','W','W','D','D'] },
        GER: { espnId: 481, name: "Germany", short: "GER", group: "Group B (League A2)", groupOrder: 2, groupRank: 3, color: "#000000", logo: "https://a.espncdn.com/i/teamlogos/countries/500/ger.png", xg: 1.82, xga: 0.92, shots: 16, sot: 6, bigChances: 3, poss: 60, played: 4, gf: 3, ga: 2, gd: 1, pts: 5, espnRank: 7, form: ['W','D','L','W','D'] },
        SRB: { espnId: 6757, name: "Serbia", short: "SRB", group: "Group B (League A2)", groupOrder: 2, groupRank: 4, color: "#C6363C", logo: "https://a.espncdn.com/i/teamlogos/countries/500/srb.png", xg: 1.12, xga: 1.68, shots: 10, sot: 3, bigChances: 1, poss: 44, played: 4, gf: 3, ga: 8, gd: -5, pts: 0, espnRank: 8, form: ['D','L','L','L','L'] },

        // Group C (League A3): Spain, England, Croatia, Czechia
        ESP: { espnId: 164, name: "Spain", short: "ESP", group: "Group C (League A3)", groupOrder: 3, groupRank: 1, color: "#AA151B", logo: "https://a.espncdn.com/i/teamlogos/countries/500/esp.png", xg: 2.35, xga: 0.95, shots: 18, sot: 7, bigChances: 4, poss: 64, played: 4, gf: 12, ga: 5, gd: 7, pts: 12, espnRank: 9, form: ['W','W','W','W','W'] },
        ENG: { espnId: 448, name: "England", short: "ENG", group: "Group C (League A3)", groupOrder: 3, groupRank: 2, color: "#CE1126", logo: "https://a.espncdn.com/i/teamlogos/countries/500/eng.png", xg: 2.28, xga: 0.88, shots: 17, sot: 7, bigChances: 4, poss: 61, played: 4, gf: 14, ga: 3, gd: 11, pts: 9, espnRank: 10, form: ['W','L','W','W','W'] },
        CRO: { espnId: 477, name: "Croatia", short: "CRO", group: "Group C (League A3)", groupOrder: 3, groupRank: 3, color: "#FF0000", logo: "https://a.espncdn.com/i/teamlogos/countries/500/cro.png", xg: 1.34, xga: 2.05, shots: 12, sot: 4, bigChances: 2, poss: 51, played: 4, gf: 4, ga: 14, gd: -10, pts: 3, espnRank: 11, form: ['D','W','L','L','L'] },
        CZE: { espnId: 487, name: "Czechia", short: "CZE", group: "Group C (League A3)", groupOrder: 3, groupRank: 4, color: "#11457E", logo: "https://a.espncdn.com/i/teamlogos/countries/500/cze.png", xg: 1.08, xga: 1.88, shots: 10, sot: 3, bigChances: 1, poss: 43, played: 4, gf: 2, ga: 10, gd: -8, pts: 0, espnRank: 12, form: ['W','L','L','L','L'] },

        // Group D (League A4): Portugal, Denmark, Wales, Norway
        POR: { espnId: 482, name: "Portugal", short: "POR", group: "Group D (League A4)", groupOrder: 4, groupRank: 1, color: "#E42518", logo: "https://a.espncdn.com/i/teamlogos/countries/500/por.png", xg: 2.18, xga: 0.92, shots: 17, sot: 6, bigChances: 4, poss: 61, played: 4, gf: 9, ga: 4, gd: 5, pts: 12, espnRank: 13, form: ['W','W','W','W','W'] },
        DEN: { espnId: 479, name: "Denmark", short: "DEN", group: "Group D (League A4)", groupOrder: 4, groupRank: 2, color: "#C8102E", logo: "https://a.espncdn.com/i/teamlogos/countries/500/den.png", xg: 1.62, xga: 1.38, shots: 13, sot: 5, bigChances: 2, poss: 52, played: 4, gf: 7, ga: 7, gd: 0, pts: 6, espnRank: 14, form: ['D','L','W','L','W'] },
        WAL: { espnId: 578, name: "Wales", short: "WAL", group: "Group D (League A4)", groupOrder: 4, groupRank: 3, color: "#DA291C", logo: "https://a.espncdn.com/i/teamlogos/countries/500/wal.png", xg: 1.15, xga: 1.36, shots: 10, sot: 3, bigChances: 1, poss: 45, played: 4, gf: 2, ga: 5, gd: -3, pts: 3, espnRank: 15, form: ['W','L','L','W','L'] },
        NOR: { espnId: 463, name: "Norway", short: "NOR", group: "Group D (League A4)", groupOrder: 4, groupRank: 4, color: "#BA0C2F", logo: "https://a.espncdn.com/i/teamlogos/countries/500/nor.png", xg: 1.54, xga: 1.65, shots: 13, sot: 5, bigChances: 2, poss: 49, played: 4, gf: 6, ga: 8, gd: -2, pts: 3, espnRank: 16, form: ['W','W','L','L','L'] },

        // Group E (League B1): Switzerland, Slovenia, Scotland, North Macedonia
        SUI: { espnId: 475, name: "Switzerland", short: "SUI", group: "Group E (League B1)", groupOrder: 5, groupRank: 1, color: "#FF0000", logo: "https://a.espncdn.com/i/teamlogos/countries/500/sui.png", xg: 2.05, xga: 0.65, shots: 16, sot: 6, bigChances: 3, poss: 59, played: 4, gf: 11, ga: 1, gd: 10, pts: 12, espnRank: 17, form: ['D','W','W','W','W'] },
        SVN: { espnId: 453, name: "Slovenia", short: "SVN", group: "Group E (League B1)", groupOrder: 5, groupRank: 2, color: "#005CE6", logo: "https://a.espncdn.com/i/teamlogos/countries/500/svn.png", xg: 1.46, xga: 1.02, shots: 12, sot: 4, bigChances: 2, poss: 49, played: 4, gf: 5, ga: 3, gd: 2, pts: 7, espnRank: 18, form: ['W','D','W','L','W'] },
        SCO: { espnId: 580, name: "Scotland", short: "SCO", group: "Group E (League B1)", groupOrder: 5, groupRank: 3, color: "#003399", logo: "https://a.espncdn.com/i/teamlogos/countries/500/sco.png", xg: 1.18, xga: 1.32, shots: 11, sot: 4, bigChances: 1, poss: 47, played: 4, gf: 3, ga: 5, gd: -2, pts: 4, espnRank: 19, form: ['D','D','L','W','L'] },
        MKD: { espnId: 2490, name: "North Macedonia", short: "MKD", group: "Group E (League B1)", groupOrder: 5, groupRank: 4, color: "#D20000", logo: "https://a.espncdn.com/i/teamlogos/countries/500/mkd.png", xg: 0.78, xga: 1.92, shots: 8, sot: 2, bigChances: 1, poss: 42, played: 4, gf: 0, ga: 10, gd: -10, pts: 0, espnRank: 20, form: ['W','L','L','L','L'] },

        // Group F (League B2): Northern Ireland, Hungary, Ukraine, Georgia
        NIR: { espnId: 581, name: "Northern Ireland", short: "NIR", group: "Group F (League B2)", groupOrder: 6, groupRank: 1, color: "#009A44", logo: "https://a.espncdn.com/i/teamlogos/countries/500/nir.png", xg: 1.42, xga: 0.62, shots: 12, sot: 4, bigChances: 2, poss: 48, played: 4, gf: 4, ga: 0, gd: 4, pts: 8, espnRank: 21, form: ['W','W','D','W','D'] },
        HUN: { espnId: 484, name: "Hungary", short: "HUN", group: "Group F (League B2)", groupOrder: 6, groupRank: 2, color: "#CD2A3E", logo: "https://a.espncdn.com/i/teamlogos/countries/500/hun.png", xg: 1.32, xga: 0.88, shots: 11, sot: 4, bigChances: 2, poss: 49, played: 4, gf: 3, ga: 2, gd: 1, pts: 7, espnRank: 22, form: ['D','L','D','W','W'] },
        UKR: { espnId: 457, name: "Ukraine", short: "UKR", group: "Group F (League B2)", groupOrder: 6, groupRank: 3, color: "#FFD700", logo: "https://a.espncdn.com/i/teamlogos/countries/500/ukr.png", xg: 1.15, xga: 1.36, shots: 11, sot: 3, bigChances: 1, poss: 52, played: 4, gf: 2, ga: 5, gd: -3, pts: 4, espnRank: 23, form: ['D','W','D','L','L'] },
        GEO: { espnId: 2483, name: "Georgia", short: "GEO", group: "Group F (League B2)", groupOrder: 6, groupRank: 4, color: "#DA291C", logo: "https://a.espncdn.com/i/teamlogos/countries/500/geo.png", xg: 0.92, xga: 1.05, shots: 9, sot: 3, bigChances: 1, poss: 48, played: 4, gf: 0, ga: 2, gd: -2, pts: 2, espnRank: 24, form: ['L','L','D','L','D'] },

        // Group G (League B3): Austria, Kosovo, Republic of Ireland, Israel
        AUT: { espnId: 474, name: "Austria", short: "AUT", group: "Group G (League B3)", groupOrder: 7, groupRank: 1, color: "#ED2939", logo: "https://a.espncdn.com/i/teamlogos/countries/500/aut.png", xg: 1.85, xga: 1.12, shots: 15, sot: 6, bigChances: 3, poss: 56, played: 4, gf: 9, ga: 5, gd: 4, pts: 8, espnRank: 25, form: ['W','W','W','D','D'] },
        KOS: { espnId: 18060, name: "Kosovo", short: "KOS", group: "Group G (League B3)", groupOrder: 7, groupRank: 2, color: "#244AA5", logo: "https://a.espncdn.com/i/teamlogos/countries/500/kos.png", xg: 1.24, xga: 1.18, shots: 11, sot: 4, bigChances: 2, poss: 48, played: 4, gf: 3, ga: 4, gd: -1, pts: 5, espnRank: 26, form: ['W','W','L','D','D'] },
        IRL: { espnId: 476, name: "Republic of Ireland", short: "IRL", group: "Group G (League B3)", groupOrder: 7, groupRank: 3, color: "#169B62", logo: "https://a.espncdn.com/i/teamlogos/countries/500/irl.png", xg: 1.42, xga: 1.15, shots: 12, sot: 4, bigChances: 2, poss: 49, played: 4, gf: 6, ga: 4, gd: 2, pts: 5, espnRank: 27, form: ['L','L','W','D','D'] },
        ISR: { espnId: 466, name: "Israel", short: "ISR", group: "Group G (League B3)", groupOrder: 7, groupRank: 4, color: "#0038B8", logo: "https://a.espncdn.com/i/teamlogos/countries/500/isr.png", xg: 0.96, xga: 1.62, shots: 9, sot: 3, bigChances: 1, poss: 45, played: 4, gf: 2, ga: 7, gd: -5, pts: 2, espnRank: 28, form: ['L','L','L','D','D'] },

        // Group H (League B4): Sweden, Bosnia and Herzegovina, Poland, Romania
        SWE: { espnId: 469, name: "Sweden", short: "SWE", group: "Group H (League B4)", groupOrder: 8, groupRank: 1, color: "#FECC00", logo: "https://a.espncdn.com/i/teamlogos/countries/500/swe.png", xg: 1.82, xga: 0.95, shots: 15, sot: 6, bigChances: 3, poss: 55, played: 4, gf: 7, ga: 3, gd: 4, pts: 10, espnRank: 29, form: ['W','W','W','D','W'] },
        BIH: { espnId: 579, name: "Bosnia and Herzegovina", short: "BIH", group: "Group H (League B4)", groupOrder: 8, groupRank: 2, color: "#002395", logo: "https://a.espncdn.com/i/teamlogos/countries/500/bih.png", xg: 1.54, xga: 1.02, shots: 13, sot: 5, bigChances: 2, poss: 49, played: 4, gf: 6, ga: 3, gd: 3, pts: 8, espnRank: 30, form: ['L','D','W','D','W'] },
        POL: { espnId: 471, name: "Poland", short: "POL", group: "Group H (League B4)", groupOrder: 8, groupRank: 3, color: "#DC143C", logo: "https://a.espncdn.com/i/teamlogos/countries/500/pol.png", xg: 1.58, xga: 1.18, shots: 14, sot: 5, bigChances: 2, poss: 52, played: 4, gf: 7, ga: 4, gd: 3, pts: 4, espnRank: 31, form: ['L','D','L','W','L'] },
        ROU: { espnId: 473, name: "Romania", short: "ROU", group: "Group H (League B4)", groupOrder: 8, groupRank: 4, color: "#FCD116", logo: "https://a.espncdn.com/i/teamlogos/countries/500/rou.png", xg: 0.98, xga: 2.15, shots: 9, sot: 3, bigChances: 1, poss: 44, played: 4, gf: 3, ga: 13, gd: -10, pts: 0, espnRank: 32, form: ['W','L','L','L','L'] },

        // Group I (League C1): Albania, Belarus, Finland, San Marino
        ALB: { espnId: 583, name: "Albania", short: "ALB", group: "Group I (League C1)", groupOrder: 9, groupRank: 1, color: "#E41E20", logo: "https://a.espncdn.com/i/teamlogos/countries/500/alb.png", xg: 1.72, xga: 0.88, shots: 14, sot: 5, bigChances: 3, poss: 54, played: 4, gf: 8, ga: 3, gd: 5, pts: 9, espnRank: 33, form: ['W','W','W','L','W'] },
        BLR: { espnId: 2489, name: "Belarus", short: "BLR", group: "Group I (League C1)", groupOrder: 9, groupRank: 2, color: "#C8313E", logo: "https://a.espncdn.com/i/teamlogos/countries/500/blr.png", xg: 1.38, xga: 0.82, shots: 12, sot: 4, bigChances: 2, poss: 49, played: 4, gf: 5, ga: 2, gd: 3, pts: 7, espnRank: 34, form: ['D','L','D','W','W'] },
        FIN: { espnId: 461, name: "Finland", short: "FIN", group: "Group I (League C1)", groupOrder: 9, groupRank: 3, color: "#003580", logo: "https://a.espncdn.com/i/teamlogos/countries/500/fin.png", xg: 1.75, xga: 0.85, shots: 15, sot: 5, bigChances: 3, poss: 55, played: 4, gf: 9, ga: 2, gd: 7, pts: 7, espnRank: 35, form: ['L','W','D','W','L'] },
        SMR: { espnId: 585, name: "San Marino", short: "SMR", group: "Group I (League C1)", groupOrder: 9, groupRank: 4, color: "#5EB6E4", logo: "https://a.espncdn.com/i/teamlogos/countries/500/smr.png", xg: 0.55, xga: 2.65, shots: 5, sot: 2, bigChances: 0, poss: 36, played: 4, gf: 1, ga: 16, gd: -15, pts: 0, espnRank: 36, form: ['L','L','L','L','L'] },

        // Group J (League C2): Montenegro, Cyprus, Armenia, Latvia
        MNE: { espnId: 6770, name: "Montenegro", short: "MNE", group: "Group J (League C2)", groupOrder: 10, groupRank: 1, color: "#C40308", logo: "https://a.espncdn.com/i/teamlogos/countries/500/mne.png", xg: 1.68, xga: 0.98, shots: 14, sot: 5, bigChances: 2, poss: 52, played: 4, gf: 7, ga: 4, gd: 3, pts: 10, espnRank: 37, form: ['L','W','W','W','D'] },
        CYP: { espnId: 582, name: "Cyprus", short: "CYP", group: "Group J (League C2)", groupOrder: 10, groupRank: 2, color: "#D57800", logo: "https://a.espncdn.com/i/teamlogos/countries/500/cyp.png", xg: 1.36, xga: 0.95, shots: 11, sot: 4, bigChances: 2, poss: 49, played: 4, gf: 5, ga: 3, gd: 2, pts: 7, espnRank: 38, form: ['L','L','D','W','W'] },
        ARM: { espnId: 2484, name: "Armenia", short: "ARM", group: "Group J (League C2)", groupOrder: 10, groupRank: 3, color: "#D90012", logo: "https://a.espncdn.com/i/teamlogos/countries/500/arm.png", xg: 1.25, xga: 1.28, shots: 11, sot: 4, bigChances: 2, poss: 51, played: 4, gf: 4, ga: 5, gd: -1, pts: 4, espnRank: 39, form: ['W','W','L','L','D'] },
        LVA: { espnId: 2488, name: "Latvia", short: "LVA", group: "Group J (League C2)", groupOrder: 10, groupRank: 4, color: "#9E3039", logo: "https://a.espncdn.com/i/teamlogos/countries/500/lva.png", xg: 0.92, xga: 1.52, shots: 8, sot: 3, bigChances: 1, poss: 45, played: 4, gf: 2, ga: 6, gd: -4, pts: 1, espnRank: 40, form: ['L','L','D','L','L'] },

        // Group K (League C3): Slovakia, Faroe Islands, Moldova, Kazakhstan
        SVK: { espnId: 468, name: "Slovakia", short: "SVK", group: "Group K (League C3)", groupOrder: 11, groupRank: 1, color: "#0B4EA2", logo: "https://a.espncdn.com/i/teamlogos/countries/500/svk.png", xg: 1.92, xga: 0.78, shots: 15, sot: 6, bigChances: 3, poss: 57, played: 4, gf: 9, ga: 2, gd: 7, pts: 10, espnRank: 41, form: ['W','W','W','D','W'] },
        FRO: { espnId: 2485, name: "Faroe Islands", short: "FRO", group: "Group K (League C3)", groupOrder: 11, groupRank: 2, color: "#0065BD", logo: "https://a.espncdn.com/i/teamlogos/countries/500/fro.png", xg: 1.22, xga: 1.22, shots: 10, sot: 4, bigChances: 1, poss: 46, played: 4, gf: 5, ga: 5, gd: 0, pts: 4, espnRank: 42, form: ['L','D','D','D','D'] },
        MDA: { espnId: 2493, name: "Moldova", short: "MDA", group: "Group K (League C3)", groupOrder: 11, groupRank: 3, color: "#0046AE", logo: "https://a.espncdn.com/i/teamlogos/countries/500/mda.png", xg: 1.05, xga: 1.68, shots: 9, sot: 3, bigChances: 1, poss: 44, played: 4, gf: 3, ga: 8, gd: -5, pts: 4, espnRank: 43, form: ['W','L','D','W','L'] },
        KAZ: { espnId: 2504, name: "Kazakhstan", short: "KAZ", group: "Group K (League C3)", groupOrder: 11, groupRank: 4, color: "#00AFCA", logo: "https://a.espncdn.com/i/teamlogos/countries/500/kaz.png", xg: 1.18, xga: 1.48, shots: 10, sot: 3, bigChances: 1, poss: 48, played: 4, gf: 5, ga: 7, gd: -2, pts: 2, espnRank: 44, form: ['L','D','L','L','D'] },

        // Group L (League C4): Iceland, Estonia, Bulgaria, Luxembourg
        ISL: { espnId: 470, name: "Iceland", short: "ISL", group: "Group L (League C4)", groupOrder: 12, groupRank: 1, color: "#02529C", logo: "https://a.espncdn.com/i/teamlogos/countries/500/isl.png", xg: 1.72, xga: 0.68, shots: 14, sot: 5, bigChances: 3, poss: 53, played: 4, gf: 7, ga: 1, gd: 6, pts: 8, espnRank: 45, form: ['L','D','W','W','D'] },
        EST: { espnId: 2486, name: "Estonia", short: "EST", group: "Group L (League C4)", groupOrder: 12, groupRank: 2, color: "#0072CE", logo: "https://a.espncdn.com/i/teamlogos/countries/500/est.png", xg: 1.12, xga: 0.75, shots: 9, sot: 3, bigChances: 1, poss: 46, played: 4, gf: 2, ga: 1, gd: 1, pts: 6, espnRank: 46, form: ['L','D','D','W','D'] },
        BUL: { espnId: 462, name: "Bulgaria", short: "BUL", group: "Group L (League C4)", groupOrder: 12, groupRank: 3, color: "#00966E", logo: "https://a.espncdn.com/i/teamlogos/countries/500/bul.png", xg: 1.15, xga: 1.32, shots: 10, sot: 3, bigChances: 1, poss: 49, played: 4, gf: 3, ga: 5, gd: -2, pts: 4, espnRank: 47, form: ['D','L','D','L','W'] },
        LUX: { espnId: 584, name: "Luxembourg", short: "LUX", group: "Group L (League C4)", groupOrder: 12, groupRank: 4, color: "#00A3E0", logo: "https://a.espncdn.com/i/teamlogos/countries/500/lux.png", xg: 0.92, xga: 1.56, shots: 8, sot: 3, bigChances: 1, poss: 47, played: 4, gf: 2, ga: 7, gd: -5, pts: 3, espnRank: 48, form: ['D','W','L','L','L'] },

        // Group M (League D1): Malta, Gibraltar, Andorra
        MLT: { espnId: 464, name: "Malta", short: "MLT", group: "Group M (League D1)", groupOrder: 13, groupRank: 1, color: "#CF142B", logo: "https://a.espncdn.com/i/teamlogos/countries/500/mlt.png", xg: 1.36, xga: 0.82, shots: 11, sot: 4, bigChances: 2, poss: 53, played: 3, gf: 4, ga: 2, gd: 2, pts: 7, espnRank: 49, form: ['W','D','W','D','W'] },
        GIB: { espnId: 16898, name: "Gibraltar", short: "GIB", group: "Group M (League D1)", groupOrder: 13, groupRank: 2, color: "#DA291C", logo: "https://a.espncdn.com/i/teamlogos/countries/500/gib.png", xg: 0.96, xga: 0.96, shots: 8, sot: 3, bigChances: 1, poss: 47, played: 2, gf: 1, ga: 1, gd: 0, pts: 2, espnRank: 50, form: ['D','W','D','D','D'] },
        AND: { espnId: 2494, name: "Andorra", short: "AND", group: "Group M (League D1)", groupOrder: 13, groupRank: 3, color: "#10069F", logo: "https://a.espncdn.com/i/teamlogos/countries/500/and.png", xg: 0.78, xga: 1.28, shots: 7, sot: 2, bigChances: 1, poss: 42, played: 3, gf: 1, ga: 3, gd: -2, pts: 1, espnRank: 51, form: ['L','L','L','D','L'] },

        // Group N (League D2): Azerbaijan, Lithuania, Liechtenstein
        AZE: { espnId: 2491, name: "Azerbaijan", short: "AZE", group: "Group N (League D2)", groupOrder: 14, groupRank: 1, color: "#00B5E2", logo: "https://a.espncdn.com/i/teamlogos/countries/500/aze.png", xg: 1.28, xga: 0.85, shots: 11, sot: 4, bigChances: 2, poss: 53, played: 3, gf: 2, ga: 1, gd: 1, pts: 5, espnRank: 52, form: ['L','L','D','D','W'] },
        LTU: { espnId: 2487, name: "Lithuania", short: "LTU", group: "Group N (League D2)", groupOrder: 14, groupRank: 2, color: "#FDB913", logo: "https://a.espncdn.com/i/teamlogos/countries/500/ltu.png", xg: 1.24, xga: 0.92, shots: 10, sot: 4, bigChances: 1, poss: 51, played: 3, gf: 3, ga: 2, gd: 1, pts: 4, espnRank: 53, form: ['L','L','W','D','L'] },
        LIE: { espnId: 2492, name: "Liechtenstein", short: "LIE", group: "Group N (League D2)", groupOrder: 14, groupRank: 3, color: "#002B7F", logo: "https://a.espncdn.com/i/teamlogos/countries/500/lie.png", xg: 0.72, xga: 1.35, shots: 6, sot: 2, bigChances: 0, poss: 41, played: 2, gf: 0, ga: 2, gd: -2, pts: 1, espnRank: 54, form: ['D','L','D','L','D'] }
    };

    // Build all 6 Matchdays × 26 Intra-Group Matches (= 156 Group Stage Matches) for UEFA Nations League
    function generateAll6MatchdaysUNL() {
        const fourTeamGroups = [
            { grp: 'Group A', teams: ['FRA', 'ITA', 'BEL', 'TUR'], dayOffset: 0 },
            { grp: 'Group B', teams: ['NED', 'GRE', 'GER', 'SRB'], dayOffset: 1 },
            { grp: 'Group C', teams: ['ESP', 'ENG', 'CRO', 'CZE'], dayOffset: 0 },
            { grp: 'Group D', teams: ['POR', 'DEN', 'WAL', 'NOR'], dayOffset: 2 },
            { grp: 'Group E', teams: ['SUI', 'SVN', 'SCO', 'MKD'], dayOffset: 1 },
            { grp: 'Group F', teams: ['NIR', 'HUN', 'UKR', 'GEO'], dayOffset: 2 },
            { grp: 'Group G', teams: ['AUT', 'KOS', 'IRL', 'ISR'], dayOffset: 2 },
            { grp: 'Group H', teams: ['SWE', 'BIH', 'POL', 'ROU'], dayOffset: 2 },
            { grp: 'Group I', teams: ['ALB', 'BLR', 'FIN', 'SMR'], dayOffset: 0 },
            { grp: 'Group J', teams: ['MNE', 'CYP', 'ARM', 'LVA'], dayOffset: 0 },
            { grp: 'Group K', teams: ['SVK', 'FRO', 'MDA', 'KAZ'], dayOffset: 1 },
            { grp: 'Group L', teams: ['ISL', 'EST', 'BUL', 'LUX'], dayOffset: 1 }
        ];
        const threeTeamGroups = [
            { grp: 'Group M', teams: ['MLT', 'GIB', 'AND'], dayOffset: 1 },
            { grp: 'Group N', teams: ['AZE', 'LTU', 'LIE'], dayOffset: 1 }
        ];

        const mdBaseDates = {
            UNL1: '2026-09-05',
            UNL2: '2026-09-08',
            UNL3: '2026-10-01',
            UNL4: '2026-10-04',
            UNL5: '2026-11-12',
            UNL6: '2026-11-15'
        };

        // Round-robin pairings for a 4-team group [0, 1, 2, 3]:
        // MD1: (0v1, 2v3), MD2: (1v2, 3v0), MD3: (0v2, 1v3), MD4: (1v0, 3v2), MD5: (3v2, 1v0), MD6: (0v3, 2v1)
        const rr4 = {
            UNL1: [[1, 0, 2, 1], [3, 2, 1, 1]],
            UNL2: [[0, 2, 2, 0], [3, 1, 0, 2]],
            UNL3: [[2, 0, 1, 2], [3, 1, 1, 1]],
            UNL4: [[0, 2, 3, 1], [1, 3, 2, 0]],
            UNL5: [[3, 2], [1, 0]],
            UNL6: [[0, 3], [2, 1]]
        };
        const rr3 = {
            UNL1: [0, 1, 2, 1],
            UNL2: [1, 2, 1, 1],
            UNL3: [2, 0, 0, 1],
            UNL4: [1, 0, 1, 2],
            UNL5: [2, 1],
            UNL6: [0, 2]
        };

        const addDays = (isoDate, days, timeStr) => {
            const d = new Date(`${isoDate}T${timeStr}Z`);
            d.setUTCDate(d.getUTCDate() + days);
            return d.toISOString();
        };

        const list = [];
        ['UNL1', 'UNL2', 'UNL3', 'UNL4', 'UNL5', 'UNL6'].forEach(roundCode => {
            const isPast = ['UNL1', 'UNL2', 'UNL3', 'UNL4'].includes(roundCode);
            const baseDate = mdBaseDates[roundCode];

            fourTeamGroups.forEach(({ grp, teams, dayOffset }) => {
                const pairs = rr4[roundCode];
                pairs.forEach((p, idx) => {
                    const hCode = teams[p[0]];
                    const aCode = teams[p[1]];
                    const timeStr = idx === 0 ? '17:00:00' : '19:45:00';
                    const utcIso = addDays(baseDate, dayOffset, timeStr);
                    if (isPast) {
                        const hScore = p[2] ?? 1;
                        const aScore = p[3] ?? 1;
                        list.push({
                            round: roundCode,
                            homeCode: hCode,
                            awayCode: aCode,
                            shortLabel: `${hCode} ${hScore}-${aScore} ${aCode}`,
                            utcIso,
                            status: 'FT',
                            hScore,
                            aScore,
                            name: `${hCode} ${hScore} - ${aScore} ${aCode} (${roundCode} FT • ${grp})`,
                            homeShots: 14,
                            homeSot: 5,
                            awayShots: 10,
                            awaySot: 4,
                            homePoss: 54
                        });
                    } else {
                        list.push({
                            round: roundCode,
                            homeCode: hCode,
                            awayCode: aCode,
                            shortLabel: `${hCode} vs ${aCode}`,
                            utcIso,
                            status: roundCode,
                            name: `${hCode} vs ${aCode} (${roundCode} • ${grp})`,
                            homeShots: 0,
                            homeSot: 0,
                            awayShots: 0,
                            awaySot: 0,
                            homePoss: 0
                        });
                    }
                });
            });

            threeTeamGroups.forEach(({ grp, teams, dayOffset }) => {
                const p = rr3[roundCode];
                const hCode = teams[p[0]];
                const aCode = teams[p[1]];
                const utcIso = addDays(baseDate, dayOffset, '19:45:00');
                if (isPast) {
                    const hScore = p[2] ?? 1;
                    const aScore = p[3] ?? 0;
                    list.push({
                        round: roundCode,
                        homeCode: hCode,
                        awayCode: aCode,
                        shortLabel: `${hCode} ${hScore}-${aScore} ${aCode}`,
                        utcIso,
                        status: 'FT',
                        hScore,
                        aScore,
                        name: `${hCode} ${hScore} - ${aScore} ${aCode} (${roundCode} FT • ${grp})`,
                        homeShots: 11,
                        homeSot: 4,
                        awayShots: 8,
                        awaySot: 3,
                        homePoss: 52
                    });
                } else {
                    list.push({
                        round: roundCode,
                        homeCode: hCode,
                        awayCode: aCode,
                        shortLabel: `${hCode} vs ${aCode}`,
                        utcIso,
                        status: roundCode,
                        name: `${hCode} vs ${aCode} (${roundCode} • ${grp})`,
                        homeShots: 0,
                        homeSot: 0,
                        awayShots: 0,
                        awaySot: 0,
                        homePoss: 0
                    });
                }
            });
        });

        return list;
    }

    const leagueFixturesData = {
        PL: [
            { round: 'MW9', homeCode: 'NEW', awayCode: 'EVE', shortLabel: 'NEW 0-1 EVE', utcIso: '2026-11-02T20:00:00Z', status: 'FT', hScore: 0, aScore: 1, name: 'NEW 0 - 1 EVE (MW9 FT)', homeShots: 14, homeSot: 4, awayShots: 11, awaySot: 5, homePoss: 54 },
            { round: 'MW9', homeCode: 'LIV', awayCode: 'ARS', shortLabel: 'LIV 2-1 ARS', utcIso: '2026-11-01T16:30:00Z', status: 'FT', hScore: 2, aScore: 1, name: 'LIV 2 - 1 ARS (MW9 FT)', homeShots: 16, homeSot: 6, awayShots: 13, awaySot: 4, homePoss: 53 },
            { round: 'MW10', homeCode: 'EVE', awayCode: 'COV', shortLabel: 'EVE vs COV', utcIso: '2026-11-06T20:00:00Z', status: 'MW10', name: 'EVE vs COV (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'LEE', awayCode: 'TOT', shortLabel: 'LEE vs TOT', utcIso: '2026-11-07T12:30:00Z', status: 'MW10', name: 'LEE vs TOT (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'ARS', awayCode: 'HUL', shortLabel: 'ARS vs HUL', utcIso: '2026-11-07T15:00:00Z', status: 'MW10', name: 'ARS vs HUL (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'FUL', awayCode: 'NEW', shortLabel: 'FUL vs NEW', utcIso: '2026-11-07T15:00:00Z', status: 'MW10', name: 'FUL vs NEW (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'NFO', awayCode: 'MCI', shortLabel: 'NFO vs MCI', utcIso: '2026-11-07T17:30:00Z', status: 'MW10', name: 'NFO vs MCI (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'BHA', awayCode: 'BRE', shortLabel: 'BHA vs BRE', utcIso: '2026-11-08T14:00:00Z', status: 'MW10', name: 'BHA vs BRE (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'CRY', awayCode: 'LIV', shortLabel: 'CRY vs LIV', utcIso: '2026-11-08T14:00:00Z', status: 'MW10', name: 'CRY vs LIV (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'IPS', awayCode: 'BOU', shortLabel: 'IPS vs BOU', utcIso: '2026-11-08T14:00:00Z', status: 'MW10', name: 'IPS vs BOU (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'SUN', awayCode: 'CHE', shortLabel: 'SUN vs CHE', utcIso: '2026-11-08T14:00:00Z', status: 'MW10', name: 'SUN vs CHE (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MW10', homeCode: 'MUN', awayCode: 'AVL', shortLabel: 'MUN vs AVL', utcIso: '2026-11-08T16:30:00Z', status: 'MW10', name: 'MUN vs AVL (MW10)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 }
        ],
        LALIGA: [
            { round: 'MD12', homeCode: 'ESP', awayCode: 'DEP', shortLabel: 'ESP vs DEP', utcIso: '2026-11-06T20:00:00Z', status: 'MD12', name: 'ESP vs DEP (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MD12', homeCode: 'RMA', awayCode: 'OSA', shortLabel: 'RMA vs OSA', utcIso: '2026-11-07T13:00:00Z', status: 'MD12', name: 'RMA vs OSA (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MD12', homeCode: 'VIL', awayCode: 'ALA', shortLabel: 'VIL vs ALA', utcIso: '2026-11-07T15:15:00Z', status: 'MD12', name: 'VIL vs ALA (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MD12', homeCode: 'MAL', awayCode: 'RAC', shortLabel: 'MAL vs RAC', utcIso: '2026-11-07T17:30:00Z', status: 'MD12', name: 'MAL vs RAC (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MD12', homeCode: 'LEV', awayCode: 'SEV', shortLabel: 'LEV vs SEV', utcIso: '2026-11-07T20:00:00Z', status: 'MD12', name: 'LEV vs SEV (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MD12', homeCode: 'BET', awayCode: 'CEL', shortLabel: 'BET vs CEL', utcIso: '2026-11-08T13:00:00Z', status: 'MD12', name: 'BET vs CEL (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MD12', homeCode: 'MLL', awayCode: 'ATM', shortLabel: 'MLL vs ATM', utcIso: '2026-11-08T15:15:00Z', status: 'MD12', name: 'MLL vs ATM (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MD12', homeCode: 'GIR', awayCode: 'ATH', shortLabel: 'GIR vs ATH', utcIso: '2026-11-08T17:30:00Z', status: 'MD12', name: 'GIR vs ATH (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MD12', homeCode: 'RAY', awayCode: 'VAL', shortLabel: 'RAY vs VAL', utcIso: '2026-11-08T17:30:00Z', status: 'MD12', name: 'RAY vs VAL (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'MD12', homeCode: 'RSO', awayCode: 'BAR', shortLabel: 'RSO vs BAR', utcIso: '2026-11-08T20:00:00Z', status: 'MD12', name: 'RSO vs BAR (MD12)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 }
        ],
        UCL: [
            { round: 'UCL4', homeCode: 'FEN', awayCode: 'LIV', shortLabel: 'FEN vs LIV', utcIso: '2026-11-03T17:45:00Z', status: 'UCL4', name: 'FEN vs LIV (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'PSV', awayCode: 'SHK', shortLabel: 'PSV vs SHK', utcIso: '2026-11-03T17:45:00Z', status: 'UCL4', name: 'PSV vs SHK (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'AEK', awayCode: 'RMA', shortLabel: 'AEK vs RMA', utcIso: '2026-11-03T20:00:00Z', status: 'UCL4', name: 'AEK vs RMA (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'RBL', awayCode: 'MCI', shortLabel: 'RBL vs MCI', utcIso: '2026-11-03T20:00:00Z', status: 'UCL4', name: 'RBL vs MCI (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'DOR', awayCode: 'POR', shortLabel: 'DOR vs POR', utcIso: '2026-11-03T20:00:00Z', status: 'UCL4', name: 'DOR vs POR (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'LIL', awayCode: 'ROM', shortLabel: 'LIL vs ROM', utcIso: '2026-11-03T20:00:00Z', status: 'UCL4', name: 'LIL vs ROM (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'SCP', awayCode: 'BET', shortLabel: 'SCP vs BET', utcIso: '2026-11-03T20:00:00Z', status: 'UCL4', name: 'SCP vs BET (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'BRU', awayCode: 'AVL', shortLabel: 'BRU vs AVL', utcIso: '2026-11-04T17:45:00Z', status: 'UCL4', name: 'BRU vs AVL (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'INT', awayCode: 'ARS', shortLabel: 'INT vs ARS', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: 'INT vs ARS (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'PSG', awayCode: 'ATM', shortLabel: 'PSG vs ATM', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: 'PSG vs ATM (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'BAY', awayCode: 'FEY', shortLabel: 'BAY vs FEY', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: 'BAY vs FEY (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 },
            { round: 'UCL4', homeCode: 'BAR', awayCode: 'GAL', shortLabel: 'BAR vs GAL', utcIso: '2026-11-04T20:00:00Z', status: 'UCL4', name: 'BAR vs GAL (UCL4)', homeShots: 0, homeSot: 0, awayShots: 0, awaySot: 0, homePoss: 0 }
        ],
        UNL: generateAll6MatchdaysUNL()
    };

    function sortFixturesChronologically(list) {
        return [...(list || [])].sort((a, b) => {
            const tA = a.utcIso ? new Date(a.utcIso).getTime() : Number.MAX_SAFE_INTEGER;
            const tB = b.utcIso ? new Date(b.utcIso).getTime() : Number.MAX_SAFE_INTEGER;
            if (tA !== tB) return tA - tB;
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
        // National teams (UNL)
        if (n === 'france') return 'FRA';
        if (n === 'italy') return 'ITA';
        if (n === 'belgium') return 'BEL';
        if (n.includes('türkiye') || n.includes('turkey')) return 'TUR';
        if (n === 'netherlands' || n === 'holland') return 'NED';
        if (n === 'greece') return 'GRE';
        if (n === 'germany') return 'GER';
        if (n === 'serbia') return 'SRB';
        if (n === 'spain') return 'ESP';
        if (n === 'england') return 'ENG';
        if (n === 'croatia') return 'CRO';
        if (n.includes('czech')) return 'CZE';
        if (n === 'portugal') return 'POR';
        if (n === 'denmark') return 'DEN';
        if (n === 'wales') return 'WAL';
        if (n === 'norway') return 'NOR';
        if (n === 'switzerland') return 'SUI';
        if (n === 'slovenia') return 'SVN';
        if (n === 'scotland') return 'SCO';
        if (n.includes('macedonia')) return 'MKD';
        if (n.includes('northern ireland')) return 'NIR';
        if (n === 'hungary') return 'HUN';
        if (n === 'ukraine') return 'UKR';
        if (n === 'georgia') return 'GEO';
        if (n === 'austria') return 'AUT';
        if (n === 'kosovo') return 'KOS';
        if (n.includes('republic of ireland') || n === 'ireland') return 'IRL';
        if (n === 'israel') return 'ISR';
        if (n === 'sweden') return 'SWE';
        if (n.includes('bosnia')) return 'BIH';
        if (n === 'poland') return 'POL';
        if (n === 'romania') return 'ROU';
        if (n === 'albania') return 'ALB';
        if (n === 'belarus') return 'BLR';
        if (n === 'finland') return 'FIN';
        if (n.includes('san marino')) return 'SMR';
        if (n === 'montenegro') return 'MNE';
        if (n === 'cyprus') return 'CYP';
        if (n === 'armenia') return 'ARM';
        if (n === 'latvia') return 'LVA';
        if (n === 'slovakia') return 'SVK';
        if (n.includes('faroe')) return 'FRO';
        if (n === 'moldova') return 'MDA';
        if (n === 'kazakhstan') return 'KAZ';
        if (n === 'iceland') return 'ISL';
        if (n === 'estonia') return 'EST';
        if (n === 'bulgaria') return 'BUL';
        if (n === 'luxembourg') return 'LUX';
        if (n === 'malta') return 'MLT';
        if (n === 'gibraltar') return 'GIB';
        if (n === 'andorra') return 'AND';
        if (n === 'azerbaijan') return 'AZE';
        if (n === 'lithuania') return 'LTU';
        if (n === 'liechtenstein') return 'LIE';
        // Club teams
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
        if (n.includes('racing') || n.includes('santander')) return 'RAC';
        if (n.includes('malaga') || n.includes('málaga')) return 'MAL';
        if (n.includes('deportivo la coruna') || n.includes('deportivo')) return 'DEP';
        if (n.includes('celta')) return 'CEL';
        if (n.includes('mallorca')) return 'MLL';
        if (n.includes('rayo') || n.includes('vallecano')) return 'RAY';
        if (n.includes('alaves') || n.includes('alavés')) return 'ALA';
        if (n.includes('espanyol')) return 'ESP';
        if (n.includes('levante')) return 'LEV';
        return null;
    }

    const FootballDB = {
        DB_VERSION: '2026.11.v43.unl_all_6_matchdays_156_fixtures',
        STORAGE_KEY: 'football_prediction_engine_espn_db_v43',
        state: null,
        lastRawESPNFixtureSample: null,
        seedData: {
            plTeamsData,
            laLigaTeamsData,
            uclTeamsData,
            unlTeamsData,
            leagueFixturesData
        },

        buildStandingsSnapshot(teamsObj) {
            const codes = Object.keys(teamsObj || {});
            const totalTeams = Math.max(2, codes.length);
            const rows = codes.map(code => {
                const t = teamsObj[code];
                const played = Math.max(1, t.played || 1);
                const gf = t.gf ?? Math.round((t.xg || 1.3) * played);
                const ga = t.ga ?? Math.round((t.xga || 1.2) * played);
                const gd = (t.gd !== undefined) ? t.gd : (gf - ga);
                const pts = t.pts ?? Math.round(played * 1.4);
                const ppg = Number((pts / played).toFixed(2));
                const espnRank = t.espnRank ? Number(t.espnRank) : null;
                return {
                    code,
                    name: t.name,
                    group: t.group || null,
                    groupOrder: t.groupOrder || 99,
                    groupRank: t.groupRank || null,
                    played,
                    gf,
                    ga,
                    gd,
                    pts,
                    ppg,
                    espnRank,
                    xg: t.xg,
                    form: t.form
                };
            }).sort((a, b) => {
                if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder;
                if (a.groupRank !== null && b.groupRank !== null && a.groupRank !== b.groupRank) return a.groupRank - b.groupRank;
                if (a.espnRank !== null && b.espnRank !== null && a.espnRank !== b.espnRank) return a.espnRank - b.espnRank;
                if (b.pts !== a.pts) return b.pts - a.pts;
                if (b.gd !== a.gd) return b.gd - a.gd;
                return b.gf - a.gf;
            });

            rows.forEach((r, idx) => {
                const rank = r.groupRank || r.espnRank || (idx + 1);
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
            const unlCopy = JSON.parse(JSON.stringify(unlTeamsData));

            this.state = {
                version: this.DB_VERSION,
                leagues: {
                    PL: {
                        teams: plCopy,
                        standings: this.buildStandingsSnapshot(plCopy),
                        fixtures: JSON.parse(JSON.stringify(leagueFixturesData.PL)),
                        fullSeasonSeededFromESPN: false,
                        formSeededFromESPN: false,
                        lastSyncedAt: new Date().toISOString()
                    },
                    LALIGA: {
                        teams: laLigaCopy,
                        standings: this.buildStandingsSnapshot(laLigaCopy),
                        fixtures: JSON.parse(JSON.stringify(leagueFixturesData.LALIGA)),
                        fullSeasonSeededFromESPN: false,
                        formSeededFromESPN: false,
                        lastSyncedAt: new Date().toISOString()
                    },
                    UCL: {
                        teams: uclCopy,
                        standings: this.buildStandingsSnapshot(uclCopy),
                        fixtures: JSON.parse(JSON.stringify(leagueFixturesData.UCL)),
                        fullSeasonSeededFromESPN: false,
                        formSeededFromESPN: false,
                        lastSyncedAt: new Date().toISOString()
                    },
                    UNL: {
                        teams: unlCopy,
                        standings: this.buildStandingsSnapshot(unlCopy),
                        fixtures: JSON.parse(JSON.stringify(leagueFixturesData.UNL)),
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

        purgeLeagueFixtures(leagueKey) {
            if (!this.state) this.init();
            if (this.state.leagues[leagueKey]) {
                this.state.leagues[leagueKey].fixtures = [];
                this.state.leagues[leagueKey].fullSeasonSeededFromESPN = false;
            }
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

        async syncFromESPN(leagueKey, forceRefresh = false) {
            if (!this.state) this.init();
            const cfg = leagueConfigs[leagueKey];
            const dbLeague = this.getLeague(leagueKey);
            if (!cfg || !dbLeague) return { changed: false };

            let targetTeams = JSON.parse(JSON.stringify(
                (dbLeague.teams && Object.keys(dbLeague.teams).length > 0)
                    ? dbLeague.teams
                    : (leagueKey === 'UNL' ? unlTeamsData : (leagueKey === 'LALIGA' ? laLigaTeamsData : (leagueKey === 'UCL' ? uclTeamsData : plTeamsData)))
            ));

            const espnIdToCode = {};
            const abbrToCode = {};
            Object.keys(targetTeams).forEach(code => {
                if (targetTeams[code]?.espnId) espnIdToCode[String(targetTeams[code].espnId)] = code;
                abbrToCode[code.toUpperCase()] = code;
            });

            // 1. Sync Standings from ESPN API (supports both flat League tables and multi-group UNL hierarchies)
            try {
                const stRes = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${cfg.espnSlug}/standings`);
                if (stRes.ok) {
                    const stData = await stRes.json();
                    const groupEntriesList = [];
                    const extractStandingsNodes = (node, parentName = '') => {
                        if (!node) return;
                        const nodeName = node.name || node.abbreviation || parentName || '';
                        if (node.standings?.entries && Array.isArray(node.standings.entries)) {
                            groupEntriesList.push({ groupName: nodeName, entries: node.standings.entries });
                        }
                        if (Array.isArray(node.children)) {
                            node.children.forEach(child => extractStandingsNodes(child, nodeName));
                        }
                    };
                    extractStandingsNodes(stData);

                    groupEntriesList.forEach(({ entries }) => {
                        entries.forEach((entry, idx) => {
                            const teamIdStr = entry.team?.id ? String(entry.team.id) : null;
                            let code = (teamIdStr && espnIdToCode[teamIdStr]) ? espnIdToCode[teamIdStr] : matchTeamNameToCode(entry.team?.displayName || entry.team?.name);
                            if (!code || !targetTeams[code]) return;

                            const stats = {};
                            (entry.stats || []).forEach(s => {
                                if (s.name) stats[s.name] = s.value ?? Number(s.displayValue);
                                if (s.abbreviation) stats[s.abbreviation] = s.value ?? Number(s.displayValue);
                            });

                            const gp = Math.max(1, Number(stats.gamesPlayed ?? stats.GP ?? targetTeams[code].played ?? 1));
                            const gf = Number(stats.pointsFor ?? stats.F ?? targetTeams[code].gf ?? 0);
                            const ga = Number(stats.pointsAgainst ?? stats.A ?? targetTeams[code].ga ?? 0);
                            const gd = Number(stats.pointDifferential ?? stats.GD ?? (gf - ga));
                            const pts = Number(stats.points ?? stats.P ?? targetTeams[code].pts ?? 0);

                            targetTeams[code].played = gp;
                            targetTeams[code].gf = gf;
                            targetTeams[code].ga = ga;
                            targetTeams[code].gd = gd;
                            targetTeams[code].pts = pts;
                            if (cfg.phaseType === 'GROUP_STAGE') {
                                targetTeams[code].groupRank = Number(stats.rank ?? (idx + 1));
                            } else {
                                targetTeams[code].espnRank = Number(stats.rank ?? (idx + 1));
                            }

                            const formStat = (entry.stats || []).find(s => s.name === 'form' || s.type === 'form' || s.abbreviation === 'FORM');
                            const parsedForm = parseFormString(formStat?.displayValue || formStat?.stringValue || formStat?.value);
                            if (parsedForm) targetTeams[code].form = parsedForm;
                        });
                    });
                }
            } catch (e) {}

            const resolveTeamCode = (teamObj) => {
                if (!teamObj) return null;
                if (teamObj.id && espnIdToCode[String(teamObj.id)] && targetTeams[espnIdToCode[String(teamObj.id)]]) {
                    return espnIdToCode[String(teamObj.id)];
                }
                const byName = matchTeamNameToCode(teamObj.displayName || teamObj.name || teamObj.shortDisplayName);
                if (byName && targetTeams[byName]) return byName;
                const abbr = (teamObj.abbreviation || '').toUpperCase();
                if (abbr && abbrToCode[abbr] && targetTeams[abbrToCode[abbr]]) return abbrToCode[abbr];
                return null;
            };

            const isEventCompleted = (comp) => {
                const st = comp?.status?.type;
                return Boolean(st?.completed === true || st?.state === 'post' || st?.shortDetail === 'FT');
            };

            const parseRawESPNEvent = (ev, explicitRoundCode = null) => {
                const comp = ev?.competitions?.[0];
                if (!comp) return null;
                const homeComp = (comp.competitors || []).find(c => c.homeAway === 'home');
                const awayComp = (comp.competitors || []).find(c => c.homeAway === 'away');
                if (!homeComp || !awayComp) return null;

                const hCode = resolveTeamCode(homeComp.team);
                const aCode = resolveTeamCode(awayComp.team);
                if (!hCode || !aCode || !targetTeams[hCode] || !targetTeams[aCode]) return null;

                // STRICT GROUP-STAGE INVARIANT: In Group Stage mode, reject any cross-group fixture
                if (cfg.phaseType === 'GROUP_STAGE') {
                    const hGroup = targetTeams[hCode]?.group;
                    const aGroup = targetTeams[aCode]?.group;
                    if (!hGroup || !aGroup || hGroup !== aGroup) return null;
                }

                if (!this.lastRawESPNFixtureSample) {
                    this.lastRawESPNFixtureSample = {
                        id: ev.id,
                        date: ev.date,
                        name: ev.name,
                        shortName: ev.shortName
                    };
                }

                const isDone = isEventCompleted(comp);
                const hScore = homeComp.score?.displayValue ?? homeComp.score?.value ?? homeComp.score ?? '0';
                const aScore = awayComp.score?.displayValue ?? awayComp.score?.value ?? awayComp.score ?? '0';
                const weekNum = ev.week?.number || comp.week?.number || null;
                const roundCode = explicitRoundCode || (weekNum ? `${cfg.roundPrefix}${weekNum}` : null);
                const shortLabel = isDone ? `${hCode} ${hScore}-${aScore} ${aCode}` : `${hCode} vs ${aCode}`;

                return {
                    eventId: String(ev.id || `${hCode}_${aCode}_${ev.date}`),
                    round: roundCode,
                    weekNumber: weekNum ? Number(weekNum) : null,
                    homeCode: hCode,
                    awayCode: aCode,
                    shortLabel,
                    utcIso: ev.date || comp.date,
                    status: isDone ? 'FT' : (roundCode || cfg.activeRound),
                    hScore: isDone ? Number(hScore) : undefined,
                    aScore: isDone ? Number(aScore) : undefined,
                    name: `${shortLabel} (${roundCode || cfg.activeRound})`,
                    homeShots: 0,
                    homeSot: 0,
                    awayShots: 0,
                    awaySot: 0,
                    homePoss: 0
                };
            };

            const harvestedByEventId = new Map();
            const eventRoundVotes = new Map();

            try {
                const sbRes = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${cfg.espnSlug}/scoreboard?limit=100`);
                if (sbRes.ok) {
                    const sbData = await sbRes.json();
                    (sbData.events || []).forEach(ev => {
                        const parsed = parseRawESPNEvent(ev, cfg.activeRound);
                        if (parsed) harvestedByEventId.set(parsed.eventId, parsed);
                    });
                }
            } catch (e) {}

            // 2. Harvest full season / group schedules & last-5 completed match forms across teams
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

                    const validLeagueEvents = [];
                    Array.from(combinedEventMap.values()).forEach(ev => {
                        const parsed = parseRawESPNEvent(ev, null);
                        if (parsed) {
                            validLeagueEvents.push({ rawEv: ev, parsed });
                        }
                    });

                    validLeagueEvents.sort((a, b) => new Date(a.rawEv.date).getTime() - new Date(b.rawEv.date).getTime());

                    const completedLeagueItems = validLeagueEvents.filter(item => item.parsed.status === 'FT');
                    if (completedLeagueItems.length >= 1) {
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
                        const existingForm = targetTeams[code].form || ['D', 'D', 'D', 'D', 'D'];
                        while (last5.length < 5) {
                            last5.unshift(existingForm[5 - 1 - last5.length] || 'D');
                        }
                        targetTeams[code].form = last5.slice(-5);
                    }

                    validLeagueEvents.slice(0, cfg.totalRounds).forEach(({ parsed }, idx) => {
                        const explicitWeek = parsed.weekNumber;
                        const inferredRoundNum = (explicitWeek && explicitWeek >= 1 && explicitWeek <= cfg.totalRounds)
                            ? explicitWeek
                            : Math.min(cfg.totalRounds, idx + 1);
                        if (!eventRoundVotes.has(parsed.eventId)) {
                            eventRoundVotes.set(parsed.eventId, []);
                        }
                        eventRoundVotes.get(parsed.eventId).push(inferredRoundNum);
                        harvestedByEventId.set(parsed.eventId, parsed);
                    });
                } catch (e) {}
            }));

            // Harvest into roundBuckets and fill any remaining slots from verified intra-group seed fixtures so every Matchday has all 26 matches
            const roundBuckets = {};
            const roundClubUsed = {};
            for (let r = 1; r <= cfg.totalRounds; r++) {
                const rCode = `${cfg.roundPrefix}${r}`;
                roundBuckets[rCode] = [];
                roundClubUsed[rCode] = new Set();
            }

            const allHarvested = sortFixturesChronologically(Array.from(harvestedByEventId.values()));
            allHarvested.forEach(fix => {
                if (cfg.phaseType === 'GROUP_STAGE' && targetTeams[fix.homeCode]?.group !== targetTeams[fix.awayCode]?.group) {
                    return;
                }
                const votes = eventRoundVotes.get(fix.eventId) || [];
                const rNum = (fix.weekNumber && fix.weekNumber >= 1 && fix.weekNumber <= cfg.totalRounds)
                    ? fix.weekNumber
                    : (votes.length > 0 ? Math.min(cfg.totalRounds, Math.max(1, Math.round(votes.reduce((a, b) => a + b, 0) / votes.length))) : null);
                const rCode = rNum ? `${cfg.roundPrefix}${rNum}` : (fix.round || cfg.activeRound);
                if (roundBuckets[rCode] &&
                    roundBuckets[rCode].length < cfg.matchesPerRound &&
                    !roundClubUsed[rCode].has(fix.homeCode) &&
                    !roundClubUsed[rCode].has(fix.awayCode)) {
                    roundBuckets[rCode].push({ ...fix, round: rCode });
                    roundClubUsed[rCode].add(fix.homeCode);
                    roundClubUsed[rCode].add(fix.awayCode);
                }
            });

            // Guarantee all 26 intra-group matches per Matchday for UNL (and full round fixtures for PL/LaLiga/UCL)
            (leagueFixturesData[leagueKey] || []).forEach(seedFix => {
                const rCode = seedFix.round;
                if (cfg.phaseType === 'GROUP_STAGE' && targetTeams[seedFix.homeCode]?.group !== targetTeams[seedFix.awayCode]?.group) {
                    return;
                }
                if (roundBuckets[rCode] &&
                    roundBuckets[rCode].length < cfg.matchesPerRound &&
                    !roundClubUsed[rCode].has(seedFix.homeCode) &&
                    !roundClubUsed[rCode].has(seedFix.awayCode)) {
                    roundBuckets[rCode].push(seedFix);
                    roundClubUsed[rCode].add(seedFix.homeCode);
                    roundClubUsed[rCode].add(seedFix.awayCode);
                }
            });

            const finalFixtures = [];
            Object.keys(roundBuckets).forEach(rCode => {
                finalFixtures.push(...sortFixturesChronologically(roundBuckets[rCode]));
            });

            this.saveLeague(leagueKey, targetTeams, finalFixtures, true);
            return { changed: true, activeRound: cfg.activeRound };
        }
    };

    FootballDB.init();
    global.FootballDB = FootballDB;
})(typeof window !== 'undefined' ? window : this);