import sys
import json
import datetime

top30 = [
  '8027ea56-c81f-44f6-bb9f-7ca944d2c10b',
  '6709b212-e901-4296-a138-0818102ab372',
  'ae32120b-f3cb-4185-b1c6-05fef97d8d04',
  'b0a27730-457b-4869-80f2-883648c887fb',
  '352bf117-7e0b-43cb-b319-06f0214e8b4a',
  '54f8131e-4c85-41b6-8ddb-aed941f45d6b',
  '4784df89-1a35-47c0-9e8a-07b829b441ce',
  'ec8f0c17-ef92-4b93-b6ac-a0267a52edf1',
  'c9b520fa-139c-48da-a553-75c1cb0488d7',
  '79dd7667-77db-46f9-9dcb-8d660222827e',
  '86758c0d-b8eb-46f0-956c-7c24dd8050f7',
  '3265ec05-54a8-46b8-a1ae-09419cb0c7ff',
  '1293b315-8a10-4295-90f2-593f0cb1cf7d',
  '056eda34-f1b1-41f4-b71e-36263c3aff86',
  '4eed214c-61ba-4c73-bfed-c296b06ed020',
  '53e4e81f-825c-468d-9cbf-a7381d4b203a',
  'ed2ea846-06b7-4695-998b-dc9e5f171e2f',
  'e057b2da-3dfe-4c8c-a69d-261a15593954',
  'ceeb1374-82de-4ed0-a68f-bd5d22867172',
  '866ba720-6e6f-4458-85e6-8045b48a072e',
  '9245fb48-6a9e-43fb-8d24-d49443f29b42',
  '4e492a22-dfe6-4646-b2e8-c4baf62fed9f',
  'eb94c027-5587-4205-aacb-d1d0fe4b1d39',
  '0e5f3832-7da5-49d5-8360-d42387379737',
  '963dfd67-76fe-4f42-b176-842a9db07abf',
  'ea81a8d4-84e1-4797-8c22-8cc39bd4de47',
  'c75b26cd-5e6d-410f-843c-45b987ba7b6e',
  'b07e54f5-05f8-48bb-b424-45f6921e3847',
  '0d4984c2-893d-4d70-afbc-15b10694c0bb',
  '7d986c85-8e7a-4721-85ed-5b2597e9dabc'
]




input_file_name = sys.argv[1]
output_file_name = sys.argv[2]
patch_name_token_1 = sys.argv[3]
patch_name_token_2 = sys.argv[4]
only_top30 = '--only' in sys.argv
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
duelcount = 0
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
        # if only_top30:
        #     if any([player for player in replay['Players'] if player['PlayerAccountUuid'] not in top30]):
        #         continue
        #     else:
        #         print('found replay')
        # else:
        #     if not any([player for player in replay['Players'] if player['PlayerAccountUuid'] in top30]):
        #         continue
        winner = [player for player in replay['Players'] if player['IsWinner']][0]
        loser = [player for player in replay['Players'] if not player['IsWinner']][0]
        duelcount += 1
        incr(matchup1v1_wins, winner['FactionName'] + '/' + loser['FactionName'])
        incr(matchup1v1_loss, loser['FactionName'] + '/' + winner['FactionName'])

date_min = datetime.datetime.fromtimestamp(date_min/1000.0)
date_max = datetime.datetime.fromtimestamp(date_max/1000.0)

#print('date_min = ', date_min)
#print('date_max = ', date_max)
heading = f'<h1>Матчапы {patch_name_token_1} {patch_name_token_2}</h1><h2>от {date_min}</h2><h2>до {date_max}</h2><h2>{duelcount} дуэлей</h2><a href="/ennorath-stats/">к статистике</a><pre>Нажмите на заголовок столбца таблицы для сортировки</pre>'
table_htmls = []

table_html = f'<h3>1v1 матчапы</h3><table border="1"><thead><tr><th onclick="sortTable(this, 0)">Матчап</th><th onclick="sortTable(this, 1, true)">Всего</th><th onclick="sortTable(this, 2, true)">Побед</th><th onclick="sortTable(this, 3, true)">Поражений</th><th onclick="sortTable(this, 4, true)">Винрейт</th></tr></thead><tbody>'

for matchap in sorted(set(matchup1v1_wins.keys()).union(set(matchup1v1_loss.keys()))):
    win_count = matchup1v1_wins.get(matchap, 0)
    loss_count = matchup1v1_loss.get(matchap, 0)
    win_rate = float(win_count) / (float(win_count + loss_count) if win_count + loss_count > 0 else 1)
    #print(matchap, 'wins = ', win_count, 'loss = ', loss_count)
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
script = '''
function sortTable(th, n, isNum) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = th.parentNode.closest("table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (isNum ? (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) : (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (isNum ? (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) : (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
'''
html = f'<html><head><meta charset="utf-8" /><style>{css}</style><script>{script}</script></head><body>{heading}<div class="tables">{table_htmls}</div></body></html>'
if output_file_name:
    open(output_file_name, 'wt').write(html)
