#!/bin/sh
# The script expects a directory path as input. It will pick the sql scripts from output/central directory from there and run them against local DB

sqlite3 $LIBERRY_ROOT/database.sqlite < ./scripts/pi/empty_content_tables.sql
sqlite3 $LIBERRY_ROOT/database.sqlite < $1/output/central/category.sql
sqlite3 $LIBERRY_ROOT/database.sqlite < $1/output/central/module.sql
sqlite3 $LIBERRY_ROOT/database.sqlite < $1/output/central/content.sql
sqlite3 $LIBERRY_ROOT/database.sqlite < $1/output/central/playlist.sql
sqlite3 $LIBERRY_ROOT/database.sqlite < $1/output/central/playlist_content.sql
