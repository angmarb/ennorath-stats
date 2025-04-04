#!/bin/bash
curl 'https://bfmeladder.com/api/replays' > tmp/replays.json.tmp
python3 gather_stats.py 'tmp/replays.json.tmp' 'src/data/ennorath_data.json' 'Ennorath' '1.9.7.3'
