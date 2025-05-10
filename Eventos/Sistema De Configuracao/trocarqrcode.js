const Discord = require('discord.js');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

// Carregar o arquivo config.json
const config = require('../../config.json');// Usando caminho relativo baseado na imagem fornecida

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {
        // Verifica se a interação é de um botão
        if (interaction.isButton()) {
            if (interaction.customId === 'trocarqdcodeee') {
                // Usando o emoji de aviso definido no config.json
                await interaction.reply({
                    content: `🔁 | Por favor, anexe a nova foto que será usada para o QRCode. (Formato .png)`,
                    ephemeral: true
                });

                // Criar um coletor de mensagens para pegar o anexo do usuário
                const filter = (msg) => msg.author.id === interaction.user.id && msg.attachments.size > 0;
                const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

                collector.on('collect', async (msg) => {
                    const attachment = msg.attachments.first();
                    const fileName = attachment.name;

                    // Verifica se o arquivo é um .png
                    if (fileName && fileName.endsWith('.png')) {
                        try {
                            await interaction.followUp({ content: `🔁 | Aguarde, estamos processando a imagem...`, ephemeral: true });

                            const nomeDoDiretorio = 'Lib';
                            const caminhoDoDiretorio = path.resolve(__dirname, '../../', nomeDoDiretorio);
                            const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });

                            const caminhoNoComputador = path.join(caminhoDoDiretorio, 'aaaaa.png');
                            await fs.writeFile(caminhoNoComputador, Buffer.from(response.data));

                            interaction.followUp({ content: `✅ | QRCode trocado com sucesso!`, ephemeral: true });
                        } catch (error) {
                            console.log(error);
                            interaction.followUp({ content: `❌ | Erro ao trocar o QRCode.`, ephemeral: true });
                        }
                    } else {
                        interaction.followUp({ content: `❌ | O arquivo precisa ser .png.`, ephemeral: true });
                    }
                });

                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        interaction.followUp({ content: `⏰ | Tempo esgotado para anexar a nova foto.`, ephemeral: true });
                    }
                });
            }
        }
    }
};
