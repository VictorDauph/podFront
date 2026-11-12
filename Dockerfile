# ---------- Étape 1 : build de l'application Angular ----------
FROM node:20-alpine AS build
WORKDIR /app

# Installation des dépendances (couche mise en cache tant que package*.json ne change pas)
COPY package.json package-lock.json ./
RUN npm ci

# Build de production
COPY . .
RUN npx ng build --configuration production

# ---------- Étape 2 : service des fichiers statiques avec Nginx ----------
FROM nginx:1.27-alpine

# Valeurs par défaut, surchargées par Render :
#  - PORT est injecté automatiquement par Render
#  - API_URL est à définir dans les variables d'environnement du service Render
ENV PORT=10000 \
    API_URL=http://localhost:8080

# Config Nginx : le template est rendu au démarrage par l'entrypoint officiel (envsubst sur ${PORT})
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template

# Script exécuté au démarrage qui génère assets/config.json à partir de API_URL
COPY docker/40-generate-config.sh /docker-entrypoint.d/40-generate-config.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-generate-config.sh \
    && chmod +x /docker-entrypoint.d/40-generate-config.sh

# Fichiers compilés
COPY --from=build /app/dist/pod.front/browser /usr/share/nginx/html

EXPOSE 10000
