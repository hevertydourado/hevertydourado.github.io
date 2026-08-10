#!/bin/bash

# Build do site com destino customizado
JEKYLL_ENV=production bundle exec jekyll build --destination /opt/bitnami/projects/douratto.run
