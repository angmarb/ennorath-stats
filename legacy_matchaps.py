import sys
import json
import datetime

input_file_name = sys.argv[1]
output_file_name = sys.argv[2]
patch_name_token_1 = sys.argv[3]
patch_name_token_2 = sys.argv[4]
replays_map = json.loads(open(input_file_name, 'rt').read())

faction_wins_by_mode = dict()
faction_loss_by_mode = dict()
matchup1v1_wins = dict()
matchup1v1_loss = dict()
replays_by_mode = dict()
map_names = dict()
date_max = None
date_min = None

def incr(d, *keys):
    cur = d
    keys = list(keys)
    last = keys.pop()
    for k in keys:
        if k not in cur:
            cur[k] = dict()
        cur = cur[k]
    cur[last] = cur.get(last, 0) + 1

for replay in replays_map.values():
    if not replay['IsValid']:
        continue
    if not (patch_name_token_1 in replay['PatchName'] and patch_name_token_2 in replay['PatchName']):
        continue
    if any([player for player in replay['Players'] if not player['FactionName']]):
        continue
#    if not replay['MapId'] == 'maps_5Cmap_20mp_20jungles_20of_20far_20harad_5Cmap_20mp_20jungles_20of_20far_20harad_2Emap':
#        continue
    date_max = int(replay['Date']) if date_max is None or date_max < int(replay['Date']) else date_max
    date_min = int(replay['Date']) if date_min is None or date_min > int(replay['Date']) else date_min
    incr(replays_by_mode, replay['GamemodeName'])

    map_names[replay['MapId']] = replay['MapName']
    for player in replay['Players']:
        incr(faction_wins_by_mode if player['IsWinner'] else faction_loss_by_mode, replay['GamemodeName'], player['FactionName'])
    if replay['GamemodeName'] == '1 versus 1':
        winner = [player for player in replay['Players'] if player['IsWinner']][0]
        loser = [player for player in replay['Players'] if not player['IsWinner']][0]
        incr(matchup1v1_wins, winner['FactionName'] + '/' + loser['FactionName'])
        incr(matchup1v1_loss, loser['FactionName'] + '/' + winner['FactionName'])

date_min = datetime.datetime.fromtimestamp(date_min/1000.0)
date_max = datetime.datetime.fromtimestamp(date_max/1000.0)

print('date_min = ', date_min)
print('date_max = ', date_max)
heading = f'<h1>Статистика ладдера Эннората</h1><h2>от {date_min}</h2><h2>до {date_max}</h2><pre>Нажмите на заголовок столбца таблицы для сортировки</pre>'
table_htmls = []

table_html = f'<h3>1v1 матчапы</h3><table border="1"><thead><tr><th onclick="sortTable(this, 0)">Матчап</th><th onclick="sortTable(this, 1, true)">Всего</th><th onclick="sortTable(this, 2, true)">Побед</th><th onclick="sortTable(this, 3, true)">Поражений</th><th onclick="sortTable(this, 4, true)">Винрейт</th></tr></thead><tbody>'

for matchap in sorted(set(matchup1v1_wins.keys()).union(set(matchup1v1_loss.keys()))):
    win_count = matchup1v1_wins.get(matchap, 0)
    loss_count = matchup1v1_loss.get(matchap, 0)
    win_rate = float(win_count) / (float(win_count + loss_count) if win_count + loss_count > 0 else 1)
    print(matchap, 'wins = ', win_count, 'loss = ', loss_count)
    cls = 'win' if win_rate > 0.5 else 'lose' if win_rate < 0.5 else ''
    games_count = win_count + loss_count
    table_html += f'<tr class="{cls}"><td>{matchap}</td><td>{games_count}</td><td>{win_count}</td><td>{loss_count}</td><td>{round(win_rate * 100, 2)}%</td></tr>'
table_html += '</tbody></table>'
table_htmls.append(table_html)


table_htmls = '\n'.join([f'<div>{x}</div>' for x in table_htmls])
css = '''
table {
border-collapse: collapse;
}
td {
padding: 5px;
}
.win {
    background-color: rgba(0, 128, 0, 0.5);
}
.lose {
    background-color: rgba(128, 0, 0, 0.5);
}
.tables {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}
th {
    cursor: pointer;
}
'''
html = f'<html><head><meta charset="utf-8" /><style>{css}</style><script src="main.js"></script></head><body>{heading}<div class="tables">{table_htmls}</div></body></html>'
if output_file_name:
    open(output_file_name, 'wt').write(html)
