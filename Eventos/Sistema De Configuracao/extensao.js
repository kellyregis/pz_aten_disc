const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'interactionCreate',

  run: async (interaction, client) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'extensaoadsjiodj') {
        // Embed principal com o menu de extensões
        // Menu suspenso de opções para gerar email
        const emailSelectMenu = new StringSelectMenuBuilder()
          .setCustomId('emailSelect')
          .setPlaceholder('Extensões Disponiveis')
          .addOptions([
            {
              label: 'Gerar Email',
              description: 'Clique para gerar um novo email temporário.',
              value: 'generateEmail',
              emoji: '1164372882760151061',
            },
          ]);

        const row = new ActionRowBuilder().addComponents(emailSelectMenu);

        await interaction.reply({  components: [row], ephemeral: true });
      }
    } else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'emailSelect' && interaction.values[0] === 'generateEmail') {
        // Geração do email temporário e envio do embed
        try {
          const response = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
          const email = response.data[0];
          const [login, domain] = email.split("@");
          const inboxURL = `https://www.1secmail.com/?login=${login}&domain=${domain}`;

          const inboxButton = new ButtonBuilder()
            .setLabel('Ir ao Site')
            .setURL(inboxURL)
            .setStyle(ButtonStyle.Link);

          const previewButton = new ButtonBuilder()
            .setLabel('Caixa de Entrada')
            .setEmoji('1266375142318276619')
            .setCustomId('inboxButton')
            .setStyle(ButtonStyle.Primary);

          const row = new ActionRowBuilder().addComponents(previewButton, inboxButton);

          const emailEmbed = new EmbedBuilder()
            .setAuthor({ 
              name: "Email Temporário - Extensões", 
              iconURL: "https://cdn.discordapp.com/emojis/1265721202601885696.webp?size=80&quality=lossless" 
            })
            .setDescription(`Email gerado com êxito abaixo:\n\n:white_check_mark: \`${email}\``)
            .setImage("https://cdn.discordapp.com/attachments/1264755036202733709/1277689359222439997/emailtemporario.png?ex=66ce1471&is=66ccc2f1&hm=40f929b9a83522787cd92bb7da1d144ed4cf78a549f28600bac0e85e09003f37&")
            .setColor("2b2d31");

          await interaction.reply({ embeds: [emailEmbed], components: [row], ephemeral: true });

          const filter = (i) => i.customId === 'inboxButton' && i.user.id === interaction.user.id;
          const collector = interaction.channel.createMessageComponentCollector({ filter, time: 3600000 });

          collector.on('collect', async (i) => {
            i.deferUpdate();
            try {
              const inboxResponse = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
              const inboxData = inboxResponse.data;

              if (inboxData && inboxData.length > 0) {
                const messageID = inboxData[0].id;
                const subject = inboxData[0].subject;
                const sender = inboxData[0].from;

                const inboxEmbed = new EmbedBuilder()
                .setAuthor({ 
                    name: "Email Temporário - Caixa De Entrada", 
                    iconURL: "https://cdn.discordapp.com/emojis/1266375142318276619.webp?size=80&quality=lossless" 
                  })
                  .setDescription(`Lembre-se de clicar no outro botão para acessar o corpo da mensagem.\n\nID da mensagem: **${messageID}**\nAssunto: **${subject}**`)
                  .setColor("2b2d31");

                i.followUp({ embeds: [inboxEmbed], ephemeral: true });
              } else {
                i.followUp({ content: "A caixa de entrada está vazia", ephemeral: true });
              }
            } catch (error) {
              console.error("Erro ao obter mensagens da caixa de entrada", error);
              i.followUp({ content: "Erro ao acessar a caixa de entrada.", ephemeral: true });
            }
          });

          collector.on('end', () => {
            console.log('A coleta foi encerrada');
          });

        } catch (error) {
          console.error("Erro ao gerar o email", error);
          interaction.reply({ content: "Ocorreu um erro ao gerar o email temporário.", ephemeral: true });
        }
      }
    }
  }
};
