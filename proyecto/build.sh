#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "==> Instalar dependencias"
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Recopilar archivos estáticos con WhiteNoise"
python manage.py collectstatic --no-input

echo "==> Ejecutar migraciones de Base de Datos"
python manage.py migrate
