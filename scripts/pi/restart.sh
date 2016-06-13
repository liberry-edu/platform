#!/bin/sh
rm -rf $LIBERRY_ROOT/code
cp -r $1/code $LIBERRY_ROOT/
pm2 stop app;
pm2 start app;
