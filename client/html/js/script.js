// Henter spillene
let games = {};
$.getJSON('games.json', function (data) {
  games = data;
}).then(function() {
    let freeze = false;

  // Laver en funktion til at lukke menuen
  function closeMenu() {
    if (!freeze) {
      setActive($('#' + tab), false);
      setTab(welcome);
      tab = 'welcome';
      $.post('http://casino/close', JSON.stringify({}));
    }
  }

  function colorImg(col) {
    if (col === 'green') {
      return 'https://i.imgur.com/p77JJ0Z.png';
    } else {
      return 'https://i.imgur.com/9qlZkbS.png';
    }
  }

  function formatPrice(price, kr) {
    return (!kr ? price.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' kr.' : price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
  }

  function setActive(e, on) {
    if (on) {
      let cur = e.attr('class');
      e.attr('class', cur += ' clicked');
    } else if (!on) {
      let cur = e.attr('class');
      let newC = cur.replace('clicked', '');
      e.attr('class', newC);
    }
  }

  function setTab(page) {
    $('#containerList')[0].innerHTML = page;
  }

  function remove(array, element) {
    const index = array.indexOf(element);

    if (index > -1) {
      array.splice(index, 1);
    }
  }

  // Laver de forskellige tabs
  const welcome = $('#containerList')[0].innerHTML;

  const coinflip = `
    <li class="menu-header">
      <div>
        <h1 class="noselect">
          Coinflip
        </h1>
      </div>
    </li>
    <div class="shadow"></div>
    <li class="gm-info">
      <b>Hvordan virker spillet?</b><br>Simpelt, bare klik på mønten, og så er det 50:50 om du <span class="win">vinder</span> eller <span class="loose">taber</span>.<br>Vinder du, får du <span class="multiplier">${games.coinflip.multiplier}x</span> dine penge tilbage.
    </li>
    <li class="noselect coin-container">
      <div id="coin">
        <img class="side-g" src="${colorImg('green')}">
        <img class="side-r" src="${colorImg('red')}">
      </div>
    </li>
    <li id="inputOptions" class="noselect amount-container">
      <div><p>${formatPrice(games.coinflip.amounts[0], true)}</p></div>
      <div><p>${formatPrice(games.coinflip.amounts[1], true)}</p></div>
      <div><p>${formatPrice(games.coinflip.amounts[2], true)}</p></div>
      <div><p>${formatPrice(games.coinflip.amounts[3], true)}</p></div>
      <div><p>${formatPrice(games.coinflip.amounts[4], true)}</p></div>
    </li>
    <li class="noselect color-options">
      <div id="green" class="green-option"></div>
      <div id="red" class="red-option"></div>
    </li>
    <li>
      <div class="gm-info">
        <p id="input"><b>Sats:</b></p>
        <p id="color"><b>Farve:</b></p>
        <p id="winMoney"><b>Mulig gevinst:</b></p>
      </div>
    </li>
    <li>
      <div class="gm-info">
        <p id="status"><b>Status:</b> Intet valgt.</p>
      </div>
    </li>
  `;

  // Laver tab variablet
  let tab = 'welcome';

  // Når serveren loader
  $(document).ready(function() {
    window.addEventListener('message', function(event) {
      const data = event.data;
      if (data.type === 'casino') {
        if (data.display === true) {
          $('.window').show();
        } else if (data.display === false) {
          $('.window').hide();
        }
      }
    });
  });
  // Luk menuen med "ESC" knappen på tasteturet
  $(document).keyup(function (data) {
      if (data.which == 27) {
        closeMenu();
      }
  });

  // Luk menuen med "x" oppe in højre hjørne
  $('.x-container').bind('click', function() {
    closeMenu();
  });

  // Coinflip
  $('#coinflip').bind('click', function() { if (!freeze) {
    if (tab != 'coinflip') {
      tab = 'coinflip';
      setActive($('#coinflip'), true);
      setTab(coinflip);

      window.addEventListener('message', function(event) {
        const data = event.data;
        if (data.event === 'flipCoin') {
          flipCoin();
        } else if (data.event === 'coinNotEnough') {
          $('#status')[0].innerHTML = `<b>Status:</b> <span class="loose">Du har ikke nok kontanter på dig.</span>`;
          coinFlip = true;
        }
      });

      let status = [];
      let coinFlip;
      let input;
      let outcome;
      let chosen = false;
      let color;
      let profit;

      function flipCoin() {
        freeze = true;
        $('#status')[0].innerHTML = `<b>Status:</b> Mønten flipper...`;
        let flipResult = Math.random();
        $('#coin').removeClass();
        setTimeout(function() {
          if (flipResult <= 0.5) {
            $('#coin').addClass('green');
            outcome = 'green';
          } else {
            $('#coin').addClass('red');
            outcome = 'red';
          }
        }, 100);
        setTimeout(function() {
          coinFlip = true;
          freeze = false;

          if (outcome === color) {
            $('#status')[0].innerHTML = `<b>Status:</b> <span class="win">Du vandt!</span>`;
            $.post('http://casino/coinGiveWin', JSON.stringify({amount: input * 2}));
          } else {
            $('#status')[0].innerHTML = `<b>Status:</b> <span class="loose">Du tabte.</span>`;
          }
        }, 3000);
      }

      function updateStatus() {
        if (status.length == 2) {
          $('#status')[0].innerHTML = `<b>Status:</b> Farve og sats valgt.`;
        } else if (status.length == 1 && status[0] === 'color') {
          $('#status')[0].innerHTML = `<b>Status:</b> Farve valgt.`;
        } else if (status.length == 1 && status[0] === 'amount') {
          $('#status')[0].innerHTML = `<b>Status:</b> Sats valgt.`;
        } else {
          $('#status')[0].innerHTML = `<b>Status:</b> Intet valgt.`;
        }
      }

      $('#coin').bind('click', function() {
        if (coinFlip && color) {
          $.post('http://casino/startFlip', JSON.stringify({amount: input}));
          coinFlip = false;
        }
      });

      $('#inputOptions').on('click', 'div', function() { if (!freeze) {
        if (chosen === false) {
          setActive($(this), true);
          chosen = $(this).index();
          coinFlip = true;
          status.push('amount');
          input = games.coinflip.amounts[chosen];
          $('#input')[0].innerHTML = `<b>Sats:</b> <span class="price">${formatPrice(input)}</span>`;
          $('#winMoney')[0].innerHTML = `<b>Mulig gevinst:</b> <span class="price">${formatPrice(input * games.coinflip.multiplier)}</span>`;
          updateStatus();
        } else if ($(this).index() === chosen) {
          setActive($(this), false);
          remove(status, 'amount');
          chosen = false;
          coinFlip = false;
          $('#input')[0].innerHTML = `<b>Sats:</b>`;
          $('#winMoney')[0].innerHTML = `<b>Mulig gevinst:</b>`;
          updateStatus();
        } else {
          setActive($($('#inputOptions').children()[chosen]), false);
          setActive($(this), true);
          chosen = $(this).index();
          remove(status, 'amount');
          status.push('amount');
          coinFlip = true;
          input = games.coinflip.amounts[chosen];
          $('#input')[0].innerHTML = `<b>Sats:</b> <span class="price">${formatPrice(input)}</span>`;
          $('#winMoney')[0].innerHTML = `<b>Mulig gevinst:</b> <span class="price">${formatPrice(input * games.coinflip.multiplier)}</span>`;
          updateStatus();
        }
      }});

      $('.color-options').on('click', 'div', function() { if (!freeze) {
        if (!color) {
          color = $(this).attr('id');
          setActive($(this), true);
          status.push('color');
          $('#color')[0].innerHTML = `<b>Farve:</b> <img class="text-icon" src="${colorImg(color)}">`;
          updateStatus();
        } else if (color === $(this).attr('id')) {
          setActive($(this), false);
          color = false;
          $('#color')[0].innerHTML = `<b>Farve:</b>`;
          remove(status, 'color');
          updateStatus();
        } else {
          color = $(this).attr('id');
          setActive($('#' + (color === 'green' ? 'red' : 'green')), false);
          setActive($(this), true);
          remove(status, 'color');
          status.push('color');
          $('#color')[0].innerHTML = `<b>Farve:</b> <img class="text-icon" src="${colorImg(color)}">`;
          updateStatus();
        }
      }});

    } else if (tab === 'coinflip') {
      setActive($('#coinflip'), false);
      tab = 'welcome';
      setTab(welcome);
    }
  }});

  
});
