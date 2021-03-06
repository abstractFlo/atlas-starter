import { Module } from '@abstractflo/atlas-shared';
import { PlayerComponent } from './components/player.component';

@Module({
  components: [PlayerComponent]
})
export class ClientModule {}
