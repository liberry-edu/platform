#!/bin/sh
# The script expects a directory path and mac address of the machine as input. It will create an output/pi directory within it and dump the user.sql in it

#Do setup
mkdir -p $LIBERRY_ROOT/output/pi;
rm $LIBERRY_ROOT/output/pi/*.sql || true;

#Dump user table as CSV
sqlite3 -init $LIBERRY_ROOT/code/scripts/pi/user_dump.command $LIBERRY_ROOT/database.sqlite;
cp user.csv $LIBERRY_ROOT/output/pi/user.csv;
rm user.csv;

#Convert user.csv to user.sql
while IFS=',' read -r id external_id mac name username email password role status created_at updated_at
do
    echo "INSERT INTO user (external_id, mac, name, username, email, password, role, status, created_at, updated_at) VALUES ($id, $mac, $name, $username, $email, $password, $role, $status, $created_at, $updated_at) ON DUPLICATE KEY UPDATE external_id=$id, mac=$mac, name=$name, username=$username, email=$email, password=$password, role=$role, status=$status, created_at=$created_at, updated_at=$updated_at" >> $LIBERRY_ROOT/output/pi/user.sql
done < $LIBERRY_ROOT/output/pi/user.csv

#Copy the generated user.sql to Pendrive
mkdir -p $1/output/pi;
cp -f $LIBERRY_ROOT/output/pi/user.sql $1/output/pi/$2_user.sql;
