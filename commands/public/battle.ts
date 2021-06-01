import * as commando from 'discord.js-commando';
import { RichEmbed } from 'discord.js';
let { delay, getTimeUntil } = require('../../utils/timeutils');
let { getRandom, orderedReact } = require('../../utils/genutils');

const battleMessages = ['lend your sword to', 'give support to', 'ally with', 'support', 'lend a hand to', 'side with'];
const battleMotos = ['For Narnia!', 'For the blue cubes!', 'For the craigz\' sleep schedule!', 'For Warcube!', 'For pizza!', 'For the Queen!']
const battleResolutions = ['After much hardship,\nand many many moons,\na conclusion has been reached.', 'It was a rough fight.\nBoth sides fought valiantly.\nBut finally, the battle has come to an end.',
                            'The long awaited time has come.\nThe battle was gruesome, the soldiers were brave.\nNow, a few moments of peace.']

module.exports = class BattleCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'battle',
            group: 'public',
            memberName: 'battle',
            description: 'Fight for votes from your fellow server members against your opponent!\n__Usage:__ `!battle <opponent name> <battle duration in minutes> <battle message>`'
                + '\nExample: - `!battle @craigz 20 A vote for me is a vote for pizza!` - starts a battle that lasts 20 minutes for people to contribute.'
                + '\nExample: - `!battle @craigz` - starts a battle that lasts 5 minutes by default.',
            argsPromptLimit: 0,
            args: [
                {
                    key: 'opponent',
                    prompt: 'User to battle.',
					type: 'user'
				},
                {
                    key: 'time',
                    prompt: 'Amount of time the battle should last. min: 1 minute, max: 1440 minutes (24 hours).',
                    type: 'integer',
                    default: 5,
                    validate: time => (time && (time < 1 || time > 1440)) ? `Limits exceeded. ${time} must be between 1 and 1440 minutes (inclusive).` : true
				},
				{
                    key: 'reason',
                    prompt: 'The reason people should vote for you.',
                    type: 'string',
                    default: getRandom(battleMotos),
					validate: reason => (reason && reason.length > 1000) ? `Can't be more than 1000 characters.` : true
                }
            ]
        });
    }

    async run (message, { opponent, time, reason }) {
        
        if (!opponent) return message.say('Please provide an opponent. (!battle <opponentName>)')

        let opponentReason = getRandom(battleMotos);

		let embed = new RichEmbed()
			.setTitle('A Challenger Approaches!')
			.addField(`${opponent.username}, you've been challenged by ${message.author.username}!`, 'React with :white_check_mark: to accept, and :x: to refuse!')
			.setFooter(`Battle set for ${time} minutes.`)
			.setColor('#75e8ff')
		let prompt = await message.say(`${message.author} is trying to fight ${opponent}`, embed);
		
		orderedReact(prompt, ['✅', '❌']);

		let opponentReaction = await prompt.awaitReactions((reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === opponent.id, { max: 1 });
		prompt.delete();

		if (opponentReaction.first().emoji.name === '❌') return message.say(`${opponent.username} has refused to fight!`);
	
		prompt = await message.say(`${opponent.username} has accepted the challenge! Why should your allies help you, ${opponent}? (Send a message)`);
		opponentReason = await message.channel.awaitMessages(msg => msg.author.id == opponent.id, { max: 1, time: 120000, errors: ['time'] })
			.catch(() => console.log('Time ran out, using a default battleMessage for opponent'))
		prompt.delete();

		if (!opponentReason) opponentReason = getRandom(battleMotos);
		else opponentReason = opponentReason.first().content;

        const authorEmoji = this.client.emojis.random();
        let opponentEmoji = this.client.emojis.random();
        while (opponentEmoji === authorEmoji) opponentEmoji = this.client.emojis.random();

        let battleEnd = Date.now() + time * 1000 * 60;
		
        embed = new RichEmbed()
            .setTitle(`The battle has begun! Cast your vote before the ${time} minute timer is up.`)
            .setDescription(`**React with ${authorEmoji.toString()} to ${getRandom(battleMessages)} ${message.author.username}!**\n"${reason}"\n\n**React with ${opponentEmoji.toString()} to ${getRandom(battleMessages)} ${opponent.username}!**\n"${opponentReason}"`)
            .setFooter(`${getTimeUntil(battleEnd - Date.now())} left`)
            .setColor('#75e8ff')

        let battlePrompt = await message.embed(embed);

		orderedReact(battlePrompt, [authorEmoji, opponentEmoji]);

        let interval = setInterval(() => {
            battlePrompt.edit('', embed.setFooter(`${getTimeUntil(battleEnd - Date.now())} left`))
        }, 5000);

        let votes = await battlePrompt.awaitReactions((reaction) => (reaction.emoji.id === authorEmoji.id || reaction.emoji.id === opponentEmoji.id), { time: time * 1000 * 60 });

        let authorVotes = 0;
        let opponentVotes = 0;

        votes.tap(vote => {

            if (vote.emoji.id === authorEmoji.id) authorVotes = vote.count;
            else if (vote.emoji.id === opponentEmoji.id) opponentVotes = vote.count;
        });

        clearInterval(interval);
        battlePrompt.edit('', embed.setFooter(`Battle ended`))

        let msgs = getRandom(battleResolutions).split('\n');
        for (let i = 0; i < msgs.length; i++) {
            message.say(msgs[i])
            await delay(1600);
        }
        
        message.say(authorVotes > opponentVotes ? `The battle of ${message.author.username} vs. ${opponent.username} just ended, ${message.author.username} is the victor!` :
            authorVotes === opponentVotes ? `The battle of ${message.author.username} vs. ${opponent.username} just ended, ${message.author.username} and ${opponent.username} have come to a draw!` :
            `The battle of ${message.author.username} vs. ${opponent.username} just ended, ${opponent.username} is the victor!`);
    }
}