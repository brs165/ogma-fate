import CardNode   from './nodes/CardNode.svelte';
import StickyNode from './nodes/StickyNode.svelte';
import LabelNode  from './nodes/LabelNode.svelte';
import BoostNode  from './nodes/BoostNode.svelte';

const CARD_GENIDS = [
  'npc_minor','npc_major','scene','encounter','seed',
  'compel','challenge','contest','consequence','faction',
  'complication','backstory','campaign','obstacle',
  'countdown','constraint','custom','pc',
];

export const nodeTypes = {
  sticky: StickyNode,
  label:  LabelNode,
  boost:  BoostNode,
  ...Object.fromEntries(CARD_GENIDS.map(id => [id, CardNode])),
};
