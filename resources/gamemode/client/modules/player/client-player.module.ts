import { singleton } from 'tsyringe';
import { Module } from '@abstractFlo/shared';
import { ClientPlayerComponent } from './components/client-player.component';

@Module({
  components: [ClientPlayerComponent]
})
@singleton()
export class ClientPlayerModule {

}
