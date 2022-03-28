#!/bin/sh -e
rm -r tmp dist
npm run build
rsync -va --delete dist/ www.ferrybig.me:www.ferrybig.me/
ssh cloud1.dev.ferrybig.me find www.ferrybig.me -type f "\\(" -name "\\*.txt" -o -name "\\*.xml" -o -name "\\*.html" -o -name "\\*.js" -o -name "\\*.css" -o -name "\\*.map" "\\)" -exec gzip -n -9 --keep {} +
ssh -t cloud1.dev.ferrybig.me sudo rsync --checksum -a -v --delete-after www.ferrybig.me/* /var/www/www.ferrybig.me/latest/
