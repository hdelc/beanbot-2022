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
	const wordsBuffer = fs.readFileSync('./letters.txt', err => {if(err) throw err;});
	const words = wordsBuffer.toString();
	const wordsList = words.split(" ");
	const wordsList1 = wordsList;

  let wordle = "";
	if(words.length < 1){
    console.log("Length 0")
    const buffer = fs.readFileSync('./words.txt', err => {if(err) throw err;});
    const fileContent = buffer.toString();
    const wordleList = fileContent.split("\n");
    const index = Math.floor(Math.random() * 199);
    wordle = wordleList[index];
	}
	else {
    console.log("Length over 0")
	  wordle = wordsList1.shift();
	}
	const wLetters = wordle.split('');

	const string = interaction.options.getString('input').toLowerCase();
	const letters = string.split('');
	const output = addLetters(letters, wordsList1.join(" "));
	const intArray = intArrayMap(letters,wLetters);
	const result = stringMap(letters,intArray).toString();
	const outputFile = wordle + ' ' + output;
	if(string === wordle) {
	fs.writeFileSync('./letters.txt', '', err => {if(err) throw err;});
	await interaction.reply(`You have won WORDLE with the guess ${wordle}!`);
	}
	else {
	fs.writeFileSync('./letters.txt', outputFile, err => {if(err) throw err;});
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
		if(!str.includes(list[i])) {
			ret = ret + ' ' + list[i];
		}
	}
	return ret;
}
