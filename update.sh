#! /bin/bash
# This script is ran daily at 18:00 (6:00PM) in my timezone
cd "$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
pm2 stop yabluzo --watch
git reset --hard
git pull
npm i
npm audit fix
pm2 start yabluzo
