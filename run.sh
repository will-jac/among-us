#!/bin/bash

echo Starting backend server...
cd backend
node server.js &


echo Starting frontend server...
cd ../src
npm start
