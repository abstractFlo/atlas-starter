import { Cmd, LoggerService } from '@abstractFlo/shared';
import { EventService } from '@abstractFlo/client';
import { ScriptEvent } from '@resources/shared/constants';
import { singleton } from 'tsyringe';

@singleton()
export class ClientPlayerComponent {

  constructor(
      private readonly eventService: EventService,
      private readonly loggerService: LoggerService
  ) {}

  /**
   * Create new Vehicle
   *
   * @param {string} name
   */
  @Cmd('veh')
  public createVehicle(name: string): void {
    this.eventService.emitServer(ScriptEvent.Command.CreateVehicle, name);
    this.loggerService.info(`Create new Vehicle ${name} if exists`);
  }

}
