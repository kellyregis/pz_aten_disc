const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const { Painel } = require("../../Functions/Painel");
const { pedidos, pagamentos, carrinhos, configuracao, produtos } = require("../../DataBaseJson");
const { getPermissions } = require("../../Functions/PermissionsCache.js");

module.exports = {
  name: "aprovar",
  description: "Use para configurar minhas funções",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const startTime = Date.now();

    try {
      const perm = await getPermissions(client.user.id);
      if (!perm || !perm.includes(interaction.user.id)) {
        return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true });
      }

      if (!carrinhos.has(interaction.channel.id)) {
        return interaction.reply({ content: `❌ Não há um carrinho aberto neste canal.`, ephemeral: true });
      }

      await interaction.reply({ content: `✅ Pagamento aprovado manualmente. Aguarde..`, ephemeral: true });

      const yy = carrinhos.get(interaction.channel.id);
      const hhhh = produtos.get(`${yy.infos.produto}.Campos`);
      const gggaaa = hhhh.find(campo22 => campo22.Nome === yy.infos.campo);

      let valor = gggaaa.valor * yy.quantidadeselecionada;
      if (yy.cupomadicionado) {
        const hhhh2 = produtos.get(`${yy.infos.produto}.Cupom`);
        const gggaaaawdwadwa = hhhh2.find(campo22 => campo22.Nome === yy.cupomadicionado);
        valor *= (1 - gggaaaawdwadwa.desconto / 100);
      }

      const valorFormatado = Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const embedColor = configuracao.get('Cores.Processamento') || '#fcba03';

      const mandanopvdocara = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: 'Pedido #Aprovado Manualmente' })
        .setTitle('🛍️ Pedido solicitado')
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp()
        .setDescription('Seu pedido foi criado e agora está aguardando a confirmação do pagamento')
        .addFields({ name: '**Detalhes**', value: `\`${yy.quantidadeselecionada}x ${yy.infos.produto} - ${yy.infos.campo} | R$ ${valorFormatado}\`` });

      try {
        await interaction.user.send({ embeds: [mandanopvdocara] });
      } catch (error) {
        console.error('Não foi possível enviar mensagem ao usuário:', error);
      }

      const dsfjmsdfjnsdfj = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: 'Pedido #Aprovado Manualmente' })
        .setTitle('🛍️ Pedido solicitado')
        .setDescription(`Usuário ${interaction.user} solicitou um pedido`)
        .addFields(
          { name: '**Detalhes**', value: `\`${yy.quantidadeselecionada}x ${yy.infos.produto} - ${yy.infos.campo} | R$ ${valorFormatado}\`` },
          { name: '**Forma de pagamento**', value: 'Manualmente' }
        )
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

      try {
        const channela = await client.channels.fetch(configuracao.get('ConfigChannels.logpedidos'));
        const logMessage = await channela.send({ embeds: [dsfjmsdfjnsdfj] });
        carrinhos.set(`${interaction.channel.id}.replys`, { channelid: logMessage.channel.id, idmsg: logMessage.id });
      } catch (error) {
        console.error('Não foi possível enviar mensagem para o canal de log:', error);
      }

      pagamentos.set(`${interaction.channel.id}`, {
        pagamentos: { id: 'Aprovado Manualmente', method: 'pix', data: Date.now() }
      });

      await interaction.reply({ content: `✅ Pagamento aprovado manualmente. Aguarde..`, ephemeral: true });

      const endTime = Date.now();
   //   console.log(`Comando executado em ${endTime - startTime}ms`);
    } catch (error) {
      console.error('Erro ao executar o comando:', error);
      interaction.reply({ content: `❌ Ocorreu um erro ao processar seu pedido. Tente novamente mais tarde.`, ephemeral: true });
    }
  }
};
