import { PlayerInterface } from './player.interface';
import { Player } from 'alt-server';
import { PlayerExtend } from './player.extend';

declare module 'alt-server' {
  export interface Player extends PlayerInterface {}
}

Player.prototype = new PlayerExtend();
