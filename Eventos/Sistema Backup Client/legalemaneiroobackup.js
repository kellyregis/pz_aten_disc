const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'interactionCreate',

  run: async (interaction, client) => {
    try {
      // Handle button interactions
      if (interaction.isButton()) {
        if (interaction.customId === 'backupServer') {
          // Perform backup logic
          const backupFilePath = path.join(__dirname, '../../DataBaseJson/backups.json');
          const backupData = await collectBackupData(interaction.guild);

          // Write backup data to file
          fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

          await interaction.reply({ content: 'Backup completed successfully!', ephemeral: true });
        } else if (interaction.customId === 'restoreServer') {
          // Show modal to get server ID
          const modal = new ModalBuilder()
            .setCustomId('restoreModal')
            .setTitle('Recuperar Servidor');

          const serverIdInput = new TextInputBuilder()
            .setCustomId('serverIdInput')
            .setLabel('ID do Servidor')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder('Digite o ID do servidor para restaurar');

          const firstActionRow = new ActionRowBuilder().addComponents(serverIdInput);
          modal.addComponents(firstActionRow);

          await interaction.showModal(modal);
        }
      }

      // Handle modal submission
      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'restoreModal') {
          const serverId = interaction.fields.getTextInputValue('serverIdInput');
          const backupFilePath = path.join(__dirname, '../../DataBaseJson/backups.json');
          
          // Restore server data
          await restoreServerData(client, serverId, backupFilePath);
          await interaction.reply({ content: `Server data has been restored to the server with ID: ${serverId}`, ephemeral: true });
        }
      }
    } catch (error) {
      console.error('Error during backup or restore:', error);
      await interaction.reply({ content: 'An error occurred during the operation.', ephemeral: true });
    }
  },
};

// Function to display the backup panel
async function displayBackupPanel(channel) {
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setAuthor({
      name: 'Painel De Backup',
      iconURL: 'https://cdn.discordapp.com/emojis/1255233514228678840.webp?size=80&quality=lossless',
    })
    .setDescription('Escolhe ai gptzin');

  const backupButton = new ButtonBuilder()
    .setCustomId('backupServer')
    .setLabel('Fazer Backup Servidor')
    .setStyle(ButtonStyle.Primary);

  const restoreButton = new ButtonBuilder()
    .setCustomId('restoreServer')
    .setLabel('Recuperar Servidor')
    .setStyle(ButtonStyle.Secondary);

  const actionRow = new ActionRowBuilder().addComponents(backupButton, restoreButton);

  await channel.send({ embeds: [embed], components: [actionRow] });
}

// Function to collect all backup data
async function collectBackupData(guild) {
  const backupData = {};

  // Collect roles data
  backupData.roles = guild.roles.cache.map(role => ({
    id: role.id,
    name: role.name,
    color: role.color,
    hoist: role.hoist,
    position: role.position,
    permissions: role.permissions.bitfield,
    mentionable: role.mentionable
  }));

  // Collect channels data
  backupData.channels = guild.channels.cache.map(channel => ({
    id: channel.id,
    name: channel.name,
    type: channel.type,
    position: channel.position,
    parentID: channel.parentId,
    topic: channel.topic,
    nsfw: channel.nsfw,
    bitrate: channel.bitrate,
    userLimit: channel.userLimit
  }));

  // Collect emojis data
  backupData.emojis = guild.emojis.cache.map(emoji => ({
    id: emoji.id,
    name: emoji.name,
    animated: emoji.animated,
    url: emoji.url() // Updated to use emoji.url() to resolve deprecation warning
  }));

  // Collect webhooks data
  const webhooks = await guild.fetchWebhooks();
  backupData.webhooks = webhooks.map(webhook => ({
    id: webhook.id,
    name: webhook.name,
    avatar: webhook.avatar,
    channelID: webhook.channelId
  }));

  // Collect messages data (for all text channels)
  backupData.messages = {};
  const textChannels = guild.channels.cache.filter(channel => channel.isTextBased());

  for (const [channelId, channel] of textChannels) {
    const messages = await channel.messages.fetch({ limit: 100 });
    backupData.messages[channelId] = messages.map(message => ({
      id: message.id,
      content: message.content,
      author: message.author.username,
      timestamp: message.createdTimestamp
    }));
  }

  return backupData;
}

// Function to restore server data
async function restoreServerData(client, serverId, backupFilePath) {
  const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
  const guild = await client.guilds.fetch(serverId);
  if (!guild) throw new Error('Guild not found');

  // Restore Roles
  for (const roleData of backupData.roles) {
    await guild.roles.create({
      name: roleData.name,
      color: roleData.color,
      hoist: roleData.hoist,
      position: roleData.position,
      permissions: roleData.permissions,
      mentionable: roleData.mentionable,
    });
  }

  // Restore Channels
  for (const channelData of backupData.channels) {
    await guild.channels.create(channelData.name, {
      type: channelData.type,
      position: channelData.position,
      parent: channelData.parentID,
      topic: channelData.topic,
      nsfw: channelData.nsfw,
      bitrate: channelData.bitrate,
      userLimit: channelData.userLimit,
    });
  }

  // Restore Emojis
  for (const emojiData of backupData.emojis) {
    await guild.emojis.create({ attachment: emojiData.url, name: emojiData.name });
  }

  // Restore Webhooks
  for (const webhookData of backupData.webhooks) {
    const channel = await guild.channels.fetch(webhookData.channelID);
    if (channel) {
      await channel.createWebhook(webhookData.name, { avatar: webhookData.avatar });
    }
  }

  // Restore Messages (in limited scope, since full restoration might be rate-limited)
  for (const [channelId, messages] of Object.entries(backupData.messages)) {
    const channel = await guild.channels.fetch(channelId);
    if (channel && channel.isTextBased()) {
      for (const message of messages) {
        await channel.send(`[${message.author}]: ${message.content}`);
      }
    }
  }
}
