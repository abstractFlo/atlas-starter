import '@abraham/reflection';
import './bootstrap';
import { container } from 'tsyringe';
import { LoaderService, UtilsService } from '@abstractFlo/shared';
import { ClientModule } from './client.module';
import { EventService } from '@abstractFlo/client';
import { ScriptEvent } from '@resources/shared/constants';

const loader = container.resolve(LoaderService);

UtilsService.eventOn('connectionComplete', () => {
  loader
      .bootstrap(ClientModule)
      .afterComplete(() => {
        UtilsService.log('~lg~Booting complete => ~w~Happy Playing');

        const eventService = container.resolve(EventService);
        eventService.emitServer(ScriptEvent.Player.ConnectionComplete);
      });
});
