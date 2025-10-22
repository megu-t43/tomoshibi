#!/bin/bash
cd /home/user/tomoshibi-dashboard/dist
python3 -m http.server 3000 --bind 0.0.0.0
