const Discord = require("discord.js");

var prefix = "bd!";
var bot = new Discord.Client()

bot.on('ready', function () {
    bot.user.setPresence({ game: { name: "FairechierDylan.exe", type: 0}})
  console.log("Je suis connecté !")
})

bot.login(process.env.BOT_TOKEN);

bot.on('message', message =>{
    if (message.content == "ping"){
        //message.reply("C'est cassé");
        console.log("Ping PONG");
    }
    if(message.content==prefix+ "help"){
        var help_embed = new Discord.RichEmbed()
            .setTitle("Liste des commandes")
            .setDescription("-------------")
            .setAuthor("Blooden","https://i.imgur.com/lm8s41J.png")
            .setColor(0xDB7093)
            .addField("bd!help","Demander de l'aide à Blooden", true)
        message.channel.sendEmbed(help_embed);
        console.log("Commandes event");
    }
    if(message.content==prefix+"projet"){
        var proj_embed = new Discord.RichEmbed()
        .setTitle("Liste des projets en cours")
        .addBlankField(true)
        .setAuthor("Blooden","https://media.discordapp.net/attachments/338025040069132310/415510804511850507/Blooden.png")
        .setColor(0xDB7093)
        .addField("Désignation du prochain à répondre","En cours",true)
        .addBlankField(true)
        .addField("Rappel sur le prochain à répondre","En cours",true)
        .addBlankField(true)
    }
});
