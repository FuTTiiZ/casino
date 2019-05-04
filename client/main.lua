function prompt(text)
  SetTextComponentFormat("STRING")
    AddTextComponentString(text)
  DisplayHelpTextFromStringLabel(0, 0, 0, -1)
end

local promptClose = false
RegisterNUICallback('close', function(data, cb)
  SendNUIMessage({display = 'none'})
    SetNuiFocus(false, false)
  promptClose = false
end)

Citizen.CreateThread(function()
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
        SendNUIMessage({display = 'casino'})
          SetNuiFocus(true, true)
        promptClose = true
      end
    end
    DrawMarker(1, Config.location.x, Config.location.y, Config.location.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 1.5, 1.0, 0, 255, 0, 90, 0, 0, 2, 0, 0, 0, 0)
  end
end)
