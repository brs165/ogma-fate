// data/index.js
// Merges all 8 campaign data files into a single CAMPAIGNS registry.

import { CAMPAIGNS as thelongafter } from './thelongafter.js';
import { CAMPAIGNS as cyberpunk } from './cyberpunk.js';
import { CAMPAIGNS as fantasy } from './fantasy.js';
import { CAMPAIGNS as space } from './space.js';
import { CAMPAIGNS as victorian } from './victorian.js';
import { CAMPAIGNS as postapoc } from './postapoc.js';
import { CAMPAIGNS as western } from './western.js';
import { CAMPAIGNS as dVentiRealm } from './dVentiRealm.js';

export const CAMPAIGNS = {
  ...thelongafter,
  ...cyberpunk,
  ...fantasy,
  ...space,
  ...victorian,
  ...postapoc,
  ...western,
  ...dVentiRealm,
};
