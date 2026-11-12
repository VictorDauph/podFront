#!/bin/sh
# Génère la configuration runtime de l'application à partir des variables d'environnement.
# Permet de changer l'URL de l'API sur Render sans rebuild de l'image.
set -e

CONFIG_DIR=/usr/share/nginx/html/assets
mkdir -p "$CONFIG_DIR"

cat > "$CONFIG_DIR/config.json" <<EOF
{
  "apiUrl": "${API_URL}"
}
EOF

echo "config.json généré avec apiUrl=${API_URL}"
