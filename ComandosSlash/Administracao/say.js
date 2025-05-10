const Discord = require("discord.js");
const config = require("../../config.json");
const { getPermissions } = require("../../Functions/PermissionsCache.js");

module.exports = {
    name: "say",
    description: "Enviar Mensagem",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'texto',
            description: 'O que deseja enviar?',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'botao_nome',
            description: 'Nome do botão (opcional)',
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'botao_emoji',
            description: 'Emoji do botão (opcional)',
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    run: async (client, interaction) => {

        try {
            const perm = await getPermissions(client.user.id);
            if (!perm || !perm.includes(interaction.user.id)) {
                return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true });
            }

            const texto = interaction.options.getString('texto');
            const botaoNome = interaction.options.getString('botao_nome') || '';
            const botaoEmoji = interaction.options.getString('botao_emoji') || '';

            let components = [];

            // Se o nome do botão for fornecido, cria o botão desativado com o nome e o emoji
            if (botaoNome || botaoEmoji) {
                const botao = new Discord.ButtonBuilder()
                    .setLabel(botaoNome || 'Botão') // Nome padrão 'Botão' se não for fornecido
                    .setDisabled(true) // Botão desativado
                    .setStyle(Discord.ButtonStyle.Secondary) // Cor cinza
                    .setCustomId('botao_desativado'); // ID customizado para referência futura

                if (botaoEmoji) {
                    botao.setEmoji(botaoEmoji); // Adiciona emoji se fornecido
                }

                const actionRow = new Discord.ActionRowBuilder()
                    .addComponents(botao);

                components.push(actionRow);
            }

            await interaction.reply({ content: `✅ | Mensagem enviada com êxito. Verifique agora mesmo!`, ephemeral: true });
            await interaction.channel.send({ content: texto, components });

            // Apaga a resposta após 5 segundos
            setTimeout(() => {
                interaction.deleteReply();
            }, 5000);

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: `❌ | Ocorreu um erro ao processar o comando.`, ephemeral: true });
        }
    }
};
