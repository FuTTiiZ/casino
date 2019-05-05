ESX = nil

function prompt(text)
  SetTextComponentFormat("STRING")
    AddTextComponentString(text)
  DisplayHelpTextFromStringLabel(0, 0, 0, -1)
end

local promptClose = false
RegisterNUICallback('close', function(data, cb)
  SendNUIMessage({
    type = 'casino',
    display = false
  })
    SetNuiFocus(false, false)
  promptClose = false
end)

RegisterNetEvent('casino:flipCoin')
AddEventHandler('casino:flipCoin', function(type)
  SendNUIMessage({event = type})
end)

Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end

  RegisterNUICallback('startFlip', function(data, cb)
    local amount = data.amount
    local ply = GetPlayerPed(-1)
    if amount < 0 then
      print('casino: ' .. ply.identifier .. ' laver et eller ander mærkeligt i kasinoen!')
      return
    end
    TriggerServerEvent('casino:startFlip', amount)
  end)

  RegisterNUICallback('coinGiveWin', function(data, cb)
    local amount = data.amount
    TriggerServerEvent('casino:coinGiveWin', amount)
  end)

  local mainBlip = AddBlipForCoord(Config.location.x, Config.location.y, Config.location.z)
    SetBlipSprite(mainBlip, 103)
    SetBlipDisplay(mainBlip, 4)
    SetBlipScale(mainBlip, 1.0)
    SetBlipColour(mainBlip, 2)
    SetBlipAsShortRange(mainBlip, true)
  BeginTextCommandSetBlipName("STRING")
    AddTextComponentString('Kasino')
  EndTextCommandSetBlipName(mainBlip)

  while true do
    Citizen.Wait(1)

    local plyPos = GetEntityCoords(GetPlayerPed(-1), 0)
    local plyDist = GetDistanceBetweenCoords(Config.location.x, Config.location.y, Config.location.z + 0.5, plyPos, true)

    if plyDist < 1.5 then
      if not promptClose then
        prompt('Klik ~INPUT_CONTEXT~ for at åbne kasinomenuen.')
      end
      if IsControlJustReleased(0, 86) then
        SendNUIMessage({
          type = 'casino',
          display = true
        })
          SetNuiFocus(true, true)
        promptClose = true
      end
    end
    DrawMarker(1, Config.location.x, Config.location.y, Config.location.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 1.5, 1.0, 0, 255, 0, 90, 0, 0, 2, 0, 0, 0, 0)
  end
end)
