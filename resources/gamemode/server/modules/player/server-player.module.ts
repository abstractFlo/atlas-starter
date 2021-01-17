import { singleton } from 'tsyringe';
import { Module } from '@abstractFlo/shared';
import { ServerPlayerComponent } from './components/server-player.component';

@Module({
  components: [ServerPlayerComponent]
})
@singleton()
export class ServerPlayerModule {

}
