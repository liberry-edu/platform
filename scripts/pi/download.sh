#!/bin/sh
# The script expects a directory path and mac address of the machine as input. It will create an output/pi directory within it and dump the user.sql in it

mkdir -p $LIBERRY_ROOT/output/pi;
rm $LIBERRY_ROOT/output/pi/user_schema.sql $LIBERRY_ROOT/output/pi/user.sql || true;
sqlite3 -init $LIBERRY_ROOT/code/scripts/pi/user_dump.command $LIBERRY_ROOT/database.sqlite .schema > $LIBERRY_ROOT/output/pi/user_schema.sql;
mkdir -p $1/output/pi;
cp user.sql $LIBERRY_ROOT/output/pi/user.sql;
rm user.sql;
cp -f $LIBERRY_ROOT/output/pi/user.sql $1/output/pi/$2_user.sql;
