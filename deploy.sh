#!/bin/sh -e
rm -r tmp dist
npm run build
rsync -va --delete dist/* www.ferrybig.me:www.ferrybig.me/
ssh -t www.ferrybig.me sh -c 'gzip -9r --keep www.ferrybig.me/; sudo rsync --checksum -a -v --delete-after www.ferrybig.me/* /var/www/www.ferrybig.me/latest/'
