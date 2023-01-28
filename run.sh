#!/bin/bash

echo Starting backend server...
cd backend
node server.js &


echo Starting frontend server...
cd ../
serve -l 9000 -s build

