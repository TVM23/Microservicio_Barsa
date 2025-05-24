# Etapa de desarrollo
FROM node:22-slim AS development

WORKDIR /usr/src/app

# Instalar dependencias necesarias para ODBC
RUN apt-get update && apt-get install -y \

    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

#COPY libs ./libs 
COPY ./libs ./libs

COPY . .

RUN npm run build

# Etapa de producción
FROM node:22-slim AS production

WORKDIR /usr/src/app

# Instalar dependencias necesarias para ODBC
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# RUN npm install --only=production
COPY --from=development /usr/src/app/node_modules ./node_modules

#COPY libs ./libs 
COPY ./libs ./libs

COPY --from=development /usr/src/app/dist ./dist

#CMD ["node", "dist/main"]
CMD ["node", "dist/apps/user-authentication/main"]

# Si es para producción, puedes modificar la línea CMD por:
# CMD ["node", "dist/apps/api-gateway/main"]


