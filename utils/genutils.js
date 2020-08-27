const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

const orderedReact = async (message, emojis) => {
	if (!Array.isArray(emojis)) Promise.reject('emojis is not an array')
	for (const emoji of emojis) {
		try { await message.react(emoji) }
		catch (e) {
			if (e.message === 'Unknown Message') {
				console.log(`Couldn't react, the message was deleted.`);
				break;
			}
			console.log(`ERROR when reacting in orderedReact ${e}`);
		}
	}
}

module.exports = {
	getRandom,
	orderedReact
}