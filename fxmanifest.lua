fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'teke_phone'
author 'teke'
description 'Modüler FiveM telefon scripti (qbx_core + TypeScript + React NUI)'
version '0.1.0'

-- Derlenmiş TypeScript çıktıları (build.mjs -> esbuild)
server_script 'dist/server.js'
client_script 'dist/client.js'

-- NUI (Vite + React SPA build çıktısı)
ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/assets/**',
}

dependencies {
    'qbx_core',
    'ox_lib',
    'oxmysql',
    'ox_inventory',
}