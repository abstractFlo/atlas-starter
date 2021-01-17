import { singleton } from 'tsyringe';
import { Module } from '@abstractFlo/shared';
import { ServerPlayerModule } from './modules/player/server-player.module';

import './extends/player/alt-player.prototype';

@Module({
  imports: [ServerPlayerModule]
})
@singleton()
export class ServerModule {}
