import { singleton } from 'tsyringe';
import { Module } from '@abstractflo/atlas-shared';
import { PlayerComponent } from './components/player.component';

@Module({
  components: [PlayerComponent]
})
@singleton()
export class ClientModule {}
