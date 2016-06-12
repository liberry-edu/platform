#!/bin/sh
# The script will dump the tables in the output directory on the server. The data needs to be moved to the pendrive through other mechanisms

mkdir -p $LIBERRY_ROOT/output/central;
rm $LIBERRY_ROOT/output/central/*.sql || true;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/category_dump.command $LIBERRY_ROOT/database.sqlite;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/content_dump.command $LIBERRY_ROOT/database.sqlite;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/module_dump.command $LIBERRY_ROOT/database.sqlite;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/playlist_dump.command $LIBERRY_ROOT/database.sqlite;
sqlite3 -init $LIBERRY_ROOT/code/scripts/central/playlist_content_dump.command $LIBERRY_ROOT/database.sqlite;

cp *.sql $LIBERRY_ROOT/output/central/;
rm *.sql;
