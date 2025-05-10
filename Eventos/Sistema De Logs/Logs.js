const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { configuracao } = require("../../DataBaseJson");

module.exports = {
    name: 'messageDelete',
    run: async (message, client) => {
        if (!message.guild || message.author.bot) return;

        const embed = new EmbedBuilder()
            .setColor(`${configuracao.get(`Cores.Erro`) == null ? `#FF0000` : configuracao.get(`Cores.Erro`)}`)
            .setAuthor({ name: `Mensagem Deletada`, iconURL: `https://media.discordapp.net/attachments/1223385767816986754/1250235239499038740/eu_tambem_tenho_25.png?ex=666a33cd&is=6668e24d&hm=665c5dc1a780f607f0c590b233cd794e650fb7803a6477d14c59f5b3b0fe7c6b&=&format=webp&quality=lossless` })
            .setDescription(`O usuário ${message.author} acabou de deletar uma mensagem`)
            .addFields(
                { name: `**Autor**`, value: `${message.author} \`(${message.author.id})\`` },
                { name: `**Canal**`, value: `${message.channel}` },
                { name: `**Mensagem**`, value: `${message.content}` },
            )
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        // Defina o canal onde deseja enviar o log
        const logChannelId = configuracao.get(`ConfigChannels.mensagens`);
        const logChannel = client.channels.cache.get(logChannelId);

        if (logChannel) {
            logChannel.send({ embeds: [embed] });
        } else {
        }
    }
};
