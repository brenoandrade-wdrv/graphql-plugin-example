import { PluginInitializerContext } from '../../../src/core/server';
import { WindPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new WindPlugin(initializerContext);
}

export type { WindPluginSetup, WindPluginStart } from './types';
