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
	const fs = require("fs");
	const wordsBuffer = fs.readFile('../letters.txt');
	const words = wordsbuffer.toString();
	const wordsList = words.split(" ");
	const wordsList1 = wordList;

	if(words.length > 5){
	const buffer = fs.readFile('../words.txt');
	const fileContent = buffer.toString();
	const wordleList = fileContent.split(" ");
	const index = Math.floor(Math.random() * 199);
	const wordle = wordleList[index];
	}
	else {
	const wordle = wordsList1.shift();
	}
	const wLetters = wordle.split('');

	const string = interaction.options.getString('input').toLowerCase();
	const letters = string.split('');
	const output = addLetters(letters, wordsList1);
	const intArray = intArrayMap(letters,wLetters);
	const result = stringMap(letters,intArray).toString();
	const outputFile = wordle + ' ' + output;
	if(string === wordle) {
	fs.writeFile('../words.txt', '');
	await interaction.reply(`You have won WORDLE with the guess ${wordle}!`);
	}
	else {
	fs.writeFile('../words.txt', outputFile);
	}
	await interaction.reply(`${result} Letters that have been used so far: ${output}`);
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

function addLetters(list, str) {
	var ret = str;
	for(var i = 0; i<list.length; i++) {
		if(str.includes(list[i])) {
			ret = ret + ' ' + list[i];
		}
	}
	return ret;
}
