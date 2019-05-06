ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

RegisterNetEvent('casino:startFlip')
AddEventHandler('casino:startFlip', function(amount, type)
  local _source = source
  local xPlayer = ESX.GetPlayerFromId(_source)
  local blackMoney = xPlayer.getAccount('black_money').money
  if not type then
    if xPlayer.getMoney() >= amount then
      xPlayer.removeMoney(amount)
      TriggerClientEvent('casino:flipCoin', _source, 'flipCoin')
    else
      TriggerClientEvent('casino:flipCoin', _source, 'coinNotEnough')
    end
  else
    if blackMoney >= amount then
      xPlayer.removeAccountMoney('black_money', amount)
      TriggerClientEvent('casino:flipCoin', _source, 'flipCoin')
    else
      TriggerClientEvent('casino:flipCoin', _source, 'coinNotEnough', type)
    end
  end
end)

RegisterNetEvent('casino:coinGiveWin')
AddEventHandler('casino:coinGiveWin', function(amount)
  local _source = source
  local xPlayer = ESX.GetPlayerFromId(_source)
  xPlayer.addMoney(amount)
end)
