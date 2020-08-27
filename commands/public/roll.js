const commando = require('discord.js-commando');

module.exports = class DiceRollCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'roll',
			group: 'public',
			memberName: 'roll',
			description: 'Rolls a virtual dice. \n__Usage:__ !roll <# of sides> (Defaults to 6).',
			argsPromptLimit: 0,
			args: [
				{
					key: 'sides',
					prompt: '',
					type: 'integer',
					default: '',
					validate: sides => { if (sides) return true; else return true; }
				},
				{
					key: 'amount',
					prompt: '',
					type: 'integer',
					default: 1,
					validate: amount => { if (amount) return true; else return true; }
				}
			]
		});
	}
	
	async run (message, {sides, amount}) {

		if (isNaN(sides)) return message.channel.send("Please use numbers only");
		if (!sides) sides = 6;
		if (!amount || amount < 1) amount = 1;

		let rolls = [];
		for (let i = 0; i < amount; i++) {
			rolls.push(Math.floor(Math.random() * sides) + 1)
		}
		message.channel.send(`${message.author.username} rolled ${rolls.join(', ')}`);
	}
}
