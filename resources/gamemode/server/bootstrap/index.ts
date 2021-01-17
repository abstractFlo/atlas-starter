import * as alt from 'alt-server';
import { resolve } from 'path';
import { altLibRegister, setupServerConfigPath } from '@abstractFlo/shared';
import { PlayerBootstrap } from './player.bootstrap';
import { container } from 'tsyringe';

altLibRegister(alt);
setupServerConfigPath(resolve('config'));

const playerBootstrap = container.resolve(PlayerBootstrap);
playerBootstrap.addPlayerKickHandler();
