import * as commando from 'discord.js-commando';
import * as fs from 'fs';

module.exports = class RoleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'role',
            group: 'public',
            memberName: 'role',
            description: 'Assign and remove roles.\n__Usage:__ !role <rollName>',
            argsPromptLimit: 0,
            args: [
                {
                    key: 'roleName',
                    prompt: 'Please specify a role name.',
                    type: 'string',
                    default: '',
					validate: roleName => { if (roleName) return true; else return true; }
                }
            ]
        });
    }

    async run(message, {roleName}) {

        if (!roleName) return message.channel.send("Please provide arguments (Usage: !role <roleName>).");

        let publicRoles = JSON.parse(fs.readFileSync('./publicRoles.json').toString());

        if (roleName.startsWith('add')) {

			if (!message.member.hasPermission("MANAGE_ROLES") && message.author.id != '254728052070678529') return message.channel.send("You do not have permission to add a role for public use.");
			
			roleName = roleName.slice(4);
            
            let roleToAdd = message.guild.roles.find(roleToAdd => roleToAdd.name.toLowerCase().includes(roleName.toLowerCase()));
            if (!roleToAdd) return message.channel.send("Couldn't find role to add.");

            if (publicRoles.some(role => roleToAdd.id === role.id)) return message.channel.send("That role is already available for public use.");
            
            let newPublicRole = {
                id: roleToAdd.id
            }
            publicRoles.push(newPublicRole);
            fs.writeFileSync('./publicRoles.json', JSON.stringify(publicRoles));

            return message.channel.send(`Added new role for public use: '${roleToAdd.name}'.`);
        }

        let guildMember = message.member;
        let wantedRole = message.guild.roles.find(role => role.name.toLowerCase().includes(roleName.toLowerCase()));
        if (!wantedRole) return message.channel.send("Role not found.");

        if (!publicRoles.some(role => wantedRole.id === role.id)) return message.say('That role cannnot be self assigned.');

        if (guildMember.roles.find(role => role.id === wantedRole.id)) {
            guildMember.removeRole(wantedRole);
        	message.say(`Removed role '${wantedRole.name}'`);
        } else {
            guildMember.addRole(wantedRole);
            message.say(`Assigned role '${wantedRole.name}'`);
        }
    }
};
