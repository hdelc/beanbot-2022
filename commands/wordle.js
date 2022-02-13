const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
data: new SlashCommandBuilder()
	.setName('wordle')
	.setDescription('Plays the popular game wordle')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('Your input word')
			.setRequired(true)),
	async execute(interaction) {
	const wordle = "query"
	const wLetters = wordle.split('');
	const string = interaction.options.getString('input');
	const letters = string.split('');
	const intArray = intArrayMap(letters,wLetters);
	const result = stringMap(letters,intArray).toString();
	await interaction.reply(`${reult}`);
	}
}

function intArrayMap(list1, list2){
var intArray = new Array(5)
for(var i = 0; i<5; i++) {
	if(list2.includes(list1[i])){
		if(list1[i] === list2[i]){
			intArray[i] = 1;
		} else {
			intArray[i] = -1;
		}
	} else {
		intArray[i] = 0;
	}
}
return intArray;
}

function stringMap(list1, list2) {
	const str1 = '**';
	const str2 = '__';
	var stringArray = new Array(5);
	for(var i = 0; i<5; i++) {
		if(list2[i] === 1) {
			stringArray[i] = str1.concat(list1[i],str1);
		} else if(list2[i] == -1) {
			stringArray[i] = str2.concat(list1[i],str2);
		} else {
			stringArray[i] = list1[i];
		}
	}
	return stringArray;
}
