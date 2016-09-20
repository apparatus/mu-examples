#!/bin/bash

cd ./system/service1
nohup node main.js &

cd ../service2
nohup node main.js &

cd ../service3
nohup node main.js &

