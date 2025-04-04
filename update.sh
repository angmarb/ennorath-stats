#!/bin/bash
curl 'https://bfmeladder.com/api/replays' > tmp/replays.json.tmp
python3 gather_stats.py 'tmp/replays.json.tmp' 'src/data/ennorath_data.json' 'Ennorath' '1.9.7.3' '8a0e14c4-3204-4973-96e3-62ba9dc8526b'
rm -rf docs/*
npm run build
python3 legacy_matchaps.py 'tmp/replays.json.tmp' 'docs/matchaps.html' 'Ennorath' '1.9.7.3'