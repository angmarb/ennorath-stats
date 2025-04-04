import sys
import json
import datetime
from collections import defaultdict

input_file_name = sys.argv[1]
output_file_name = sys.argv[2]
patch_name_token_1 = sys.argv[3]
patch_name_token_2 = sys.argv[4]
replays_map = json.loads(open(input_file_name, 'rt').read())

map_names = dict()
user_names = dict()
date_max = None
date_min = None


class Record:
    def __init__(self, mode, faction, user_uuid, map_id):
        self.mode = mode
        self.faction = faction
        self.user_uuid = user_uuid
        self.map_id = map_id
        self.wins = 0
        self.loss = 0

    def as_key(self):
        return self.mode + '!' + self.faction + '!' + self.user_uuid + '!' + self.map_id

    def serialize(self):
        return [self.faction, self.user_uuid, self.map_id, self.wins, self.loss]


records = dict()
for replay in replays_map.values():
    if not replay['IsValid']:
        continue
    if not (patch_name_token_1 in replay['PatchName'] and patch_name_token_2 in replay['PatchName']):
        continue
    if any([player for player in replay['Players'] if not player['FactionName']]):
        continue
    date_max = int(replay['Date']) if date_max is None or date_max < int(replay['Date']) else date_max
    date_min = int(replay['Date']) if date_min is None or date_min > int(replay['Date']) else date_min

    map_names[replay['MapId']] = replay['MapName']
    for player in replay['Players']:
        r = Record(replay['GamemodeName'], player['FactionName'], player['PlayerAccountUuid'], replay['MapId'])
        k = r.as_key()
        if k not in records:
            records[k] = r
        if player['IsWinner']:
            records[k].wins += 1
        else:
            records[k].loss += 1

        user_names[player['PlayerAccountUuid']] = player['PlayerAccountUuid']

records_by_mode = defaultdict(list)
for record in records.values():
    records_by_mode[record.mode].append(record)
date_min = datetime.datetime.fromtimestamp(date_min/1000.0)
date_max = datetime.datetime.fromtimestamp(date_max/1000.0)
if output_file_name:
    open(output_file_name, 'wt').write(json.dumps({
        'date_min': str(date_min),
        'date_max': str(date_max),
        'mapNames': map_names,
        'userNames': user_names,
        'data': [{'mode': mode, 'data': [r.serialize() for r in modeRecords]} for mode, modeRecords in records_by_mode.items()]
    }))
