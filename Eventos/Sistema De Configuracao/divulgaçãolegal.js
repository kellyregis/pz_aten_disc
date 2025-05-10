const { 
    ActionRowBuilder, 
    EmbedBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle 
  } = require('discord.js');
  const { Client, GatewayIntentBits } = require('discord.js');
  
  let botToken = null; // Armazenamento temporário para o token do bot
  let messageToSend = null; // Armazenamento temporário para a mensagem a ser enviada
  
  module.exports = {
    name: 'interactionCreate',
  
    run: async (interaction, client) => {
      try {
        if (interaction.isButton()) {
          if (interaction.customId === 'configpaineldivulgacaova') {
            // Embed principal para o Painel de Divulgação
            const disclosureEmbed = new EmbedBuilder()
              .setAuthor({ 
                name: "Painel de Disparo", 
                iconURL: "https://media.discordapp.net/attachments/1304515208043298847/1313321001592950825/8.png?ex=6751067f&is=674fb4ff&hm=2920a21801a72c3b4da42ce892a3b23e3f8eca0566c4dd3c6c2efda87d0e948c&=&format=webp&quality=lossless" 
              })
              .setImage('https://media.discordapp.net/attachments/1304515208043298847/1313709380356804699/AlienSales_Solutions.png?ex=67511eb3&is=674fcd33&hm=f2277fc36508188920fba8411afd481a51e98fb2a60cbea48472defbebf0c25f&=&format=webp&quality=lossless')
              .setDescription("**Escolha uma das opções abaixo:**");
  
            const editTokenButton = new ButtonBuilder()
              .setCustomId('editToken')
              .setLabel('Editar Token')
              .setEmoji('1263565099034083449')
              .setStyle(ButtonStyle.Secondary);
  
            const setMessageButton = new ButtonBuilder()
              .setCustomId('setMessage')
              .setLabel('Definir disparo')
              .setEmoji('1271235236436512820')
              .setStyle(ButtonStyle.Secondary);
  
            const sendMessageButton = new ButtonBuilder()
              .setCustomId('sendMessage')
              .setLabel('Iniciar Disparo')
              .setEmoji("1263565047456731287")
              .setStyle(ButtonStyle.Secondary);

              const row2 = new ActionRowBuilder()
              .addComponents(
      
                  new ButtonBuilder()
                      .setCustomId("voltar1")
                      .setEmoji(`1178068047202893869`)
                      .setLabel('Voltar')
                      .setStyle(2)
      
              )
              
  
            const row = new ActionRowBuilder().addComponents(editTokenButton, setMessageButton, sendMessageButton);
  
            await interaction.update({ embeds: [disclosureEmbed], components: [row, row2], ephemeral: true });
  
          } else if (interaction.customId === 'editToken') {
            // Modal para editar o token do bot
            const modal = new ModalBuilder()
              .setCustomId('tokenModal')
              .setTitle('Editar Token do Bot');
  
            const tokenInput = new TextInputBuilder()
              .setCustomId('botTokenInput')
              .setLabel('Insira o token do bot')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder('Digite o token aqui...');
  
            const actionRow = new ActionRowBuilder().addComponents(tokenInput);
            modal.addComponents(actionRow);
  
            await interaction.showModal(modal);
  
          } else if (interaction.customId === 'setMessage') {
            // Modal para definir a mensagem
            const modal = new ModalBuilder()
              .setCustomId('messageModal')
              .setTitle('Definir disparo');
  
            const messageInput = new TextInputBuilder()
              .setCustomId('messageInput')
              .setLabel('Insira a mensagem a ser enviada para disparo')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Digite a mensagem para disparo aqui...');
  
            const actionRow = new ActionRowBuilder().addComponents(messageInput);
            modal.addComponents(actionRow);
  
            await interaction.showModal(modal);
  
          } else if (interaction.customId === 'sendMessage') {
            // Enviando a mensagem pré-definida
            if (!botToken) {
              await interaction.reply({ content: "⚠️ O token do bot não foi definido!", ephemeral: true });
              return;
            }
  
            if (!messageToSend) {
              await interaction.reply({ content: "⚠️ A mensagem não foi definida!", ephemeral: true });
              return;
            }
  
            try {
              const guild = await interaction.guild.fetch();
              const members = await guild.members.fetch();
  
              // Cria um novo cliente de bot para enviar mensagens
              const botClient = new Client({
                intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers]
              });
  
              botClient.once('ready', async () => {
                console.log('Bot de disparo logado com sucesso.');
  
                for (const member of members.values()) {
                  if (!member.user.bot) {
                    try {
                      await member.send(messageToSend);
                    } catch (error) {
                      console.error(`Erro na solicitação do disparo para ${member.user.tag}`, error);
                    }
                  }
                }
  
                await interaction.reply({ content: "✅ Mensagem disparada para todos os membros!", ephemeral: true });
                botClient.destroy(); // Destruir o cliente após o envio
              });
  
              await botClient.login(botToken).catch(async (error) => {
                console.error('Erro ao fazer login com o token do bot:', error);
                await interaction.reply({ content: 'Erro ao fazer login com o token do bot.', ephemeral: true });
              });
  
            } catch (error) {
              console.error("Erro ao realizar disparo para membros", error);
              await interaction.reply({ content: "Erro ao enviar a mensagem.", ephemeral: true });
            }
          }
        } else if (interaction.isModalSubmit()) {
          // Lidar com submissões de modal
          if (interaction.customId === 'tokenModal') {
            botToken = interaction.fields.getTextInputValue('botTokenInput');
            await interaction.reply({ content: "✅ Token do bot definido com sucesso!", ephemeral: true });
          } else if (interaction.customId === 'messageModal') {
            messageToSend = interaction.fields.getTextInputValue('messageInput');
            await interaction.reply({ content: "✅ Mensagem de disparo definida com sucesso!", ephemeral: true });
          }
        }
      } catch (error) {
        console.error("Erro ao processar a interação", error);
        if (!interaction.replied) {
          await interaction.reply({ content: "Ocorreu um erro ao processar sua solicitação.", ephemeral: true });
        }
      }
    },
  };
  