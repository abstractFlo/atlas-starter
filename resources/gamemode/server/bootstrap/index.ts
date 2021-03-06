import { container } from 'tsyringe';
import { PlayerBootstrap } from './player.bootstrap';

const playerBootstrap = container.resolve(PlayerBootstrap);
playerBootstrap.addPlayerKickHandler();

/**
 * Remove the player kick handler
 */
export function removePlayerKickHandler(): void {
  playerBootstrap.removePlayerKickHandler();
}
