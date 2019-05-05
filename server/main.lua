ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

RegisterNetEvent('casino:startFlip')
AddEventHandler('casino:startFlip', function(amount)
  local _source = source
  local xPlayer = ESX.GetPlayerFromId(_source)
  if xPlayer.getMoney() >= amount then
    xPlayer.removeMoney(amount)
    TriggerClientEvent('casino:flipCoin', _source, 'flipCoin')
  else
    TriggerClientEvent('casino:flipCoin', _source, 'coinNotEnough')
  end
end)

RegisterNetEvent('casino:coinGiveWin')
AddEventHandler('casino:coinGiveWin', function(amount)
  local _source = source
  local xPlayer = ESX.GetPlayerFromId(_source)
  xPlayer.addMoney(amount)
end)
