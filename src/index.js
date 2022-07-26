require("dotenv").config()

const { Client, SlashCommandBuilder } = require('discord.js');
const client = new Client({
    intents: 3276799
});

var fs = require('fs');

var config = {
    chartChannel: "1000502352970784878",
    verificationChannel: "1000502368141578300",
    listeningChannel: [
        "1000502405533794365",
        "1000502387355689061",
        "1000502395748483302"
    ]
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    readConfig();
});

client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (!config.listeningChannel.includes(message.channel.id)) return;
    if (message.content.includes("https://www.tradingview.com/") || message.attachments.size) {
        message.react("👍");

        const button1 = {
            "style": 3,
            "label": "👍",
            "custom_id": "button1",
            "disabled": false,
            "type": 2
        }
        const button2 = {
            "style": 4,
            "label": "👎",
            "custom_id": "button2",
            "disabled": false,
            "type": 2
        }

        const from = {
            "style": 5,
            "label": "Conversation",
            "url": "https://discord.com/channels/" + message.guildId + "/" + message.channelId + "/" + message.id,
            "disabled": false,
            "type": 2
        }

        let attachments = new Array;

        message.attachments.forEach(attachment => {
            attachments.push({
                "attachment": attachment.url,
                "name": attachment.name
            })
        })
        client.channels.cache.get(config.verificationChannel).send({
            "content": "***Message de <@" + message.author.id + ">:***\n" + message.content,
            "files": attachments,
            "components": [
                {
                    "type": 1,
                    "components": [
                        button1,
                        button2,
                        from
                    ]
                }
            ]
        })
    }
});

client.on('interactionCreate', interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === "button1") {
            let attachments = new Array;

            interaction.message.attachments.forEach(attachment => {
                attachments.push({
                    "attachment": attachment.url,
                    "name": attachment.name
                })
            })

            client.channels.cache.get(config.chartChannel).send({
                "content": interaction.message.content,
                "files": attachments,
                "components": [
                    {
                        "type": 1,
                        "components": [
                            {
                                "style": 5,
                                "label": "Conversation",
                                "url": interaction.message.components[0].components[2].url,
                                "disabled": false,
                                "type": 2
                            }
                        ]
                    }
                ]
            });
            interaction.message.delete(true);
        }
        if (interaction.customId === "button2")
            interaction.message.delete(true);
    }
})

client.login(process.env.DISCORD_TOKEN);

function writeConfig() {
    var data = JSON.stringify(config);

    fs.writeFile('./config.json', data, function (err) {
        if (err) {
            console.log('There has been an error saving your configuration data.');
            console.log(err.message);
            return;
        }
        console.log('Configuration saved successfully.')
    });
}

function readConfig() {
    var data = fs.readFileSync('./config.json'),
        config;
    try {
        config = JSON.parse(data);
    }
    catch (err) {
        writeConfig();
    }
}