#!/bin/bash
#set -x

SYNC_FUNCTION_FILE="SyncFunction.js"
TEST_FILES="./test/*.js";
JS_BEAUTIFY="./node_modules/js-beautify/js/bin/js-beautify.js"

$JS_BEAUTIFY $SYNC_FUNCTION_FILE > "$SYNC_FUNCTION_FILE.tmp"
echo "$SYNC_FUNCTION_FILE.tmp"
mv "$SYNC_FUNCTION_FILE.tmp" $SYNC_FUNCTION_FILE

for f in $TEST_FILES
do
    $JS_BEAUTIFY $f > "$f.tmp"
    mv "$f.tmp" $f
done
