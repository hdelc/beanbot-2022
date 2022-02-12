const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('sum')
	.setDescription('sums the given numbers')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('String version of numbers')
			.setRequired(true));

	async execute(interaction) {
	const string = interaction.options.getString('input');
	const numArgs = string.split(' ').map(x => parseFloat(x));
	const sum = numArgs.reduce((counter,x) => counter += x);
	await interaction.reply(`Your sum is ${sum}`);
	},
};

