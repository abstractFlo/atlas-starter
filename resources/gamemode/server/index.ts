import '@abraham/reflection';
import { container } from 'tsyringe';
import { UtilsService } from '@abstractflo/atlas-shared';
import { ServerModule } from './server.module';
import { LoaderService } from '@abstractflo/atlas-server';
import { defaultErrorHandling } from '@abstractflo/atlas-server/helpers';
import { removePlayerKickHandler } from './bootstrap';

const loader = container.resolve(LoaderService);

loader
    .bootstrap(ServerModule)
    .done(() => {
      removePlayerKickHandler();
      UtilsService.log('~lg~Booting complete => ~w~Player can now join and have some fun');
    });

/**
 * Global Error Handler
 */
defaultErrorHandling();
