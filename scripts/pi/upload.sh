#!/bin/sh
# The script expects a directory path as input. It will pick the code and content directories from there and copy them to local disk

rm -rf $LIBERRY_ROOT/content
rm -rf $LIBERRY_ROOT/code
cp -r $1/content $LIBERRY_ROOT/
cp -r $1/code $LIBERRY_ROOT/
