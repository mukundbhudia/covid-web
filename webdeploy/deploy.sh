#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run predeploy

# navigate into the build output directory
cp webdeploy/.gitlab-ci.yml ./build/.gitlab-ci.yml
cd ./build

git init
# git remote add origin git@gitlab.com:mukundbhudia/covid19.mukund.uk.git
git add -A
git commit -m 'deploy'
# git push origin master
git push -f git@gitlab.com:mukundbhudia/covid19.mukund.uk.git master:gl-pages

cd -
