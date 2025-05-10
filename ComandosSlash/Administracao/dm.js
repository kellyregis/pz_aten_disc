const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, ButtonBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { getPermissions } = require("../../Functions/PermissionsCache.js");

module.exports = {
  name: "dm",
  description: 'Envie uma mensagem no privado de um usuário.',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'usuário',
      description: 'Mencione um usuário.',
      type: Discord.ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: 'mensagem',
      description: 'Envie algo para ser enviado.',
      type: Discord.ApplicationCommandOptionType.String,
      required: true
    }
  ],

  run: async (client, interaction) => {

    const perm = await getPermissions(client.user.id);
    if (!perm || !perm.includes(interaction.user.id)) {
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true });
    }

    const member = interaction.options.getUser('usuário');
    const msg = interaction.options.getString('mensagem');

    const channelID = "1270169505431027869"; 

    try {
      const channel = await client.channels.fetch(channelID);

      const logEmbed = new Discord.EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('Mensagem Enviada')
        .setDescription('Uma mensagem foi enviada usando o comando `/dm`')
        .addFields(
          { name: 'Quem Enviou', value: interaction.user.toString(), inline: true },
          { name: 'Quem Recebeu', value: member.toString(), inline: true },
          { name: 'Mensagem', value: `\`${msg}\`` }
        );

      channel.send({ embeds: [logEmbed] });
    } catch (error) {
      console.error(error);
    }

    try {
  await member.send({ content: `📩 | **Nova Mensagem Privada**\n\nVocê recebeu uma nova mensagem!\n\n**Conteúdo da Mensagem:**\n\`\`\`diff\n- ${msg}\n\`\`\`` });
      return interaction.reply({
        content: `✅ | Mensagem enviada com sucesso para ${member} no privado (DM).`,
        embeds: [], 
        ephemeral: true 
      });
    } catch (error) {
      return interaction.reply({
        content: `❌ | A mensagem não foi enviada para ${member}, pois o usuário está com a DM fechada!`,
        embeds: [], 
        ephemeral: true 
      });
    }
  }
};
