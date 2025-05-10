client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (customId === 'divbotvin') {
        await interaction.reply('Você clicou no botão Vincular Bot Div!');
    } else if (customId === 'envmsgdiv') {
        await interaction.reply('Você clicou no botão Enviar Mensagem!');
    }
});
