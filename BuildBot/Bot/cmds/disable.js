const Discord = require("discord.js");
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if (message.author.id !== "952639181987926048" && message.author.id !== "970413123238510662" && message.author.id !== "396356212066746368") {
        return message.channel.send("You can't")
    } else {
    if(!args[0]) return message.channel.send("Please use `$disable true` or `$disable false`")
    if(args[0] === "true") {
        message.channel.send("I disabled the build command!")
        db.set(`status_${bot.id}`, true)
    }
    if(args[0] === "false") {
        message.channel.send("I enabled the build command!")
        db.set(`status_${bot.id}`, false)
    }
}
}
module.exports.help = {
  name: "disable"
}