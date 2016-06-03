#!/bin/sh
# The script will dump the tables in the output directory on the server. The data needs to be moved to the pendrive through other mechanisms

mkdir -p $LIBERRY_ROOT/output/central;
rm $LIBERRY_ROOT/output/central/*.sql || true;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/category_dump.command $LIBERRY_ROOT/database.sqlite .schema > $LIBERRY_ROOT/output/central/category_schema.sql;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/content_dump.command $LIBERRY_ROOT/database.sqlite .schema > $LIBERRY_ROOT/output/central/content_schema.sql;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/module_dump.command $LIBERRY_ROOT/database.sqlite .schema > $LIBERRY_ROOT/output/central/module_schema.sql;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/playlist_dump.command $LIBERRY_ROOT/database.sqlite .schema > $LIBERRY_ROOT/output/central/playlist_schema.sql;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/playlist_content_dump.command $LIBERRY_ROOT/database.sqlite .schema > $LIBERRY_ROOT/output/central/playlist_content_schema.sql;

cp *.sql $LIBERRY_ROOT/output/central/;
rm *.sql;

# rm -rf $LIBERRY_ROOT/code/*
# cd $LIBERRY_ROOT/code/
# git clone https://github.com/liberry-edu/platform
