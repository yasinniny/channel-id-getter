const fs = require('fs');
const {Client, Intents} = require('discord.js');
const {token, exception} = require('./util/config.json');

const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.once('ready', async () => {
    const channels = client.channels;
    const allChannelId = {};
    
    // task: when found the same c name -> how to distinguish it.
    // task: the way to store data.
    // If you want to remove the specific category to add, add the exception into ./util/config.json as array
    // now, doesnt support the same category name please add to the exception

    function hyphen(name) {
        if (name.indexOf('-') !== -1) {
            return name.replaceAll("-", "_");
        } else {
            return name;
        };
    };

    channels.cache
        .sort((a, b) => a.rawPosition - b.rawPosition)
        .each(c => {
            for (let key of exception) {
                if (c.name !== key && c.type === "GUILD_CATEGORY") {
                    let changedName = hyphen(c.name);
                    allChannelId[changedName] = [c.id];
                };
            };
        });

    channels.cache
        .sort((a, b) => a.rawPosition - b.rawPosition)
        .filter(c => c.type === "GUILD_TEXT" || "GUILD_VOICE")
        .each(async (c) => {
            for (let p in allChannelId) {
                if (c.parentId === allChannelId[p][0]) {
                    const finalName = hyphen(c.name);
                    allChannelId[p].push({[finalName]: c.id});
                };
            };
        })
    const channelData = JSON.stringify(allChannelId);
    try {
       fs.writeFileSync("channelData.json", channelData);
    } catch (error) {
        console.error(error);
    }
    console.log("Successful!");
});

client.login(token);

