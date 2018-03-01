// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

const activity = 'Casser du Jitan'
// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

var summon = false;
//Alpha, Vincent, Iku, Dylan
var rpistesID = ["290613064200486912", "328596439154425858", "174630956567756802", "224225061270323210"];

var rpistes = Array(4);
var indexi = 0;
var rpiste;
var bois;


client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(activity);
  bois = client.guilds.get("356146772638171138")
  for (var i = 0; i < rpistesID.length; i++) {
    rpistes[i] = client.users.get(rpistesID[i]);
  }
});
client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(activity);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`on ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  if (message.content === "Elle est où la poulette ?") {
    message.channel.sendMessage("Elle est bien cachée ?");
  }




  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if (command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o => { });
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }

  if (command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if (!message.member.roles.some(r => ["Master", "Hybride Tempérée", "Nain Posteur", "Bots à la con"].includes(r.name)))
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if (!member)
      return message.reply("Please mention a valid member of this server");
    if (!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if (!reason)
      return message.reply("Please indicate a reason for the kick!");

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  if (command === "summon") {
    if (summon == false) {
      let member = message.mentions.members.first();
      if (member.id == client.user.id) {
        summon = true;
        return message.reply("Invocation réussie.");
      }
    }
    else {
      return message.reply("Je suis déjà là enculé.")
    }
  }
  if (command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if (!message.member.roles.some(r => ["Administrator"].includes(r.name)))
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if (!member)
      return message.reply("Please mention a valid member of this server");
    if (!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if (!reason)
      return message.reply("Please indicate a reason for the ban!");

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if (command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    // Ooooh nice, combined conditions. <3
    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    ///const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(deleteCount)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    message.channel.sendMessage(`Suppression des ${deleteCount} derniers messages.`)
  }
  if (command === "cc") {
    var coucfeaf = client.users.get("216548534743334914");
    message.channel.sendMessage(`<@${coucfeaf.id}> va bien te faire enculer`);
  }
  if (command === "set") {
    message.delete();
    let member = message.mentions.members.first();
    if (rpistesID.includes(member.id)) {
      indexi = rpistesID.indexOf(member.id);
      message.channel.sendMessage(`C'est à <@${rpistes[indexi].id}> de répondre !`);
    }
    else {
      message.channel.sendMessage(`<@${member.id}> n'appartient pas au RP !`);
    }
  }
  if (command === "next") {
    message.delete();
    indexi++;
    if (indexi == rpistes.length)
      indexi = 0;

    message.channel.sendMessage(`C'est à <@${rpistes[indexi].id}> de répondre !`);
  }
  if (command === "prev") {
    message.delete();
    indexi--;
    if (indexi == 0)
      indexi = rpistes.length;

    message.channel.sendMessage(`C'est à <@${rpistes[indexi].id}> de répondre !`);
  }
  if (command === "rap") {
    message.delete();
    message.channel.sendMessage(`C'est à <@${rpistes[indexi].id}> de répondre !`);
  }
  if (command === "help") {
    if (message.guild.id == "356146772638171138") {
      let channela = client.channels.get("415919737516851200")
      channela.send({
        embed: {
          color: 3447003,
          description: "A very simple Embed!",
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: "Liste des commandes de notre chère Blooden.",
          description: "Réalisé par <@216548534743334914>.",

          fields: [{
            name: "bd!cc",
            value: "Insulte le créateur."
          },
          {
            name: "bd!say",
            value: "Blooden dit le message d'après."
          },
          {
            name: "bd!summon @Blooden",
            value: "Invocation de Blooden (usage unique)."
          },
          {
            name: "bd!ping",
            value: "retourne le ping."
          },
          {
            name: "bd!kick",
            value: "Kick l'utilisateur mentionné."
          },
          {
            name: "bd!ban",
            value: "Ban l'utilisateur mentionné."
          },
          {
            name: "bd!purge",
            value: "Purge le nombre de messages mis en paramètres."
          },
          {
            name: "bd!help",
            value: "Affiche les commandes."
          },
          ],



        }
      });
      channela.send({
        embed: {
          color: 3447003,
          description: "A very simple Embed!",
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: "Liste des commandes liées au RP de notre chère Blooden.",
          description: "Réalisé par <@216548534743334914>.",

          fields: [{
            name: "bd!set",
            value: "Désigne la prochaine personne qui doit répondre."
          },
          {
            name: "bd!next",
            value: "Passe à la personne suivante."
          },
          {
            name: "bd!prev",
            value: "Reviens à la personne précédente."
          },
          {
            name: "bd!rap",
            value: "Rappelle la personne qui doit répondre."
          }
          ],
        }
      });
    }
  }
});

client.login(config.token);