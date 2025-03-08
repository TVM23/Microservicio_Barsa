# Etapa de desarrollo
FROM node:22-slim AS development

WORKDIR /usr/src/app

# ✅ Instalar dependencias necesarias para ODBC
RUN apt-get update && apt-get install -y \
    unixodbc \
    unixodbc-dev \
    odbcinst \
    odbc-mdbtools \
    && rm -rf /var/lib/apt/lists/*

# ✅ Copiar archivos de configuración ODBC antes de instalar dependencias
COPY config/odbcinst.ini /etc/odbcinst.ini
COPY config/odbc.ini /etc/odbc.ini

# ✅ Instalar dependencias de Node
COPY package*.json ./
RUN npm install

# ✅ Copiar el código fuente
COPY . .  
COPY libs ./libs  

# ✅ Compilar el código
RUN npm run build

# Etapa de producción
FROM node:22-slim AS production

WORKDIR /usr/src/app

# ✅ Instalar dependencias necesarias para ODBC
RUN apt-get update && apt-get install -y \
    unixodbc \
    unixodbc-dev \
    odbcinst \
    odbc-mdbtools \
    && rm -rf /var/lib/apt/lists/*

# ✅ Copiar archivos de configuración ODBC
COPY odbcinst.ini /etc/odbcinst.ini
COPY odbc.ini /etc/odbc.ini

# ✅ Instalar solo dependencias de producción
COPY package*.json ./
RUN npm install --only=production

# ✅ Copiar código compilado desde la etapa de desarrollo
COPY --from=development /usr/src/app/dist ./dist
COPY libs ./libs  

# ✅ Comando de inicio
CMD ["node", "dist/main"]
