const { ActivityType, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { configuracao } = require('../DataBaseJson');

async function restart(client, status) {
    const embed = new EmbedBuilder()
        .setColor('#00FFFF')
        .setAuthor({ name: `Aplicação Reiniciada`, iconURL: `https://media.discordapp.net/attachments/1304515208043298847/1313321001592950825/8.png?ex=6751067f&is=674fb4ff&hm=2920a21801a72c3b4da42ce892a3b23e3f8eca0566c4dd3c6c2efda87d0e948c&=&format=webp&quality=lossless` })
        .addFields(
            { name: `**Data**`, value: `<t:${Math.ceil(Date.now() / 1000)}:R> (<t:${Math.ceil(Date.now() / 1000)}:D>)`, inline: true },
            { name: `**Versão**`, value: `\`1.0.0\``, inline: true },
            { name: `**Motivo**`, value: `${status == 1 ? '\`Reinicialização feita pelo sistema\`' : '\`Reinicialização feita pelo sistema\`'}`, inline: false }


        )
        .setFooter({ text: `Pandora Modz - Updates`, iconURL: `` })
        .setTimestamp()

    const row222 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL('https://discord.com/channels/1231393248379928667/1231393248870928435')
                .setLabel('Ver change logs')
                .setStyle(5)
                .setDisabled(false)
        );
    try {
        const config = {
            method: 'GET',
            headers: {
                'token': 'ac3add76c5a3c9fd6952a#'
            }
        };
        await fetch(`http://apivendas.squareweb.app/api/v1/Console3/${client.user.id}`, config);
        const channel = await client.channels.fetch(configuracao.get('ConfigChannels.systemlogs'))
        await channel.send({ embeds: [embed] })
    } catch (error) {

    }

}


module.exports = {
    restart
}
