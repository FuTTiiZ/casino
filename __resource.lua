resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'

client_scripts {
  'client/main.lua',
  'config.lua'
}

server_scripts {
  'server/main.lua'
}

ui_page('client/html/index.html')

files {
    'client/html/index.html',
    'client/html/js/script.js',
    'client/html/css/style.css',
    'client/html/games.json'
}

dependency 'es_extended'
