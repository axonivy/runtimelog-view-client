import type { RuntimeLogEntry } from './data/log';

export interface LogRequestTypes {
  data: [RuntimeLogEntry[], RuntimeLogEntry[]];
  clear: [];
}
