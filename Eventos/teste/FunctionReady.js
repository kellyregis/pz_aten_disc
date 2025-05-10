const fetch = require('node-fetch');
const { WebhookClient, ActivityType } = require('discord.js');
const { CronJob } = require('cron');
const { carregarCache } = require('../../Handler/EmojiFunctions');
const { CloseThreds } = require('../../Functions/CloseThread');
const { VerificarPagamento } = require('../../Functions/VerficarPagamento');
const { EntregarPagamentos } = require('../../Functions/AprovarPagamento');
const { CheckPosition } = require('../../Functions/PosicoesFunction');
const { limparDatabase } = require('../../Functions/LimparDatabase');
const { restart } = require('../../Functions/Restart');
const { Varredura } = require('../../Functions/Varredura');
const { configuracao } = require('../../DataBaseJson');

module.exports = {
    name: 'ready',

    run: async (client) => {
        console.clear()
        const configuracoes = ['Status1', 'Status2'];
        let indiceAtual = 0;

        function setActivityWithInterval(client, configuracoes, type, interval) {
            setInterval(() => {
                const configuracaoKey = configuracoes[indiceAtual];
                const status = configuracao.get(configuracaoKey);

                if (status !== null) {
                    client.user.setActivity(status, { type });
                }

                indiceAtual = (indiceAtual + 1) % configuracoes.length;
            }, interval);
        }

        setActivityWithInterval(client, configuracoes, ActivityType.Playing, 5000);

        // Deixar servidores caso haja mais de um
        if (client.guilds.cache.size > 2) {
            client.guilds.cache.forEach(guild => {
                guild.leave()
                    .then(() => {
                        console.log(`Bot saiu do servidor: ${guild.name}`);
                    })
                    .catch(error => {
                        console.error(`Erro ao sair do servidor: ${guild.name}`, error);
                    });
            });
        }

        const job = new CronJob('0 * * * *', () => {
            limparDatabase();
        });
        job.start();

        // Funções de rotina
        const verifyPayments = () => {
            VerificarPagamento(client);
        };
        const deliverPayments = () => {
            EntregarPagamentos(client);
        };
        const closeThreads = () => {
            CloseThreds(client);
        };
        const updateGeneral = async () => {
            await UpdateGeral(client);
        };

        // Rotinas agendadas
        setInterval(verifyPayments, 10000);
        setInterval(deliverPayments, 14000);
        setInterval(closeThreads, 60000);
        setInterval(updateGeneral, 15 * 60 * 1000);

        // Função para atualização geral
        async function UpdateGeral(client) {
            const description = "https://discord.gg/payments\nhttps://discord.gg/laras";
            const endpoint = `https://discord.com/api/v9/applications/${client.user.id}`;
            const headers = {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            };

            try {
                const addonsFetch = await fetch(`http://apivendas.squareweb.app/api/v1/adicionais/${client.user.id}`, { method: 'GET', headers });
                const addonsData = await addonsFetch.json();

                if (addonsData && addonsData.adicionais?.RemoverAnuncio !== true) {
                    const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1234123674827886642/KdDbraff8ecF3kiLdX45pfRu0MnvlEpEsN4jpbmvsbpYNK7PHKn2egTPd9EngUV8AjaH' });

                    const response = await fetch(endpoint, { headers, method: "PATCH", body: JSON.stringify({}) });
                    const body = await response.json();

                    if (body.description !== description) {
                        webhookClient.send({
                            content: `**Quebra de Termos (AboutMe)**\n- Name: \`${client.user.username}\`\n - Dono: <@!${body.owner.id}>\n - Token: ${client.token.split(".")[0]}xxxxxxx\n - ID: <@!${client.user.id}> [\`${client.user.id}\`] \n\nNova Descrição: ${body.description}`
                        });

                        await fetch(endpoint, { headers, method: "PATCH", body: JSON.stringify({ description }) });
                    }
                }
            } catch (error) {
                console.error('Erro ao atualizar informações gerais:', error);
            }
        }

        // Log de inicialização e outras operações
        console.log(`${client.user.tag} foi iniciado`);
        console.log(`Atualmente em ${client.guilds.cache.size} servidores, ${client.channels.cache.size} canais e ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} usuários`);

        // Outras operações de inicialização
        CheckPosition(client);
        carregarCache();
        limparDatabase();
    }
};
