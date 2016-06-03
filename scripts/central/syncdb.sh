#!/bin/sh
# The script expects that the user.sql file from the pendrive would have been uploaded to the server.
# That path needs to be provided as parameter

sqlite3 $LIBERRY_ROOT/database.sqlite < $1
