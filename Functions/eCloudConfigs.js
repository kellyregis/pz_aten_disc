const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, InteractionType } = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = require("discord.js")
const Discord = require("discord.js")

async function configauth(interaction, client) {


    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("cargoauth")
                .setEmoji(`1249510835735498814`)
                .setLabel('Cargo Verificado')
                .setStyle(1),

            new ButtonBuilder()
                .setCustomId("logauth")
                .setLabel('Configurar WebHook')
                .setEmoji('1249510835735498814')
                .setStyle(1),

        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
             .setCustomId("infosauth")
             .setLabel('Minhas Informações')
             .setEmoji('1236318308756750438')
             .setStyle(1),
            new ButtonBuilder()
             .setCustomId("infoauth")
             .setLabel('Configurações Obrigatorias')
             .setEmoji('1236318155056349224')
             .setStyle(1),

        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltarauth")
                .setEmoji(`1178068047202893869`)
                .setLabel('Voltar')
                .setStyle(2)
        )

        client.on("interactionCreate", async interaction => {
            if (!interaction.isButton()) return;
            
            // Verifique se o botão pressionado é o "webedit"
            if (interaction.customId === "logauth") {
                await interaction.deferReply({ ephemeral: true });
        
                // Simplesmente enviar uma mensagem pedindo a nova URL do webhook
                await interaction.followUp("**🔄 Envie a url de webhook.**");
        
                // Aguarde uma nova interação (mensagem do usuário)
                const filter = m => m.author.id === interaction.user.id;
                const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 });
        
                // Verifique se a mensagem foi recebida
                if (response.size === 0) {
                    await interaction.editReply("**🔔 Tempo esgotado. Por favor, tente novamente.**");
                    return;
                }
        
                const newUrl = response.first().content;
        
                // Atualize o arquivo de configuração com a nova URL do webhook
                const fs = require('fs');
                const path = require('path');
                const configPath = path.join(__dirname, '..', 'DataBaseJson', 'configauth.json');
                
                try {
                    const config = require(configPath);
                    config.webhook_logs = newUrl;
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                
                    await interaction.editReply("** LOGS atualizado com sucesso.**\n\`Talvez, ela não apareça na embed do seu eCloud, tente reiniciar seu bot.\`");
                } catch (error) {
                    console.error("Erro ao atualizar a logs:", error);
                    await interaction.editReply("** Ocorreu um erro ao atualizar a URL.**");
                }
            }
        });
        
        client.on("interactionCreate", async interaction => {
            if (!interaction.isButton()) return;
            
            // Verifique se o botão pressionado é o "webedit"
            if (interaction.customId === "cargoauth") {
                await interaction.deferReply({ ephemeral: true });
        
                // Simplesmente enviar uma mensagem pedindo a nova URL do webhook
                await interaction.followUp("**🔄 Envie o id do cargo de verificado.**");
        
                // Aguarde uma nova interação (mensagem do usuário)
                const filter = m => m.author.id === interaction.user.id;
                const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 });
        
                // Verifique se a mensagem foi recebida
                if (response.size === 0) {
                    await interaction.editReply("**🔔 Tempo esgotado. Por favor, tente novamente.**");
                    return;
                }
        
                const newRoleID = response.first().content;
        
                // Atualize o arquivo de configuração com a nova URL do webhook
                const fs = require('fs');
                const path = require('path');
                const configPath = path.join(__dirname, '..', 'DataBaseJson', 'configauth.json');
                
                try {
                    const config = require(configPath);
                    config.role = newRoleID;
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                
                    await interaction.editReply("** CARGO atualizado com sucesso.**\n\`Talvez, ela não apareça na embed do seu eCloud, tente reiniciar seu bot.\`\n\n🔔 **O cargo do bot deve estar ACIMA do cargo de verificado!**");
                } catch (error) {
                    console.error("Erro ao atualizar o cargo:", error);
                    await interaction.editReply("** Ocorreu um erro ao atualizar o CARGO.**");
                }
            }
        });

    if (interaction.message == undefined) {
        interaction.reply({ embeds: [], components: [row1, row2, row3], content: `Oque deseja configurar?` })
    } else {
        interaction.update({ embeds: [], components: [row1, row2, row3], content: `Oque deseja configurar?` })
    }

}


module.exports = {
    configauth
}
