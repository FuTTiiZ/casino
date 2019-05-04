// Henter spillene
let games = {};
$.getJSON('games.json', function (data) {
  games = data;
}).then(function() {
    let freeze = false;

  // Laver en funktion til at lukke menuen
  function closeCatalog() {
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
  `;

  // Laver tab variablet
  let tab = 'welcome';

  // Når serveren loader
  $(document).ready(function() {
    window.addEventListener('message', function(event) {
      const data = event.data;
      if (data.display === 'casino') {
        $('.window').show();
      } else {
        $('.window').hide();
      }
    });
  });
  // Luk menuen med "ESC" knappen på tasteturet
  $(document).keyup(function (data) {
      if (data.which == 27) {
        closeCatalog();
      }
  });

  // Luk menuen med "x" oppe in højre hjørne
  $('.x-container').bind('click', function() {
    closeCatalog();
  });

  $('#coinflip').bind('click', function() { if (!freeze) {
    if (tab != 'coinflip') {
      tab = 'coinflip';
      setActive($('#coinflip'), true);
      setTab(coinflip);

      let coinFlip;
      let input;
      let outcome;
      let chosen = false;
      let color;
      let profit;

      $('#coin').bind('click', function() {
        if (coinFlip && color) {
          coinFlip = false;
          freeze = true;
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
          }, 3000);
        }
      });

      $('#inputOptions').on('click', 'div', function() { if (!freeze) {
        if (chosen === false) {
          setActive($(this), true);
          chosen = $(this).index();
          coinFlip = true;
          input = games.coinflip.amounts[chosen];
          $('#input')[0].innerHTML = `<b>Sats:</b> <span class="price">${formatPrice(input)}</span>`;
          $('#winMoney')[0].innerHTML = `<b>Mulig gevinst:</b> <span class="price">${formatPrice(input * games.coinflip.multiplier)}</span>`;
        } else if ($(this).index() === chosen) {
          setActive($(this), false);
          chosen = false;
          coinFlip = false;
          $('#input')[0].innerHTML = `<b>Sats:</b>`;
          $('#winMoney')[0].innerHTML = `<b>Mulig gevinst:</b>`;
        } else {
          setActive($($('#inputOptions').children()[chosen]), false);
          setActive($(this), true);
          chosen = $(this).index();
          coinFlip = true;
          input = games.coinflip.amounts[chosen];
          $('#input')[0].innerHTML = `<b>Sats:</b> <span class="price">${formatPrice(input)}</span>`;
          $('#winMoney')[0].innerHTML = `<b>Mulig gevinst:</b> <span class="price">${formatPrice(input * games.coinflip.multiplier)}</span>`;
        }
      }});

      $('.color-options').on('click', 'div', function() { if (!freeze) {
        if (!color) {
          setActive($(this), true);
          color = $(this).attr('id');
          $('#color')[0].innerHTML = `<b>Farve:</b> <img class="text-icon" src="${colorImg(color)}">`;
        } else if (color === $(this).attr('id')) {
          setActive($(this), false);
          color = false;
          $('#color')[0].innerHTML = `<b>Farve:</b>`;
        } else {
          setActive($('#' + color), false);
          setActive($(this), true);
          color = $(this).attr('id');
          $('#color')[0].innerHTML = `<b>Farve:</b> <img class="text-icon" src="${colorImg(color)}">`;
        }
      }});

    } else if (tab === 'coinflip') {
      setActive($('#coinflip'), false);
      tab = 'welcome';
      setTab(welcome);
    }
  }});
});
