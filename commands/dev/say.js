const commando = require('discord.js-commando');

module.exports = class SayCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'say',
            group: 'dev',
            memberName: 'say',
            description: 'Have the bot say something.\nExclusive access.',
            argsPromptLimit: 0,
            args: [
                {
                    key: 'botMsg',
                    prompt: 'Please specify something for the bot to say.',
                    type: 'string',
                    default: '',
					validate: botMsg => { if (botMsg) return true; else return true; }
                }
            ]
        });
    }

    async run (message, { botMsg }) {
        
		// Craigz and Snowful and the [+] role.
        if (!["254728052070678529", "168190789715755009"].some((id) => message.author.id === id) || !message.member.roles.get('453259812931895299')) return;
        
        message.delete(() => console.log('Error deleting message'));
        var toChannel = message.channel;
        
        if (botMsg.startsWith('to ')) {
            
            botMsg = botMsg.slice(3);
            let chanName = botMsg.split(' ')[0];
            toChannel = await message.guild.channels.find(channel => channel.name.includes(chanName));

            if (!toChannel || toChannel.type != 'text') return message.channel.send("Couldn't find channel (or it's not a text channel).");
            botMsg = botMsg.slice(chanName.length);
        }

        while (botMsg.includes('@ ')) {

            var toTag = await botMsg.split('@ ')[1].split(' ')[0];
            var member = message.guild.members.find(member => member.displayName.toLowerCase().includes(toTag.toLowerCase()));
            
            botMsg = botMsg.replace(`@ ${toTag}`, member);
        }
        toChannel.send(botMsg);
    }
};