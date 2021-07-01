import '@abraham/reflection';
import './bootstrap';
import { container } from 'tsyringe';
import { UtilsService } from '@abstractflo/atlas-shared';
import { ClientModule } from './client.module';
import { EventService, LoaderService } from '@abstractflo/atlas-client';
import { ScriptEvent } from '@resources/shared/constants';

const loader = container.resolve(LoaderService);

UtilsService.eventOn('connectionComplete', () => {
  loader.bootstrap(ClientModule).done(() => {
    UtilsService.log('~lg~Booting complete => ~w~Happy Playing');

    const eventService = container.resolve(EventService);
    eventService.emitServer(ScriptEvent.Player.ConnectionComplete);
  });
});
