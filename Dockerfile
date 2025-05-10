# Usando Node.js como imagem base
FROM node:18-slim

# Instalando dependências necessárias para o canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Criando diretório da aplicação
WORKDIR /app

# Copiando arquivos de dependências
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando o resto dos arquivos da aplicação
COPY . .

# Expondo a porta que a aplicação usa
EXPOSE 3005

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
