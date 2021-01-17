import { off, on, Player } from 'alt-server';
import { singleton } from 'tsyringe';
import { UtilsService } from '@abstractFlo/shared';

@singleton()
export class PlayerBootstrap {

  /**
   * Remove the kick handler
   */
  public removePlayerKickHandler(): void {
    off('playerConnect', this.playerKickHandler);
    UtilsService.log('Unloaded ~lg~playerKickHandler~w~');
  }

  /**
   * Add Player kick handler
   */
  public addPlayerKickHandler(): void {
    on('playerConnect', this.playerKickHandler);
    UtilsService.log('Loaded ~lg~playerKickHandler~w~');
  }

  /**
   * Register player kick handler
   * @private
   */
  private playerKickHandler(player: Player): void {
    player.kick(`Can't connect, server is booting. Please try again later.`);
  }

}
