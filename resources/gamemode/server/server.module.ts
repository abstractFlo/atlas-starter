import { Module } from '@abstractflo/atlas-shared';
import { PlayerComponent } from './components/player.component';
import './extends/player/alt-player.prototype';

@Module({
  components: [PlayerComponent],
})
export class ServerModule {}
