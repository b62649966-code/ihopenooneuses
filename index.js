const express = require('express');
const app = express();
const PORT = process.env.PORT || 3551;

app.use(express.json());

// 🔍 ADVANCED CLOUD TELEMETRY LOGGER (Pushes logs directly to Render Console)
app.use((req, res, next) => {
    console.log(`\n================== [CLOUD TRAFFIC DETECTED] ==================`);
    console.log(`[TIME]: ${new Date().toISOString()}`);
    console.log(`[METHOD/ROUTE]: ${req.method} -> ${req.url}`);
    console.log(`[CLIENT IP]: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
    console.log(`[USER-AGENT]: ${req.headers['user-agent']}`);
    
    if (Object.keys(req.query).length > 0) {
        console.log(`[URL QUERY CONSTANTS]:`, JSON.stringify(req.query, null, 2));
    }
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`[INCOMING DATA PAYLOAD]:`, JSON.stringify(req.body, null, 2));
    }
    console.log(`==============================================================`);
    next();
});

// 1. HANDSHAKE AUTHORIZATION ENDPOINT
app.post('/account/api/oauth/token', (req, res) => {
    const requestedUser = req.body.username || "CloudPlayer";
    console.log(`[CLOUD-AUTH] Generating token handshake for user: "${requestedUser}"`);
    res.json({
        access_token: "secured_cloud_session_token_string",
        expires_in: 28800,
        token_type: "bearer",
        account_id: requestedUser,
        client_id: "fn",
        displayName: requestedUser
    });
});

// 2. PROFILE ENGINE (SYNC LOCKER ASSETS)
app.post('/fortnite/api/game/v2/profile/:accountId/client/:command', (req, res) => {
    const profileId = req.query.profileId || "athena";
    console.log(`[CLOUD-PROFILE] Engine processing profile adjustments for: "${profileId}"`);
    
    if (profileId === "athena") {
        return res.json({
            profileRevision: 1,
            profileId: "athena",
            profileChangesBaseRevision: 1,
            profileChanges: [{
                changeType: "fullProfileUpdate",
                profile: {
                    accountId: req.params.accountId,
                    profileId: "athena",
                    items: {
                        "CID_001_Athena_Commando_M_Default": { templateId: "AthenaCharacter:cid_001_athena_commando_m_default", attributes: { favorite: true }, quantity: 1 },
                        "CID_028_Athena_Commando_F_Scarecrow": { templateId: "AthenaCharacter:cid_028_athena_commando_f_scarecrow", attributes: { favorite: false }, quantity: 1 },
                        "CID_050_Athena_Commando_M_Galaxy": { templateId: "AthenaCharacter:cid_050_athena_commando_m_galaxy", attributes: { favorite: false }, quantity: 1 },
                        "CID_035_Athena_Commando_M_BlackKnight": { templateId: "AthenaCharacter:cid_035_athena_commando_m_blackknight", attributes: { favorite: false }, quantity: 1 },
                        "CID_313_Athena_Commando_M_KPopCavalry": { templateId: "AthenaCharacter:cid_313_athena_commando_m_kpopcavalry", attributes: { favorite: false }, quantity: 1 }
                    },
                    stats: { attributes: { level: 100, xp: 0, vbucks_balance: 999999, season_match_boost: 50, loadout_presets: {} } }
                }
            }]
        });
    }
    res.json({ profileRevision: 1, profileId: profileId, profileChanges: [] });
});

// 3. MULTIPLAYER MATCHMAKING ROUTER
app.get('/fortnite/api/matchmaking/session/matchMakingRequest', (req, res) => {
    console.log(`[CLOUD-MATCHMAKER] Intercepting game matchmaking queue initialization loop...`);
    res.json({
        id: "CloudMultiplayerSessionID",
        region: "NAE",
        titleId: "Fortnite",
        setting: { CUSTOM_GAME_CODE: "PLAY" },
        status: "SESSION_ONLINE",
        serverAddress: "127.0.0.1",
        serverPort: 7777
    });
});

// 🛠️ 4. GLOBAL CATCH-ALL ROUTE (Catches any version check/hotfix routes and logs them explicitly to cloud)
app.use((req, res) => {
    console.log(`[CLOUD CATCH-ALL] Game hit unhandled path: [${req.method}] ${req.url} -> Returning safe fallback layout.`);
    res.status(200).json({});
});

app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`     LIVE FORTNITE CLOUD SERVER MANAGEMENT RUNTIME      `);
    console.log(`========================================================`);
    console.log(`[SUCCESS] Cloud server is fully active on port: ${PORT}`);
    console.log(`[INFO] Telemetry active. All game requests will stream below.`);
});
