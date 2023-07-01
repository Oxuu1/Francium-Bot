const { Client, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const TOKEN = 'MTExNDM2MjQwNzgyMTc4NzE3Ng.GNOLfn.GjLuxN4KVyYnrKgvTWrS0Y0PJx4wqBIuRoJgIk';

// Map to store user accounts
const userAccounts = new Map();

client.once('ready', async () => {
  console.log('Cerium is ready!');
  client.user.setActivity('Hello, I am Cerium!', { type: 'PLAYING' });

  try {
    const guildId = '1112769892014362728'; // Replace with your server ID
    const commands = await client.guilds.cache.get(guildId)?.commands.set([
      {
        name: 'createaccount',
        description: 'Create an account',
        options: [
          {
            name: 'username',
            description: 'The username for the account',
            type: 'STRING',
            required: true,
          },
          {
            name: 'password',
            description: 'The password for the account',
            type: 'STRING',
            required: true,
          },
        ],
      },
      {
        name: 'details',
        description: 'Get account details',
      },
      {
        name: 'amount',
        description: 'Get the number of created accounts',
      },
    ]);
    console.log(`Registered slash commands: ${commands.map((cmd) => cmd.name).join(', ')}`);
  } catch (error) {
    console.error('Failed to register slash commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, user } = interaction;

  if (commandName === 'createaccount') {
    const username = options.getString('username');
    const password = options.getString('password');

    // Check if user already has an account
    if (userAccounts.has(user.id)) {
      interaction.reply('You already have an account. You cannot create multiple accounts.');
      return;
    }

    const line = `const account = { username: '${username}', password: '${password}' };\n`;
    const filePath = `accounts/${user.id}.js`;

    fs.appendFile(filePath, line, (err) => {
      if (err) {
        console.error(err);
        interaction.reply('An error occurred while creating the account. Please try again later.');
      } else {
        console.log(`Account added: ${username}`);
        interaction.reply(`Account '${username}' created successfully and bound to your Discord account!`);
        // Store the user account
        userAccounts.set(user.id, { username, password });
      }
    });
  } else if (commandName === 'details') {
    // Check if user has an account
    if (userAccounts.has(user.id)) {
      const { username, password } = userAccounts.get(user.id);

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Account Details')
        .addField('Username', username)
        .addField('Password', password)
        .setFooter('Account information');

      interaction.reply({ embeds: [embed] });
    } else {
      interaction.reply('You do not have an account. Please create one using `/createaccount`.');
    }
  } else if (commandName === 'amount') {
    const accountCount = userAccounts.size;
    interaction.reply(`The total number of created accounts is: ${accountCount}`);
  }
});

client.login(TOKEN);
