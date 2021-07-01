import { Cmd, Component, LoggerService } from '@abstractflo/atlas-shared';
import { EventService } from '@abstractflo/atlas-client';
import { ScriptEvent } from '@resources/shared/constants';

@Component()
export class PlayerComponent {
  constructor(private readonly eventService: EventService, private readonly loggerService: LoggerService) {}

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
