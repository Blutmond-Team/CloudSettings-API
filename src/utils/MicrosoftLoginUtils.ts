import {
    CloudSettingsToken,
    MinecraftServicesProfile,
    MinecraftServicesProfileError,
    MsStoreItem
} from "@/src/types/AuthTypes";

import * as crypto from "crypto";

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

export async function userProfileFromToken(token: string): Promise<MinecraftServicesProfile | MinecraftServicesProfileError> {
    const response = await fetch('https://api.minecraftservices.com/minecraft/profile', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        return {
            status: response.status,
            statusText: response.statusText,
            success: false
        };
    }

    const body = await response.json();

    return {
        ...body,
        success: true
    };
}

export function mcHexDigest(str: string) {
    const hash = new Buffer(crypto.createHash('sha1').update(str).digest('binary'));
    // check for negative hashes
    const negative = hash.readInt8(0) < 0;
    if (negative) performTwosCompliment(hash);
    let digest = hash.toString('hex');
    // trim leading zeroes
    digest = digest.replace(/^0+/g, '');
    if (negative) digest = '-' + digest;
    return digest;

}

function performTwosCompliment(buffer: Buffer) {
    let carry = true;
    let i, newByte, value;
    for (i = buffer.length - 1; i >= 0; --i) {
        value = buffer.readUInt8(i);
        newByte = ~value & 0xff;
        if (carry) {
            carry = newByte === 0xff;
            buffer.writeUInt8(carry ? 0 : newByte + 1, i);
        } else {
            buffer.writeUInt8(newByte, i);
        }
    }
}