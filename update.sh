#!/bin/bash
echo 'Downloading replay list'
curl 'https://bfmeladder.com/api/replays' > tmp/replays.json.tmp
#echo 'gather 1.9.7.3 stats'
#python3 gather_stats.py 'tmp/replays.json.tmp' 'src/data/ennorath_data_1973.json' 'Ennorath' '1.9.7.3' '8a0e14c4-3204-4973-96e3-62ba9dc8526b'
echo 'gather 1.9.7.5 stats'
python3 gather_stats.py 'tmp/replays.json.tmp' 'src/data/ennorath_data_1975.json' 'Ennorath' '1.9.7.5' '8a0e14c4-3204-4973-96e3-62ba9dc8526b'
#echo 'gather 1.9.7.3 matchaps'
#python3 legacy_matchaps.py 'tmp/replays.json.tmp' 'src/matchaps1973.html' 'Ennorath' '1.9.7.3'
echo 'gather 1.9.7.5 matchaps'
python3 legacy_matchaps.py 'tmp/replays.json.tmp' 'src/matchaps1975.html' 'Ennorath' '1.9.7.5'
rm -rf docs/*
echo 'building'
npm run build