import { ScriptEvent } from '@resources/shared/constants';
import { OnClient } from '@abstractFlo/server';
import { hash, Player, Vector3, Vehicle } from 'alt-server';
import { UtilsService } from '@abstractFlo/shared';
import { singleton } from 'tsyringe';

@singleton()
export class ServerPlayerComponent {


  /**
   * Spawn the player at specific location after connection complete
   *
   * @param {Player} player
   */
  @OnClient(ScriptEvent.Player.ConnectionComplete)
  public spawnPlayer(player: Player): void {
    player.model = 'mp_m_freemode_01';
    player.pos = new Vector3(0, 0, 72);
  }

  /**
   * Create new vehicle for current player
   *
   * @param {Player} player
   * @param {string} carName
   */
  @OnClient(ScriptEvent.Command.CreateVehicle)
  public createVehicle(player: Player, carName: string): void {

    UtilsService.log('CREATE VEHICLE');

    this.destroyVehicleIfPlayerHasOne(player);

    const name = hash(carName);
    const { x, y, z } = player.pos;
    const vehicle = new Vehicle(name, x + 2, y + 2, z, 0, 0, 0);

    player.currentVehicle = vehicle.id;

    UtilsService.log(`Create new vehicle [${name}] for ${player.name}`);
  }

  /**
   * Look for existing vehicle and destroy
   *
   * @param {Player} player
   * @private
   */
  private destroyVehicleIfPlayerHasOne(player: Player) {
    if (player.currentVehicle !== null) {
      const vehicle = Vehicle.getByID(player.currentVehicle);
      vehicle.destroy();

      player.currentVehicle = null;

      UtilsService.log(`Destroy vehicle from ${player.name}`);

    }
  }
}
