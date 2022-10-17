const Discord = require("discord.js");
const db = require("quick.db")

module.exports.run = async (bot, message, args) => {
    if (message.author.id !== "952639181987926048" && message.author.id !== "970413123238510662" && message.author.id !== "396356212066746368") {
        return message.channel.send("You can't")
    } else {

        const key = args[0];
        if (!key) return message.channel.send("Specify a key")

        const keydb = Object.values(db.get(`keys_${bot.id}`)).find(element => element.cle === key);
        if (!keydb) return message.channel.send('Key doesn\'t exist');
        const data = Object.values(db.get(`keys_${bot.id}`));
        const newArray = [];
        for (let d of data) {
            if (d.cle == key) continue;
            else newArray.push(d)
        }
        db.set(`keys_${bot.id}`, newArray);
        return message.channel.send('Key deleted')
    }
}

module.exports.help = {
    name: "deletekey"
}