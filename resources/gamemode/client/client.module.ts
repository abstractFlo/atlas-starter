import { singleton } from 'tsyringe';
import { Module } from '@abstractFlo/shared';
import { ClientPlayerModule } from './modules/player/client-player.module';

@Module({
  imports: [ClientPlayerModule]
})
@singleton()
export class ClientModule {}
