const express = require('express');
const app = express();
const PORT = process.env.PORT || 3551;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[CLOUD TRAFFIC] Caught request: req.method {req.url}`);
    next();
});

app.post('/account/api/oauth/token', (req, res) => {
    res.json({
        access_token: "cloud_secured_token_string",
        expires_in: 28800,
        token_type: "bearer",
        account_id: req.body.username || "CloudPlayer",
        client_id: "fn",
        displayName: req.body.username || "Player1"
    });
});

app.post('/fortnite/api/game/v2/profile/:accountId/client/:command', (req, res) => {
    const profileId = req.query.profileId || "athena";
    
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
                        "CID_001_Athena_Commando_M_Default": {
                            templateId: "AthenaCharacter:cid_001_athena_commando_m_default",
                            attributes: { favorite: true },
                            quantity: 1
                        }
                    },
                    stats: {
                        attributes: {
                            level: 100,
                            xp: 0,
                            vbucks_balance: 999999,
                            season_match_boost: 0
                        }
                    }
                }
            }]
        });
    }
    res.json({ profileRevision: 1, profileId: profileId, profileChanges: [] });
});

app.get('/fortnite/api/matchmaking/session/matchMakingRequest', (req, res) => {
    res.json({
        id: "LiveMultiplayerSessionID",
        region: "NAE",
        titleId: "Fortnite",
        setting: { CUSTOM_GAME_CODE: "PLAY" },
        status: "SESSION_ONLINE",
        serverAddress: "127.0.0.1",
        serverPort: 7777
    });
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`     CUSTOM FORTNITE CLOUD MULTIPLAYER SERVER     `);
    console.log(`==================================================`);
    console.log(`[SUCCESS] Backend engine is active on port \${PORT}!`);
});
