const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    run: async (interaction, client) => {
        if (interaction.isButton()) {
            try {
                const member = await interaction.guild.members.fetch(interaction.user.id);
                if (interaction.customId === "confirmar") {
                    // Verifica se o usuário tem permissão para utilizar o botão "confirmar"
                    if (!member.roles.cache.has("1255284331513909339")) {
                        return interaction.reply({
                            embeds: [new EmbedBuilder()
                                .setDescription(`<a:Xzinhoanimado:1264798671346601985> | Você não possui permissão para utilizar este botão!`)
                                .setColor("Red")
                            ],
                            ephemeral: true
                        });
                    }

                    // Clona o canal atual
                    const canalNovo = await interaction.channel.clone();

                    // Deleta o canal antigo
                    await interaction.channel.delete();

                    // Envia uma mensagem no novo canal indicando que ele foi "nukado"
                    await canalNovo.send({ content: `Nuked by \`<@${interaction.user.id}>\`` });

                } else if (interaction.customId === "negar") {
                    // Verifica se o usuário tem permissão para utilizar o botão "negar"
                    if (!member.roles.cache.has("1255284331513909339")) {
                        return interaction.reply({
                            embeds: [new EmbedBuilder()
                                .setDescription(`<a:Xzinhoanimado:1264798671346601985> | Você não possui permissão para utilizar este botão!`)
                                .setColor("Red")
                            ],
                            ephemeral: true
                        });
                    }

                    // Atualiza a interação para mostrar que o usuário negou o nuker neste canal
                    await interaction.update({ 
                        content: `<:certo:1264798921612460032> | Olá ${interaction.user}, você negou o nuker neste canal.`,
                        embeds: [],
                        components: [] 
                    });
                }
            } catch (error) {
                console.error('Erro ao processar interação de botão:', error);
                await interaction.reply({
                    content: `<a:Xzinhoanimado:1264798671346601985> | Ocorreu um erro ao processar a interação de botão.`,
                    ephemeral: true
                });
            }
        }
    }
};
