const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { produtos, configuracao } = require("../DataBaseJson");
const { ecloud } = require("../Functions/eCloudConfig");
const startTime = Date.now();
const maxMemory = 100;
const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
const memoryUsagePercentage = (usedMemory / maxMemory) * 100;
const roundedPercentage = Math.min(100, Math.round(memoryUsagePercentage));

function getSaudacao() {
  const brazilTime = new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"});
  const hora = new Date(brazilTime).getHours();

  if (hora < 12) {
      return 'Bom dia';
  } else if (hora < 18) {
      return 'Boa tarde';
  } else {
      return 'Boa noite';
  }
}

async function Painel(interaction, client) {

  const embed = new EmbedBuilder()
    .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc': configuracao.get('Cores.Principal')}`)
    .setTitle(`Painel`)
    .setAuthor({
      name: 'Pandora Modz',
      iconURL: 'https://res.cloudinary.com/kellyregis/image/upload/v1740504252/PandoraModz/gblf3jovgzyqaga9jrdl.png'})
    .setDescription(`${getSaudacao()} senhor(a) **${interaction.member?.displayName}**, o que deseja fazer?`)
    .addFields(
      { name: `**Versão**`, value: `\`Indefinido\``, inline: true },
      { name: `**Ping**`, value: `\`${await client.ws.ping} ms\``, inline: true },
      { name: `**Uptime**`, value: `<t:${Math.ceil(startTime / 1000)}:R>`, inline: true },
    )
    .setFooter(
      { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
    )
    .setTimestamp()
    .setImage("https://res.cloudinary.com/kellyregis/image/upload/v1740683319/PandoraModz/vfnljiibtjtgglbrodei.webp"); // Adicionando a imagem

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("painelconfigvendas")
        .setLabel('Loja')
        .setEmoji(`1249486266987446312`)
        .setStyle(1)
        .setDisabled(false),
      new ButtonBuilder()
        .setCustomId("painelconfigticket")
        .setLabel('Ticket')
        .setEmoji(`1178064939651448973`)
        .setStyle(1)
        .setDisabled(false),
      new ButtonBuilder()
        .setCustomId("painelconfigbv")
        .setLabel('Boas Vindas')
        .setEmoji(`1178066050076643458`)
        .setStyle(1)
        .setDisabled(false),
      new ButtonBuilder()
        .setCustomId("eaffaawwawa")
        .setLabel('Ações Automaticas')
        .setEmoji(`1249486320397586522`)
        .setStyle(2)
        .setDisabled(false),
    );

  const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("painelpersonalizar")
        .setLabel('Personalização')
        .setEmoji(`1178066208835252266`)
        .setStyle(1)
        .setDisabled(false),
      new ButtonBuilder()
        .setCustomId("ecloud")
        .setLabel('Disparo AS')
        .setEmoji(`1313708195964784640`)
        .setStyle(1)
        .setDisabled(false),
      new ButtonBuilder()
        .setCustomId("rendimento")
        .setLabel('Rendimento')
        .setEmoji(`1178086986360307732`)
        .setStyle(3)
        .setDisabled(false),
      new ButtonBuilder()
        .setCustomId("gerenciarconfigs")
        .setLabel('Definições')
        .setEmoji(`1178066377014255828`)
        .setStyle(2)
        .setDisabled(false),
    );

  const row4 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("queissumanukk")
        .setLabel('Pandora Modz')
        .setStyle(2)
        .setEmoji(":aliensales:1313708195964784640>")
        .setDisabled(true),
    );

  if (interaction.message == undefined) {
    interaction.reply({ content: ``, components: [row2, row3, row4], embeds: [embed], ephemeral: true });
  } else {
    interaction.update({ content: ``, components: [row2, row3, row4], embeds: [embed], ephemeral: true });
  }
}

async function Gerenciar2(interaction, client) {

  const ggg = produtos.valueArray();

  const embed = new EmbedBuilder()
    .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc': configuracao.get('Cores.Principal')}`)
    .setTitle(`Painel de Administração`)
    .setDescription(`${getSaudacao()} Senhor(a) **${interaction.user.username}**, escolha o que deseja fazer.`)
    .addFields(
      { name: `**Total de produtos fornecidos**`, value: `${ggg.length}`, inline: true },
    )
    .setFooter(
      { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
    )
    .setTimestamp();

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("criarrrr")
        .setLabel('Criar')
        .setEmoji(`1178067873894236311`)
        .setStyle(1),
      new ButtonBuilder()
        .setCustomId("gerenciarotemae")
        .setLabel('Gerenciar')
        .setEmoji(`1178067945855910078`)
        .setStyle(1),
      new ButtonBuilder()
        .setCustomId("gerenciarposicao")
        .setLabel('Posições')
        .setEmoji(`1178086608004722689`)
        .setStyle(1),
    );

  const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("trocarqdcodeee")
        .setLabel('Trocar QRCode')
        .setEmoji(`1263234366298128396`)
        .setStyle(1),
      new ButtonBuilder()
        .setCustomId("voltar00")
        .setLabel('Voltar')
        .setEmoji(`1178068047202893869`)
        .setStyle(2)
    );

  await interaction.update({ embeds: [embed], components: [row2, row3], content: `` });
}

module.exports = {
  Painel,
  Gerenciar2
};
