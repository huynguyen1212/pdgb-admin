#!/bin/bash
set -e


should_npm_install=false
# Check if package.json has changed
if git diff origin/$(git rev-parse --abbrev-ref HEAD) HEAD --name-only | grep -q 'package.json'; then
  echo "Package.json has changed. Running npm install..."
  should_npm_install=true
fi
git pull
# check should_npm_install 
if [ "$should_npm_install" = true ]; then
  npm install
fi

npm run build
cp -r dist/. /var/www/html/beworks/admin

echo "Build done..."
