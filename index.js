const commando = require('discord.js-commando');
require('dotenv').config();

const client = new commando.Client({
    commandPrefix: '!',
    unknownCommandResponse: false,
    owner: '254728052070678529',
    disableEveryone: true    
});

const lypopReplies = ['Poor Myriad...', 'Myriad will be displeased.', ':regional_indicator_i: :heart: :lollipop:', 'Haha- oh darn too late.', '\'s are good.']
const reactionReplies = ["I may just be a lowly peasant m'lord... But I'm not daft!", "Cough", ":eyes:", "I'm literally right here m'lord...", "I'll 'ave you know m'lord, I read and processitize ev'ry chat that comes through 'ere!", "Now, now... No need to be rude m'lord"]
const reactionEmojis = ['381325006761754625', '🤔', '😂', '😭', '😅'];

const recentNewMembers = {}; // Structured { user_id: timestamp }

client.on('ready', () => {
    console.log('Bot running.');
    client.user.setActivity('Warcube');
});

client.on('message', message => {

	// Message easter eggs
    if (message.content.endsWith('lol')) {
        if (message.author.id == 356587391085051905 && Math.floor(Math.random() * 2) === 1) {
            message.channel.send('Haha');
        } else if (Math.floor(Math.random() * 30) + 1 === 1) message.channel.send('lypop').then(m => m.channel.send('Yer welcome, lord Shermy.'));
    }
    if (message.content.toLowerCase() === 'lypop' || message.content.toLowerCase() === 'lipop' || message.content.toLowerCase() === 'lollypop') {
        message.react('🍭');
        if (message.author.id == 263313632585187330) message.channel.send(lypopReplies[Math.floor(Math.random() * lypopReplies.length)]);
	}
	
	if (message.content.includes('peter') && (message.content.includes('reaction') || message.content.includes('react'))) {
		message.channel.send(reactionReplies[Math.floor(Math.random() * reactionReplies.length)])
	}

	// Random Reactions
    if (Math.floor(Math.random() * 40) + 1 === 1) message.react(reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)]);
});

client.on("guildMemberAdd", member => {
	recentNewMembers[member.id] = Date.now();
    member.guild.channels.find(c => c.type === 'text' && (c.name.includes('welcome') || c.name.includes('general'))).send(`Hi there, ${member.user.username}, welcome to the Official Warcube Discord!`);
});

client.on("guildMemberRemove", member => {
	if (Date.now() - recentNewMembers[member.id] < 120000) // If a member left within 2 minutes of joining, it's probably a bot.
    	member.guild.channels.find(c => c.type === 'text' && (c.name.includes('welcome') || c.name.includes('general'))).send(`Oh dear, another bot. Everyone say bye to ${member.user.username} :(`);
});


client.on('error', e => console.log);

client.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
        help: false,
        eval_: false
    })
    .registerGroups([
        ['public', 'Public Member Commands'],
        ['admin', 'Administrator Commands'],
        ['dev', 'Developer Commands']
    ])
    .registerCommandsIn(__dirname + '/commands');

client.login(process.env.token);