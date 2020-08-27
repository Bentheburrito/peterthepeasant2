const commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class HelpCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'public',
			memberName: 'help',
			description: 'List available public commands.\n__Usage:__ !help <commandName>',
			argsPromptLimit: 0,
			args: [
				{
					key: 'commandName',
					prompt: '',
					type: 'string',
					default: '',
					validate: commandName => { if (commandName) return true; else return true; }
				}
			]
		});
	}
	
	async run (message, { commandName }) {

		let pubCommands = this.client.registry.groups.find(group => group.id === 'public');
		if (!pubCommands) return message.say('Couldn\'t get public commands.');

		let embed = new RichEmbed();

		if (!commandName) {
			embed.setTitle(`Type !help <commandName> for more details.`).setColor('#75e8ff');
			embed.addField('Public Commands:', pubCommands.commands.map(c => `**${this.client.commandPrefix}${c.name}**\n${c.description}`).join('\n\n'))
			return message.embed(embed);
		}
		let command = pubCommands.commands.find(c => c.name.toLowerCase().includes(commandName.toLowerCase()));
		if (!command) return message.say('Couldn\'t find a command by that name.');

		embed.addField(`${this.client.commandPrefix}${command.name}`, command.description);
		message.embed(embed);
	}
}
