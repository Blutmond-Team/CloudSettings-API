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

    const uuid = (responseBody.id as string).replaceAll('-', '');
    const validateUUID = await fetch('https://playerdb.co/api/player/minecraft/' + uuid);

    if (!validateUUID.ok) {
        token.error = "User UUID validation failed. Request Failed.";
        console.error(token.error);
        return Promise.reject(token);
    }

    const validationBody = await validateUUID.json();

    if (!validationBody.success) {
        token.error = "User UUID validation failed. Invalid User!";
        console.error(token.error);
        return Promise.reject(token);
    }

    token.minecraftUserName = responseBody.name;
    token.minecraftUUID = uuid;

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

export function mcHexDigest(str: string) {
    // The hex digest is the hash made below.
    // However, when this hash is negative (meaning its MSB is 1, as it is in two's complement), instead of leaving it
    // like that, we make it positive and simply put a '-' in front of it. This is a simple process: as you always do
    // with 2's complement you simply flip all bits and add 1

    let hash = crypto.createHash('sha1')
        .update('') // serverId = just an empty string
        .update(str)
        .digest()

    // Negative check: check if the most significant bit of the hash is a 1.
    const isNegative = (hash.readUInt8(0) & (1 << 7)) !== 0 // when 0, it is positive

    if (isNegative) {
        // Flip all bits and add one. Start at the right to make sure the carry works
        const inverted = Buffer.allocUnsafe(hash.length)
        let carry = 0
        for (let i = hash.length - 1; i >= 0; i--) {
            let num = (hash.readUInt8(i) ^ 0b11111111) // a byte XOR a byte of 1's = the inverse of the byte
            if (i === hash.length - 1) num++
            num += carry
            carry = Math.max(0, num - 0b11111111)
            num = Math.min(0b11111111, num)
            inverted.writeUInt8(num, i)
        }
        hash = inverted
    }
    let result = hash.toString('hex').replace(/^0+/, '')
    // If the result was negative, add a '-' sign
    if (isNegative) result = `-${result}`

    return result

}