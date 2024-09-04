#!/bin/bash -e
git ls-tree -r --name-only HEAD | grep "$1" | while IFS= read -r filename; do
  echo "Processing $filename" >&2
  unixtime=$(git log -1 --format="%at" -- "$filename")
  printf '%s\t%s\0' "$unixtime" "$filename"
done
