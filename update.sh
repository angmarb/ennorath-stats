#!/bin/bash
echo 'Downloading replay list'
#ssh mymyp -t "curl 'https://bfmeladder.com/api/replays' > replays.json.tmp"
#scp mymyp:replays.json.tmp tmp/replays.json.tmp
ssh mymyp -t "curl 'https://bfmeladder.com/ladders?arena=8a0e14c4-3204-4973-96e3-62ba9dc8526b&gamemode=1%20versus%201' > tmp"
scp mymyp:tmp 'tmp/1 versus 1'
ssh mymyp -t "curl 'https://bfmeladder.com/ladders?arena=8a0e14c4-3204-4973-96e3-62ba9dc8526b&gamemode=2%20versus%202' > tmp"
scp mymyp:tmp 'tmp/2 versus 2'
ssh mymyp -t "curl 'https://bfmeladder.com/ladders?arena=8a0e14c4-3204-4973-96e3-62ba9dc8526b&gamemode=3%20versus%203' > tmp"
scp mymyp:tmp 'tmp/3 versus 3'
ssh mymyp -t "curl 'https://bfmeladder.com/ladders?arena=8a0e14c4-3204-4973-96e3-62ba9dc8526b&gamemode=4%20versus%204' > tmp"
scp mymyp:tmp 'tmp/4 versus 4'
ssh mymyp -t "curl 'https://bfmeladder.com/ladders?arena=8a0e14c4-3204-4973-96e3-62ba9dc8526b&gamemode=FFA4' > tmp"
scp mymyp:tmp 'tmp/FFA4'
ssh mymyp -t "curl 'https://bfmeladder.com/ladders?arena=8a0e14c4-3204-4973-96e3-62ba9dc8526b&gamemode=Randomizer' > tmp"
scp mymyp:tmp  'tmp/Randomizer'
ssh mymyp -t "curl 'https://bfmeladder.com/ladders?arena=8a0e14c4-3204-4973-96e3-62ba9dc8526b&gamemode=FFA%204%20rings' > tmp"
scp mymyp:tmp 'tmp/FFA 4 rings'
#curl 'https://bfmeladder.com/api/replays' > tmp/replays.json.tmp
#echo 'gather 1.9.7.5 stats'
#python3 gather_stats.py 'tmp/replays.json.tmp' 'src/data/ennorath_data_1975.json' 'Ennorath' '1.9.7.5' '8a0e14c4-3204-4973-96e3-62ba9dc8526b'
#echo 'gather 1.9.7.6 stats'
#python3 gather_stats.py 'tmp/replays.json.tmp' 'src/data/ennorath_data_1976.json' 'Ennorath' '1.9.7.6' '8a0e14c4-3204-4973-96e3-62ba9dc8526b'
echo 'gather 1.9.7.7 stats'
python3 gather_stats.py 'tmp/replays.json.tmp' 'src/data/ennorath_data_1977.json' 'Ennorath' '1.9.7.7' '8a0e14c4-3204-4973-96e3-62ba9dc8526b'
#echo 'gather 1.9.7.5 matchaps'
#python3 legacy_matchaps.py 'tmp/replays.json.tmp' 'src/matchaps1975.html' 'Ennorath' '1.9.7.5'
#echo 'gather 1.9.7.6 matchaps'
#python3 legacy_matchaps.py 'tmp/replays.json.tmp' 'src/matchaps1976.html' 'Ennorath' '1.9.7.6'
echo 'gather 1.9.7.7 matchaps'
python3 legacy_matchaps.py 'tmp/replays.json.tmp' 'src/matchaps1977.html' 'Ennorath' '1.9.7.7'
rm -rf docs/* && rm -rf .parcel-cache/ && npm run build
