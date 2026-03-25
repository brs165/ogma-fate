// data/shared-lite.js — SPA-05: lightweight landing page globals
// Contains CAMPAIGNS={}, GENERATORS, GENERATOR_GROUPS, ALL_SKILLS only.
// Does NOT include HELP_CONTENT (loaded by campaign pages via full shared.js).
// data/shared.js
// Shared constants: GENERATORS, GENERATOR_GROUPS, HELP_CONTENT, HELP_ENTRIES,
// SKILL_LABEL, ALL_SKILLS.
// Also declares the CAMPAIGNS object that campaign files populate.
// Must be loaded before any data/[campaign].js file.

// Populated by data/[campaign].js files
var CAMPAIGNS = {};

var GENERATORS = [
  {id:"npc_minor",  label:"Minor NPC",       icon:"◈", sub:"1–2 aspects · skills · stress"},
  {id:"npc_major",  label:"Major NPC",        icon:"◆", sub:"5 aspects · skill pyramid · stunts"},
  {id:"scene",      label:"Scene Setup",      icon:"◉", sub:"Situation aspects · zones"},
  {id:"campaign",   label:"Campaign Frame",  icon:"◇", sub:"Current + impending + setting"},
  {id:"encounter",  label:"Encounter",        icon:"⚔", sub:"Opposition · stakes · twist"},
  {id:"seed",       label:"Adventure Seed",   icon:"◎", sub:"3-scene skeleton · opposition · stakes · twist"},
  {id:"compel",     label:"Compel",     icon:"⊗", sub:"Aspect situation · consequence · GM tip"},
  {id:"challenge",  label:"Challenge",        icon:"⬡", sub:"Series of overcome rolls · stakes · success/failure"},
  {id:"contest",    label:"Contest",          icon:"🏁", sub:"Opposed exchanges · victory track · twist on tie"},
  {id:"consequence", label:"Consequence",     icon:"⚡", sub:"Mild · moderate · severe · compel hook"},
  {id:"faction",     label:"Faction",         icon:"⚑", sub:"Name · goal · method · weakness · face"},
  {id:"complication",label:"Complication", icon:"⚠", sub:"New aspect · arrival · environment shift"},
  {id:"backstory",   label:"PC Backstory",    icon:"📖", sub:"Session Zero questions · relationship web · hook"},
  {id:"obstacle",    label:"Obstacle",        icon:"🛡", sub:"Hazard · block · distraction - not an enemy"},
  {id:"countdown",   label:"Countdown",       icon:"⏱", sub:"Track · trigger · outcome - pacing pressure"},
  {id:"constraint",  label:"Constraint",      icon:"🔒", sub:"Limitation or resistance - forces Plan B"},
];

var GENERATOR_GROUPS = [
  {id:"people",    label:"People",    icon:"👤", gens:["npc_minor","npc_major","backstory"]},
  {id:"scene",     label:"Scene",     icon:"🎬", gens:["scene","encounter","complication"]},
  {id:"mechanics", label:"Mechanics", icon:"⚙",  gens:["compel","consequence","challenge","contest","obstacle","countdown","constraint"]},
  {id:"story",     label:"Story",     icon:"🌍", gens:["seed","campaign","faction"]},
];




var ALL_SKILLS = ["Academics","Athletics","Burglary","Contacts","Crafts","Deceive","Drive","Empathy","Fight","Investigate","Lore","Notice","Physique","Provoke","Rapport","Resources","Shoot","Stealth","Will"];
