import { UtilsService } from '@abstractflo/atlas-shared';
import { RunningTickInterface } from '../interfaces/running-tick.interface';

export class TickManagerService {

  /**
   * Contains all runningTicks
   *
   * @type {Map<string, number>}
   * @private
   */
  protected runningTicks: Map<string, RunningTickInterface> = new Map<string, RunningTickInterface>();

  /**
   * Clear specific tick if it found
   *
   * @param {string} tickName
   */
  public clearRunningTick(tickName: string): void {
    const runningTick = this.runningTicks.get(tickName);

    if (runningTick) {
      this.clearTick(runningTick);
      this.runningTicks.delete(tickName);
    }
  }

  /**
   * Clear all running ticks
   *
   */
  public clearAllRunningTicks(): void {
    const runningTicks = Array.from(this.runningTicks.values());
    runningTicks.forEach((runningTick: RunningTickInterface) => this.clearTick(runningTick));
    this.runningTicks.clear();
  }

  /**
   * Create an everyTick interval with given callback
   * @param {string} tickName
   * @param {Function} callback
   * @return {TickManagerService}
   */
  public createEveryTick(tickName: string, callback: CallableFunction): TickManagerService {
    const identifier = UtilsService.everyTick(() => {
      callback(this);
    });

    this.runningTicks.set(tickName, { type: 'everyTick', identifier });

    return this;
  }

  /**
   * Clear tick based on tick type
   *
   * @param {RunningTickInterface} runningTick
   * @private
   */
  private clearTick(runningTick: RunningTickInterface) {
    switch (runningTick.type) {
      case 'everyTick':
        UtilsService.clearEveryTick(runningTick.identifier);
        break;
      case 'nextTick':
        UtilsService.clearNextTick(runningTick.identifier);
        break;
    }
  }

}
