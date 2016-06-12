#!/bin/sh
# The script expects a directory path and mac address of the machine as input. It will create an output/pi directory within it and dump the user.sql in it

#Do setup
mkdir -p $LIBERRY_ROOT/output/pi;
rm $LIBERRY_ROOT/output/pi/*.sql || true;

#Dump user table as CSV
sqlite3 -init $LIBERRY_ROOT/code/scripts/pi/user_dump.command $LIBERRY_ROOT/database.sqlite .schema > $LIBERRY_ROOT/output/pi/user_schema.sql;
cp user.csv $LIBERRY_ROOT/output/pi/user.csv;
rm user.csv;

#Convert user.csv to user.sql
while IFS=',' read -r id external_id mac name username email password role status created_at updated_at
do
    echo "INSERT INTO user (external_id, mac, name, username, email, password, role, status, created_at, updated_at) VALUES ($id, '$mac', '$name', '$username', '$email', '$password', '$role', '$status', STR_TO_DATE($created_at, '%Y-%m-%d %H:%i:%s'), STR_TO_DATE($updated_at, '%Y-%m-%d %H:%i:%s')) ON DUPLICATE KEY UPDATE external_id=$id, mac='$mac', name='$name', username='$username', email='$email', password='$password', role='$role', status='$status', created_at=STR_TO_DATE($created_at, '%Y-%m-%d %H:%i:%s'), updated_at=STR_TO_DATE($updated_at, '%Y-%m-%d %H:%i:%s');" >> $LIBERRY_ROOT/output/pi/user.sql
done < $LIBERRY_ROOT/output/pi/user.csv

#Copy the generated user.sql to Pendrive
mkdir -p $1/output/pi;
cp -f $LIBERRY_ROOT/output/pi/user.sql $1/output/pi/$2_user.sql;


#Dump activity table as CSV
sqlite3 -init $LIBERRY_ROOT/code/scripts/pi/activity_dump.command $LIBERRY_ROOT/database.sqlite .schema > $LIBERRY_ROOT/output/pi/activity_schema.sql;
cp activity.csv $LIBERRY_ROOT/output/pi/activity.csv;
rm activity.csv;

#Convert activity.csv to activity.sql
while IFS=',' read -r id external_id mac user_id playlist_id content_id app_id attr1 attr2 attr3 attr4 attr5 created_at updated_at
do
    echo "INSERT INTO activity (external_id, mac, user_id, playlist_id, content_id, app_id, attr1, attr2, attr3, attr4, attr5, created_at, updated_at) VALUES ($id, '$mac', $user_id, $playlist_id, $content_id, $app_id, '$attr1', '$attr2', '$attr3', '$attr4', '$attr5', STR_TO_DATE($created_at, '%Y-%m-%d %H:%i:%s'), STR_TO_DATE($updated_at, '%Y-%m-%d %H:%i:%s')) ON DUPLICATE KEY UPDATE external_id=$id, mac='$mac', user_id=$user_id, playlist_id=$playlist_id, content_id=$content_id, app_id=$app_id, attr1='$attr1', attr2='$attr2', attr3='$attr3', attr4='$attr4', attr5='$attr5', created_at=STR_TO_DATE($created_at, '%Y-%m-%d %H:%i:%s'), updated_at=STR_TO_DATE($updated_at, '%Y-%m-%d %H:%i:%s');" >> $LIBERRY_ROOT/output/pi/activity.sql
done < $LIBERRY_ROOT/output/pi/activity.csv

#Copy the generated activity.sql to Pendrive
mkdir -p $1/output/pi;
cp -f $LIBERRY_ROOT/output/pi/activity.sql $1/output/pi/$2_activity.sql;
