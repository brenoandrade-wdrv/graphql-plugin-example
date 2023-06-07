import './index.scss';

import { WindPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new WindPlugin();
}
export type { WindPluginSetup, WindPluginStart } from './types';
