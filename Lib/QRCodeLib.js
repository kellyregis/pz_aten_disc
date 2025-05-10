const { QRCodeStyling } = require('qr-code-styling-node/lib/qr-code-styling.common');
const canvas = require('canvas');

class qrGenerator {
    constructor({ imagePath }) {
        this.imagePath = imagePath;
    }

    generate = async function (data) {
        // Cria as opções do QRCodeStyling
        this.options = createOptions(data, this.imagePath);

        // Cria o QRCodeStyling
        this.qrCodeImage = createQRCodeStyling(canvas, this.options);

        // Obtém os dados brutos do QRCodeStyling
        return await getRawData(this.qrCodeImage);
    }
}

// cria as opções do QRCodeStyling
function createOptions(data, image) {
    return {
        width: 1000,
        height: 1000,
        data,
        image,
        margin: 25,
        qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'Q'
        },
        dotsOptions: {
            gradient: {
                type: 'radial',
                colorStops: [
                    { offset: 0, color: '#4400f4' }, // Roxo claro no início
                    { offset: 1, color: '#825fdc' }  // Novo tom de roxo no final
                ]
            },
            type: "extra-rounded"
        },
        backgroundOptions: {
            color: "#000000", // Fundo preto
        },
        imageOptions: {
            crossOrigin: "anonymous",
            imageSize: 0.3,
            margin: 3
        },
        cornersSquareOptions: {
            color: "#4400f4", // Cor roxa para os cantos quadrados
            type: 'square'
        },
        cornersDotOptions: {
            color: "#4400f4", // Cor roxa para os cantos de pontos
            type: 'square'
        }
    };
}

// cria o QRCodeStyling
function createQRCodeStyling(nodeCanvas, options) {
    return new QRCodeStyling({
        nodeCanvas, ...options
    });
}

// obter os dados do QRCodeStyling
async function getRawData(qrCodeImage) {
    return qrCodeImage.getRawData("png").then(r => {
        return {
            status: 'success',
            response: r.toString('base64')
        };
    }).catch(e => {
        return {
            status: 'error',
            response: e
        };
    });
}

module.exports.qrGenerator = qrGenerator;
