#!/bin/sh
# The script will dump the tables in the output directory on the server. The data needs to be moved to the pendrive through other mechanisms

mkdir -p $LIBERRY_ROOT/output/central;
rm $LIBERRY_ROOT/output/central/*.sql || true;

mysqldump --no-create-info --add_locks=false --host localhost --u root --password=password liberry category > category.sql;
mysqldump --no-create-info --add_locks=false --host localhost --u root --password=password liberry content > content.sql;
mysqldump --no-create-info --add_locks=false --host localhost --u root --password=password liberry module > module.sql;
mysqldump --no-create-info --add_locks=false --host localhost --u root --password=password liberry playlist > playlist.sql;
mysqldump --no-create-info --add_locks=false --host localhost --u root --password=password liberry playlist_content > playlist_content.sql;

cp *.sql $LIBERRY_ROOT/output/central/;
rm *.sql;
