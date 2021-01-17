import { altLibRegister, setupWebviewRegistry } from '@abstractFlo/shared';
import * as alt from 'alt-client';
import { ScriptEvent } from '@resources/shared/constants';

altLibRegister(alt);
setupWebviewRegistry('http://path/to/your/gui', ScriptEvent.Webview.RouteTo);
