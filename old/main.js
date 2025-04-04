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





/**
 *
 * @typedef {Object} Match
 * @property {string} user
 * @property {number} win
 * @property {number} loss
 *
 * @typedef {Object} Faction
 * @property {string} name
 * @property {Match[]} matches
 *
 * @param {Faction} faction
 * @param {Set<string>}userWhitelist
 */
function renderFaction(faction, userWhitelist) {
  const matches = faction.matches.filter(m => userWhitelist.has(m.user));
  const win = matches.reduce((a, r) => r.win + a, 0), loss = matches.reduce((a, r) => r.loss + a, 0);
  const total = win + loss;
  const win_rate = win / (total > 0 ? total : 1);
  const cls = win_rate > 0.5 ? 'win' : (win_rate < 0.5 ? 'loss' : '');

  return `<tr class="${cls}">
    <td>${faction.name}</td>
    <td>${total}</td>
    <td>${win}</td>
    <td>${loss}</td>
    <td>${Math.round(win_rate * 10000) / 100}%</td>
</tr>`;
}
/**
 * @typedef {Object} Mode
 * @property {string} name
 * @property {Faction[]} factions
 *
 * @param {Mode} mode
 * @param {Set<string>} userWhitelist
 */
function renderMode(mode, userWhitelist) {
  let total = 0;
  return `
  <div class="mode" data-mode="${mode.name}">
    <h3>${mode.name}, всего игр: ${mode.total}</h3>
    <table>
        <thead>
            <tr>
                <th class="text-sort">Фракция</th>
                <th>Всего</th>
                <th>Побед</th>
                <th>Поражений</th>
                <th>Винрейт</th>
            </tr>
        </thead>    
        <tbody>
            ${mode.factions.map(f => renderFaction(f, userWhitelist)).join('\n')}
        </tbody>
      </table>
  </div>
    `;
}
$(document).on('click', 'th', function() {
  sortTable(this, $(this).parent().children('th').index(this), !$(this).hasClass('text-sort'));
});
$(document).ready(() => {
  /**
   *
   * @type {Map<string, Set<string>>}
   */
  const whitelistsByMode = new Map();
  /**
   *
   * @param {{
   *     date_min: string;
   *     date_max: string;
   *     modes: Mode[];
   * }} data
   */
  function load(data) {
    $('#date_min').text(`От ${data.date_min}`);
    $('#date_max').text(`От ${data.date_max}`);
    $('#tables').html(data.modes.map(m => {
      const whitelist = new Set();
      whitelistsByMode.set(m.name, whitelist);
      return renderMode(m, whitelist);
    }).join('\n'));
  }
  fetch('data.json').then(r => r.json()).then(load);
});