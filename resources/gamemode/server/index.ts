import '@abraham/reflection';
import './bootstrap';
import { container } from 'tsyringe';
import { LoaderService, UtilsService } from '@abstractflo/atlas-shared';
import { ServerModule } from './server.module';
import { PlayerBootstrap } from './bootstrap/player.bootstrap';


const loader = container.resolve(LoaderService);

loader
    .bootstrap(ServerModule)
    .afterComplete(() => {
      const playerBootstrap = container.resolve(PlayerBootstrap);
      playerBootstrap.removePlayerKickHandler();
      UtilsService.log('~lg~Booting complete => ~w~Player can now join and have some fun');
    });

/**
 * Global Error Handler
 */
process.on('uncaughtException', (err) => {
  UtilsService.logError(err.stack);
  UtilsService.logError(err.message);
  UtilsService.logError(err.name);
  UtilsService.log('~r~Please close the server and fix the problem~w~');
});
