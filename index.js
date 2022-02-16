const fs = require('fs');
const {Client, Intents} = require('discord.js');
const {token, exception} = require('./util/config.json');

const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.once('ready', async () => {
    const channels = client.channels;
    const allChannelId = {};
    
    // task: when found the same c name -> how to distinguish it.
    // If you want to remove the specific category to add, add the exception into ./util/config.json as array
    // now, doesnt support the same category name please add to the exception
    channels.cache
        .sort((a, b) => a.rawPosition - b.rawPosition)
        .each(c => {
            for (let key of exception) {
                if (c.name !== key && c.type === "GUILD_CATEGORY") {
                    allChannelId[c.name] = [c.id];
                };
            };
        })

    channels.cache
        .sort((a, b) => a.rawPosition - b.rawPosition)
        .filter(c => c.type === "GUILD_TEXT" || "GUILD_VOICE")
        .each(async (c) => {
            for (let p in allChannelId) {
                if (c.parentId === allChannelId[p][0]) {
                    allChannelId[p].push({[c.name]: c.id});
                };
            };
        })
    console.log(allChannelId);
    const channelData = JSON.stringify(allChannelId);
    try {
        fs.writeFileSync("./util/channelData.json", channelData);
    } catch (error) {
        console.error(error);
    }
    console.log("Successful!");
});

client.login(token);

