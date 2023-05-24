import {CloudSettingsToken, MsStoreItem} from "@/src/types/AuthTypes";

async function applyXboxLoginData(token: CloudSettingsToken): Promise<CloudSettingsToken> {
    const response = await fetch('https://user.auth.xboxlive.com/user/authenticate', {
        method: "POST",
        body: JSON.stringify({
            "Properties": {
                "AuthMethod": "RPS",
                "SiteName": "user.auth.xboxlive.com",
                "RpsTicket": `d=${token.accessToken}`
            },
            "RelyingParty": "http://auth.xboxlive.com",
            "TokenType": "JWT"
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    // Early exit if xbox login failed
    if (!response.ok) {
        token.error = "Could not log in into xbox live\n" + response.statusText
        console.error(token.error);
        return Promise.reject(token);
    }
    const responseBody = await response.json();
    token.xboxToken = responseBody.Token;
    token.xboxUserHash = responseBody.DisplayClaims.xui[0].uhs;

    return token;
}

async function applyMinecraftServicesData(token: CloudSettingsToken): Promise<CloudSettingsToken> {
    const response = await fetch('https://xsts.auth.xboxlive.com/xsts/authorize', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "Properties": {
                "SandboxId": "RETAIL",
                "UserTokens": [
                    token.xboxToken
                ]
            },
            "RelyingParty": "rp://api.minecraftservices.com/",
            "TokenType": "JWT"
        })
    });

    if (!response.ok) {
        token.error = "Could not log in into minecraft services\n" + response.statusText
        console.error(token.error);
        return Promise.reject(token);
    }

    const responseBody = await response.json();
    token.minecraftServicesToken = responseBody.Token;
    token.minecraftServicesUserHash = responseBody.DisplayClaims.xui[0].uhs;

    return token;
}

async function applyMinecraftData(token: CloudSettingsToken): Promise<CloudSettingsToken> {
    const response = await fetch('https://api.minecraftservices.com/authentication/login_with_xbox', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({"identityToken": `XBL3.0 x=${token.minecraftServicesUserHash};${token.minecraftServicesToken}`})
    });

    if (!response.ok) {
        token.error = "Could not log in into minecraft\n" + response.statusText
        console.error(token.error);
        return Promise.reject(token);
    }

    const responseBody = await response.json();
    token.minecraftAccessToken = responseBody.access_token

    return token;
}

async function checkOwnsMinecraft(token: CloudSettingsToken): Promise<CloudSettingsToken> {
    const response = await fetch('https://api.minecraftservices.com/entitlements/mcstore', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token.minecraftAccessToken}`
        }
    });

    if (!response.ok) {
        token.error = "Could not check ms store for minecraft\n" + response.statusText
        console.error(token.error);
        return Promise.reject(token);
    }

    const responseBody = await response.json();
    const ownsMinecraft: boolean = responseBody.items.filter((item: MsStoreItem) => item.name === "game_minecraft").length > 0;

    if (!ownsMinecraft) return Promise.reject(token);
    return token;
}

async function getMinecraftProfile(token: CloudSettingsToken): Promise<CloudSettingsToken> {
    const response = await fetch('https://api.minecraftservices.com/minecraft/profile', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token.minecraftAccessToken}`
        }
    });

    if (!response.ok) {
        token.error = "Could not get minecraft profile\n" + response.statusText
        console.error(token.error);
        return Promise.reject(token);
    }

    const responseBody = await response.json();
    token.minecraftUserName = responseBody.name;
    token.minecraftUUID = responseBody.id;

    return token;
}

export async function loginIntoMinecraft(token: CloudSettingsToken): Promise<CloudSettingsToken> {
    return applyXboxLoginData(token)
        .then(value => applyMinecraftServicesData(value)
            .then(value1 => applyMinecraftData(value1)
                .then(value2 => checkOwnsMinecraft(value2)
                    .then(value3 => getMinecraftProfile(value3))
                )
            )
        );
}