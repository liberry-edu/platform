#!/bin/sh
# The script expects that the user.sql file from the pendrive would have been uploaded to the server.
# That path needs to be provided as parameter

mysql --host localhost --user root --database liberry --password=password < $1
