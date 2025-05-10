const { Client, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, GatewayIntentBits } = require('discord.js');

// ID do canal onde as mensagens serão enviadas
const channelId = '1265476932498227210';

// Função para enviar e atualizar a mesma mensagem a cada 1 hora
const updateMessage = async () => {
    try {
        const channel = await bot.channels.fetch(channelId);

        if (channel) {
            // Embed a ser enviada
            const embed = new EmbedBuilder()
                .setDescription("FUNÇÃO DESABILITADA POR: **Pandora Modz.**")
                .setColor(0x2e3b83)
                .setThumbnail("https://media.discordapp.net/attachments/1304515208043298847/1313321001592950825/8.png?ex=6751067f&is=674fb4ff&hm=2920a21801a72c3b4da42ce892a3b23e3f8eca0566c4dd3c6c2efda87d0e948c&=&format=webp&quality=lossless");

            // Botões
            const planosButton = new ButtonBuilder()
                .setLabel('FUNÇÃO DESABILITADA POR: **Pandora Modz.**')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/channels/1255268189156282498/1271529110719565835');

            const suporteButton = new ButtonBuilder()
                .setLabel('Suporte')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/channels/1255268189156282498/1257825159436308520');

            const actionRow = new ActionRowBuilder().addComponents(planosButton, suporteButton);

            // Envia a mensagem
            const message = await channel.send({ embeds: [embed], components: [actionRow] });

            // Aguarda 1 hora (3600000 ms) e então exclui a mensagem e envia uma nova igual
            setTimeout(async () => {
                await message.delete();
            }, 3600000); // 1 hora em milissegundos
        } else {
            console.error(`O canal com ID ${channelId} não foi encontrado.`);
        }
    } catch (error) {
        console.error('Erro ao tentar enviar a mensagem:', error);
    }
};
// Inicia o loop de atualização de mensagens a cada 1 hora
setInterval(updateMessage, 3600000); // 1 hora em milissegundos
