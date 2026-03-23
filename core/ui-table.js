// core/ui-table.js — Table (PrepCanvas) components
// Extracted from ui-renderers.js (CQ-01). Load AFTER ui-renderers.js, BEFORE ui.js.
// References globals defined in ui-renderers.js (renderCard, FlipCard, etc.) —
// those are available at runtime because ui-renderers.js loads first.
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════
// PREP CANVAS — infinite canvas for Table Prep, full run.html feature parity
// ═══════════════════════════════════════════════════════════════════════

var TP_LADDER=[{v:8,l:'Legendary'},{v:7,l:'Epic'},{v:6,l:'Fantastic'},{v:5,l:'Superb'},{v:4,l:'Great'},{v:3,l:'Good'},{v:2,l:'Fair'},{v:1,l:'Average'},{v:0,l:'Mediocre'},{v:-1,l:'Poor'},{v:-2,l:'Terrible'}];
function tpLbl(v){var e=TP_LADDER.find(function(x){return x.v===v;});return e?e.l:(v>8?'Legendary+':'Abysmal');}
function tpLcol(v){return v>=3?'var(--c-green)':v>=1?'var(--accent)':v>=0?'var(--c-amber,#f4b942)':'var(--c-red)';}
function tpRollDF(){return Math.floor(Math.random()*3)-1;}
function tpUid(){return 'tp'+Date.now()+Math.random().toString(36).slice(2,6);}

var TP_GEN_MENU=[
  {id:'npc_major',label:'Major NPC',icon:'◆'},{id:'npc_minor',label:'Minor NPC',icon:'◈'},
  {id:'scene',label:'Scene',icon:'◉'},{id:'faction',label:'Faction',icon:'⚑'},
  {id:'seed',label:'Seed',icon:'✦'},{id:'compel',label:'Compel',icon:'⊗'},
  {id:'countdown',label:'Countdown',icon:'⏱'},{id:'encounter',label:'Encounter',icon:'⚔'},
  {id:'complication',label:'Complication',icon:'⚠'},{id:'obstacle',label:'Obstacle',icon:'🏔'},
];
var TP_TYPE_CLS={
  npc_major:'cct-npc',npc_minor:'cct-npc',encounter:'cct-npc',
  scene:'cct-scene',seed:'cct-scene',campaign:'cct-scene',
  faction:'cct-faction',
  compel:'cct-mechanic',challenge:'cct-mechanic',contest:'cct-mechanic',
  consequence:'cct-mechanic',complication:'cct-mechanic',obstacle:'cct-mechanic',
  countdown:'cct-mechanic',constraint:'cct-mechanic',backstory:'cct-gm',
};
var TP_TYPE_LBL={
  npc_major:'MAJOR NPC',npc_minor:'MINOR NPC',encounter:'ENCOUNTER',
  scene:'SCENE',seed:'SEED',campaign:'CAMPAIGN',faction:'FACTION',
  compel:'COMPEL',challenge:'CHALLENGE',contest:'CONTEST',
  consequence:'CONSEQUENCE',complication:'COMPLICATION',obstacle:'OBSTACLE',
  countdown:'COUNTDOWN',constraint:'CONSTRAINT',backstory:'BACKSTORY',
};
function tpTypeMap(genId){return {npc_major:'npc',npc_minor:'npc',scene:'scene',seed:'seed',faction:'faction',compel:'compel',countdown:'countdown',encounter:'npc',complication:'aspect',challenge:'gm',contest:'gm',consequence:'aspect',backstory:'gm',obstacle:'aspect',constraint:'gm'}[genId]||'other';}
// TC-15: Parse exported Ogma NPC/character JSON into a player object
function tpParseOgmaCharacter(jsonStr, playerCount){
  var COLORS=['var(--accent)','var(--c-purple)','var(--c-blue)','var(--c-green)','var(--c-red)'];
  var obj;try{obj=JSON.parse(jsonStr);}catch(e){return null;}
  if(!obj||obj.format!=='ogma')return null;
  var d=null,genId=null;
  if(obj.generator&&obj.data){genId=obj.generator;d=obj.data;}
  else if(Array.isArray(obj.results)){
    var hit=obj.results.find(function(r){return r.generator==='npc_major'||r.generator==='npc_minor';});
    if(hit){genId=hit.generator;d=hit.data;}
  }
  if(!d||!genId)return null;
  var name,aspects,skills,phy,men,stunts=[];
  if(genId==='npc_minor'){
    name=d.name||'Imported';
    aspects=Array.isArray(d.aspects)?d.aspects.map(function(a){return a.name||a;}).filter(Boolean):[];
    skills=(d.skills||[]).map(function(s){return{l:s.name,v:s.r||0,name:s.name,r:s.r||0};});
    phy=Array.from({length:Math.min(d.stress||2,3)},function(){return false;});
    men=[false,false];
  }else{
    name=d.name||'Imported';
    aspects=[d.aspects.high_concept,d.aspects.trouble].concat(d.aspects.others||[]).filter(Boolean);
    skills=(d.skills||[]).map(function(s){return{l:s.name,v:s.r||0,name:s.name,r:s.r||0};});
    phy=Array.from({length:Math.min(d.physical_stress||3,3)},function(){return false;});
    men=Array.from({length:Math.min(d.mental_stress||2,3)},function(){return false;});
    stunts=(d.stunts||[]).map(function(s){return{name:s.name||s,desc:s.desc||s.description||''};});
  }
  return{id:tpUid(),name:name,hc:aspects[0]||'',fp:d.refresh||3,ref:d.refresh||3,
    phy:phy.length?phy:[false,false,false],men:men.length?men:[false,false],
    color:COLORS[(playerCount||0)%COLORS.length],acted:false,conceded:false,
    skills:skills.slice(0,10),conseq:['','',''],treating:[false,false,false],aspects:aspects,stunts:stunts};
}
var TP_COLORS=['var(--accent)','var(--c-purple)','var(--c-blue)','var(--c-green)','var(--c-red)'];

function tpCardFromResult(genId,data){
  var title=data.name||data.location||data.situation||data.title||genId;
  var x=60+(Math.floor(Math.random()*4))*200+Math.random()*40;
  var y=60+(Math.floor(Math.random()*3))*180+Math.random()*40;
  return {id:tpUid(),genId:genId,type:tpTypeMap(genId),title:title,data:data,size:'md',x:x,y:y,phyHit:null,menHit:null,cdFilled:0,ts:Date.now()};
}

// ── TpCardBody ─────────────────────────────────────────────────────────────
function TpCardBody(props){
  var card=props.card,onUpd=props.onUpd,d=card.data||{},genId=card.genId,sz=card.size||'md';
  if(genId==='npc_major'||genId==='npc_minor'||genId==='encounter'){
    var asp=d.aspects||{};
    var hc=asp.high_concept||(Array.isArray(d.aspects)?(d.aspects[0]&&(d.aspects[0].name||d.aspects[0])):'')||card.title;
    var tr=asp.trouble||(Array.isArray(d.aspects)?(d.aspects[1]&&(d.aspects[1].name||d.aspects[1])):'');
    var skills=(d.skills||[]).slice(0,sz==='full'?6:3);
    var phyMax=typeof d.physical_stress==='number'?d.physical_stress:(d.stress||2);
    var menMax=typeof d.mental_stress==='number'?d.mental_stress:0;
    var phyHit=card.phyHit||Array(phyMax).fill(false);
    var menHit=card.menHit||Array(menMax).fill(false);
    return h('div',{className:'cc-body'},
      h('div',{className:'cc-title'},d.name||card.title),
      hc&&hc!==(d.name||card.title)&&h('div',{className:'cc-asp hc'},hc),
      tr&&h('div',{className:'cc-asp tr'},tr),
      skills.length>0&&h('div',{className:'cc-skrow'},skills.map(function(s,i){
  return h('span',{key:i,className:'cc-sk',
    title:'Roll '+s.name+' +'+s.r+(props.onRollSkill?' — click to roll':''),
    style:{cursor:props.onRollSkill?'pointer':'default'},
    onClick:props.onRollSkill?function(e){e.stopPropagation();props.onRollSkill({l:s.name,v:s.r,r:s.r});}:null,
  },h('strong',null,'+'+s.r),' '+s.name);
})),
      (phyHit.length>0||menHit.length>0)&&h('div',{className:'cc-stress'},
        phyHit.length>0&&h('span',null,'PHY'),
        phyHit.map(function(v,i){return h('div',{key:'p'+i,className:'cc-sbox'+(v?' hit':''),
        role:'checkbox','aria-checked':String(!!v),'aria-label':'Physical stress '+(i+1),
        tabIndex:0,
        onClick:function(e){e.stopPropagation();var a=phyHit.slice();a[i]=!a[i];onUpd({phyHit:a});},
        onKeyDown:function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();var a=phyHit.slice();a[i]=!a[i];onUpd({phyHit:a});}}
      });}),
        menHit.length>0&&h('span',{style:{marginLeft:4}},'MEN'),
        menHit.map(function(v,i){return h('div',{key:'m'+i,className:'cc-sbox'+(v?' hit':''),
        style:{borderColor:'var(--c-purple)'},
        role:'checkbox','aria-checked':String(!!v),'aria-label':'Mental stress '+(i+1),
        tabIndex:0,
        onClick:function(e){e.stopPropagation();var a=menHit.slice();a[i]=!a[i];onUpd({menHit:a});},
        onKeyDown:function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();var a=menHit.slice();a[i]=!a[i];onUpd({menHit:a});}}
      });}),
      )
    );
  }
  if(genId==='countdown'){
    var total=d.boxes||4;var filled=card.cdFilled||0;
    return h('div',{className:'cc-body'},
      h('div',{className:'cc-title'},d.name||card.title),
      d.trigger&&h('div',{className:'cc-asp'},d.trigger),
      h('div',{className:'cc-cd-track','role':'group','aria-label':'Countdown track'},Array.from({length:total},function(_,i){
      return h('div',{key:i,className:'cc-cdbox'+(i<filled?' tick':''),
        role:'checkbox','aria-checked':String(i<filled),'aria-label':'Box '+(i+1),
        tabIndex:0,
        onClick:function(e){e.stopPropagation();onUpd({cdFilled:i<filled?i:i+1});},
        onKeyDown:function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();onUpd({cdFilled:i<filled?i:i+1});}}
      },i+1);})),
      filled>=total&&h('div',{className:'cc-trigger'},'\u26A1 TRIGGERED')
    );
  }
  if(genId==='seed'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.hook||d.location||card.title),d.objective&&h('div',{className:'cc-asp hc'},d.objective),d.complication&&h('div',{className:'cc-asp tr'},d.complication),sz==='full'&&d.twist&&h('div',{className:'cc-asp'},'\uD83C\uDF00 '+d.twist));}
  if(genId==='scene'){var aspects=d.aspects||[];return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.location||card.title),(sz==='full'?aspects.slice(0,5):aspects.slice(0,2)).map(function(a,i){var txt=a.name||a;return h('div',{key:i,className:'cc-asp'+(i===0?' hc':'')},txt);}));}
  if(genId==='faction'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.name||card.title),d.goal&&h('div',{className:'cc-asp hc'},d.goal),d.weakness&&h('div',{className:'cc-asp tr'},d.weakness));}
  if(genId==='compel'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.situation||card.title),d.consequence&&h('div',{className:'cc-asp tr'},'If accepted: '+d.consequence));}
  if(genId==='consequence'){return h('div',{className:'cc-body'},d.severity&&h('div',{style:{fontSize:11,fontWeight:800,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--c-amber,#f4b942)',marginBottom:2}},d.severity),h('div',{className:'cc-title'},d.aspect||d.name||card.title),d.context&&h('div',{className:'cc-asp'},d.context));}
  if(genId==='challenge'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.name||card.title),d.desc&&h('div',{className:'cc-asp'},d.desc),(sz==='full'||sz==='md')&&d.primary&&h('div',{className:'cc-asp hc'},'\u2692 '+d.primary),(sz==='full'||sz==='md')&&d.opposing&&h('div',{className:'cc-asp tr'},'\u2605 '+d.opposing));}
  if(genId==='contest'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.contest_type||card.title),d.desc&&h('div',{className:'cc-asp'},d.desc),(sz==='full'||sz==='md')&&d.side_a&&h('div',{className:'cc-asp hc'},d.side_a+' \u2694 '+d.side_b));}
  if(genId==='complication'){return h('div',{className:'cc-body'},d.new_aspect&&h('div',{className:'cc-asp hc',style:{marginTop:0}},d.new_aspect),d.arrival&&h('div',{className:'cc-asp'},'\u2794 '+d.arrival));}
  if(genId==='obstacle'){return h('div',{className:'cc-body'},d.obstacle_type&&h('div',{style:{fontSize:11,fontWeight:800,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:2}},d.obstacle_type),h('div',{className:'cc-title'},d.name||card.title),(sz==='full'||sz==='md')&&d.choice&&h('div',{className:'cc-asp'},'\u2666 '+d.choice));}
  if(genId==='backstory'){var qs=d.questions||[];return h('div',{className:'cc-body'},d.hook&&h('div',{className:'cc-asp hc',style:{marginTop:0}},d.hook),qs.slice(0,sz==='full'?3:2).map(function(q,i){return h('div',{key:i,className:'cc-asp',style:{fontStyle:'normal'}},'\u2014 '+q);}));}
  return h('div',{className:'cc-body'},
    h('div',{className:'cc-title'},card.title||genId),
    card._notes&&h('div',{style:{fontSize:11,color:'var(--text-muted)',fontStyle:'italic',marginTop:3,lineHeight:1.4}},card._notes)
  );
}

// ── TpPlayerRow ─────────────────────────────────────────────────────────────
function TpPlayerRow(props){
  var p=props.player,sel=props.sel,onUpd=props.onUpd,onSel=props.onSel;
  var _exp=useState(false);var expanded=_exp[0];var setExpanded=_exp[1];
  var fpCol=p.fp===0?'var(--c-red)':p.fp<p.ref?'var(--c-amber,#f4b942)'  :'var(--c-green)';
  var conseq=p.conseq||['','',''];
  var aspects=p.aspects||[];
  var trouble=aspects[1]||'';
  var otherAspects=aspects.slice(2);
  var stunts=p.stunts||[];
  function setConseq(i,val){var n=conseq.slice();n[i]=val;onUpd({conseq:n});}
  function setAspect(i,val){
    var next=(p.aspects||[]).slice();
    while(next.length<=i)next.push('');
    next[i]=val;
    // keep hc in sync
    onUpd({aspects:next,hc:next[0]||p.hc});
  }
  function removeStunt(i){
    onUpd({stunts:stunts.filter(function(_,idx){return idx!==i;})});
  }
  return h('div',{className:'rs-player'+(sel?' selected':''),style:{borderLeftColor:p.color||'var(--accent)',borderLeftWidth:3}},

    // ── Top row: dot + name + expand toggle + acted ──
    h('div',{className:'rs-player-top',
      role:'button',tabIndex:0,
      'aria-expanded':String(!!sel),
      'aria-label':(sel?'Collapse ':'Expand ')+p.name,
      onClick:function(){onSel(sel?null:p.id);},
      onKeyDown:function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();onSel(sel?null:p.id);}}
    },
      h('div',{className:'rs-player-dot',style:{background:p.color||'var(--accent)'}}),
      h('div',{className:'rs-player-name'},p.name),
      h('button',{style:{background:'none',border:'none',cursor:'pointer',fontSize:11,
        color:'var(--text-muted)',padding:'0 2px',flexShrink:0},
        onClick:function(e){e.stopPropagation();setExpanded(!expanded);}
      },expanded?'▲':'▼'),
      h('button',{style:{background:'none',border:'none',cursor:'pointer',fontSize:13,
        color:p.acted?'var(--c-green)'  :'var(--border-mid)',padding:'0 2px',flexShrink:0,lineHeight:1},
        onClick:function(e){e.stopPropagation();onUpd({acted:!p.acted});}
      },p.acted?'●':'○')
    ),

    // ── High concept (always visible) ──
    p.hc&&h('div',{className:'rs-player-hc',
      style:{borderLeft:'2px solid var(--accent)',paddingLeft:5,marginBottom:1}},
      p.hc),

    // ── Trouble (always visible when set) ──
    trouble&&h('div',{
      style:{fontSize:11,color:'var(--c-red)',fontStyle:'italic',
        padding:'1px 8px 3px',lineHeight:1.3},
      title:'Trouble aspect'},
      '⚠️ '+trouble),

    // ── FP row ──
    h('div',{className:'rs-fp-row'},
      h('span',{className:'rs-fp-label'},'FP'),
      h('button',{className:'rs-fp-btn',onClick:function(){onUpd({fp:Math.max(0,p.fp-1)});},'aria-label':'Spend FP'},'-'),
      h('span',{className:'rs-fp-num',style:{color:fpCol}},p.fp),
      h('button',{className:'rs-fp-btn',onClick:function(){onUpd({fp:p.fp+1});},'aria-label':'Gain FP'},'+'),
      h('button',{style:{background:'none',border:'none',cursor:'pointer',fontSize:10,color:'var(--text-muted)',padding:'0 2px',flexShrink:0},
        title:'Refresh: '+p.ref+' — click to reset FP to refresh',
        onClick:function(){onUpd({fp:p.ref});},
      },'↺'+p.ref)
    ),

    // ── Stress ──
    h('div',{className:'rs-stress-row'},
      h('span',{className:'rs-fp-label'},'PHY'),
      h('div',{style:{display:'flex',gap:2}},
        p.phy.map(function(v,i){
          return h('div',{key:i,className:'rs-stress-box'+(v?' filled':''),
            onClick:function(){var a=p.phy.slice();a[i]=!a[i];onUpd({phy:a});}});
        })
      ),
      h('span',{className:'rs-fp-label',style:{marginLeft:4}},'MEN'),
      h('div',{style:{display:'flex',gap:2}},
        p.men.map(function(v,i){
          return h('div',{key:i,className:'rs-stress-box'+(v?' filled':''),
            style:{borderColor:'var(--c-purple)'},
            onClick:function(){var a=p.men.slice();a[i]=!a[i];onUpd({men:a});}});
        })
      )
    ),

    // ── Expanded section ──
    expanded&&h('div',{style:{padding:'4px 8px 8px',display:'flex',flexDirection:'column',gap:7}},

      // Consequences
      h('div',null,
        h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',
          color:'var(--text-muted)',marginBottom:3}},'Consequences'),
        ['Mild','Moderate','Severe'].map(function(sev,i){
          return h('div',{key:i,style:{display:'flex',alignItems:'center',gap:3,marginBottom:3}},
            h('span',{style:{fontSize:11,color:'var(--text-muted)',width:52,flexShrink:0}},sev),
            h('input',{type:'text',value:conseq[i]||'',placeholder:'empty',
              onChange:function(e){setConseq(i,e.target.value);},
              style:{flex:1,background:'var(--inset)',
                border:'1px solid '+(conseq[i]?'var(--c-amber,#f4b942)'  :'var(--border)'),
                borderRadius:4,padding:'2px 5px',fontSize:11,
                color:'var(--text)',fontFamily:'var(--font-ui)',outline:'none'}}),
          // TC-17: treating toggle
          conseq[i]&&h('button',{
            style:{background:'none',border:'none',cursor:'pointer',fontSize:11,
              color:(p.treating||[])[i]?'var(--c-green)':'var(--text-muted)',
              padding:'0 2px',flexShrink:0,lineHeight:1},
            title:(p.treating||[])[i]?'Being treated (clear after overcome roll)':'Mark as being treated',
            onClick:function(){
              var tr=(p.treating||[false,false,false]).slice();
              tr[i]=!tr[i];
              onUpd({treating:tr});
            },
          },(p.treating||[])[i]?'✓':'□')
          );
        })
      ),

      // TC-05: Aspects
      h('div',null,
        h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',
          color:'var(--text-muted)',marginBottom:3}},'Aspects'),
        // High concept (editable)
        h('div',{style:{display:'flex',alignItems:'center',gap:3,marginBottom:3}},
          h('span',{style:{fontSize:10,color:'var(--accent)',width:52,flexShrink:0,fontWeight:700}},'HC'),
          h('input',{type:'text',value:aspects[0]||p.hc||'',placeholder:'High concept',
            onChange:function(e){setAspect(0,e.target.value);},
            style:{flex:1,background:'var(--inset)',border:'1px solid '+(aspects[0]||p.hc?'var(--accent)'  :'var(--border)'),
              borderRadius:4,padding:'2px 5px',fontSize:11,color:'var(--text)',
              fontFamily:'var(--font-ui)',outline:'none'}})
        ),
        // Trouble (editable)
        h('div',{style:{display:'flex',alignItems:'center',gap:3,marginBottom:3}},
          h('span',{style:{fontSize:10,color:'var(--c-red)',width:52,flexShrink:0,fontWeight:700}},'Trouble'),
          h('input',{type:'text',value:trouble,placeholder:'Trouble aspect',
            onChange:function(e){setAspect(1,e.target.value);},
            style:{flex:1,background:'var(--inset)',border:'1px solid '+(trouble?'var(--c-red)'  :'var(--border)'),
              borderRadius:4,padding:'2px 5px',fontSize:11,color:'var(--text)',
              fontFamily:'var(--font-ui)',outline:'none'}})
        ),
        // Other aspects
        otherAspects.map(function(a,i){
          return h('div',{key:i,style:{display:'flex',alignItems:'center',gap:3,marginBottom:3}},
            h('span',{style:{fontSize:10,color:'var(--text-muted)',width:52,flexShrink:0}},'Asp '+(i+1)),
            h('input',{type:'text',value:a||'',placeholder:'Aspect',
              onChange:function(e){setAspect(i+2,e.target.value);},
              style:{flex:1,background:'var(--inset)',border:'1px solid '+(a?'var(--border-mid)'  :'var(--border)'),
                borderRadius:4,padding:'2px 5px',fontSize:11,color:'var(--text)',
                fontFamily:'var(--font-ui)',outline:'none'}})
          );
        }),
        // Add aspect button
        h('button',{
          style:{fontSize:10,background:'none',border:'1px dashed var(--border)',
            borderRadius:4,padding:'2px 6px',cursor:'pointer',color:'var(--text-muted)',
            fontFamily:'var(--font-ui)',marginTop:2},
          onClick:function(){setAspect(aspects.length||2,'');}
        },'+ aspect')
      ),

      // TC-05: Stunts
      stunts.length>0&&h('div',null,
        h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',
          color:'var(--text-muted)',marginBottom:3}},'Stunts'),
        stunts.map(function(s,i){
          var name=typeof s==='string'?s:(s.name||s.l||'');
          var desc=typeof s==='string'?'':(s.desc||s.description||'');
          return h('div',{key:i,
            style:{background:'var(--inset)',border:'1px solid var(--border)',
              borderRadius:5,padding:'4px 7px',marginBottom:3,position:'relative'},
          },
            h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between'}},
              h('span',{style:{fontSize:11,fontWeight:700,color:'var(--accent)'}},name),
              h('button',{
                style:{background:'none',border:'none',cursor:'pointer',
                  fontSize:11,color:'var(--text-muted)',padding:'0 2px'},
                onClick:function(e){e.stopPropagation();removeStunt(i);},
                'aria-label':'Remove stunt'},
              '×')
            ),
            desc&&h('div',{style:{fontSize:10,color:'var(--text-muted)',marginTop:1,lineHeight:1.4}},desc)
          );
        })
      ),

      // Add stunt
      h('button',{
        style:{fontSize:10,background:'none',border:'1px dashed var(--border)',
          borderRadius:4,padding:'2px 6px',cursor:'pointer',color:'var(--text-muted)',
          fontFamily:'var(--font-ui)'},
        onClick:function(){
          var n=prompt('Stunt name:');
          if(n&&n.trim()){
            var d=prompt('Stunt description (optional):');
            onUpd({stunts:stunts.concat([{name:n.trim(),desc:d||''  }])});
          }
        }
      },'+ stunt')
    )
  );
}

// ── TpDicePanel — compact horizontal bar layout ────────────────────────────
function TpDicePanel(props){
  var players=props.players,selId=props.selId,spendFP=props.spendFP,onRoll=props.onRoll;
  var _dice=useState([0,0,0,0]);var dice=_dice[0];var setDice=_dice[1];
  var _spin=useState(false);var spinning=_spin[0];var setSpinning=_spin[1];
  var _res=useState(null);var result=_res[0];var setResult=_res[1];
  var _sk=useState(null);var activeSk=_sk[0];var setActiveSk=_sk[1];
  var _boost=useState(false);var boosted=_boost[0];var setBoosted=_boost[1];
  var _hist=useState([]);var history=_hist[0];var setHistory=_hist[1];
  var _diff=useState(0);var diff=_diff[0];var setDiff=_diff[1]; // TC-20: opposition difficulty
  var rollTimerRef=useRef(null); // leak fix: cancel on unmount
  useEffect(function(){return function(){if(rollTimerRef.current)clearTimeout(rollTimerRef.current);};},[]);
  var player=players.find(function(p){return p.id===selId;});
  var mod=activeSk?activeSk.v:0;
  var final=result!=null?result+mod+(boosted?2:0):null;
  var DFMT={'-1':'\u2212',0:'\u25CB',1:'+'};

  function doRoll(sk){
    if(spinning)return;
    setActiveSk(sk);setBoosted(false);setResult(null);setSpinning(true);
    rollTimerRef.current=setTimeout(function(){
      var r=[tpRollDF(),tpRollDF(),tpRollDF(),tpRollDF()];
      var s=r.reduce(function(a,b){return a+b;},0);
      setDice(r);setSpinning(false);setResult(s);
      var total=s+sk.v;
      setHistory(function(h){return [{who:player?player.name:'?',skill:sk.l||sk.name,total:total}].concat(h).slice(0,8);});
      if(onRoll)onRoll({who:player?player.name:'?',skill:sk.l||sk.name,total:total});
    },600);
  }

  // Horizontal strip: [who] [dice] [result] [roll btn] [FP spend] | [skills] | [history]
  return h('div',{style:{display:'flex',alignItems:'center',gap:10,padding:'6px 10px',flexWrap:'nowrap',overflowX:'auto',fontFamily:'var(--font-ui)',minHeight:52}},

    // ── Who is rolling ───────────────────────────────────────────
    h('div',{style:{fontSize:11,fontWeight:700,color:player?player.color||'var(--accent)':'var(--text-muted)',
      whiteSpace:'nowrap',flexShrink:0,minWidth:60,maxWidth:100,overflow:'hidden',textOverflow:'ellipsis'}},
      player?player.name:'no player'),

    // ── 4 Fate dice ──────────────────────────────────────────────
    h('div',{style:{display:'flex',gap:4,flexShrink:0}},
      dice.map(function(v,i){
        var cls='rs-die'+(spinning?' spin':v>0?' pos':v<0?' neg':' zero');
        return h('div',{key:i,className:cls,style:{width:32,height:32,fontSize:16}},
          spinning?'\u25C8':DFMT[v]||'\u25CB');
      })
    ),

    // ── Result block ─────────────────────────────────────────────
    result!=null&&!spinning&&h('div',{style:{display:'flex',alignItems:'baseline',gap:5,flexShrink:0}},
      h('span',{style:{fontSize:22,fontWeight:900,color:tpLcol(final),lineHeight:1}},
        final>=0?'+'+final:String(final)),
      h('span',{style:{fontSize:11,fontWeight:700,color:tpLcol(final)}},tpLbl(final)),
      activeSk&&h('span',{style:{fontSize:11,color:'var(--text-muted)'}},
        '('+activeSk.l+(boosted?'+2)':')'))
    ),
    result==null&&!spinning&&h('span',{style:{fontSize:11,color:'var(--text-muted)',flexShrink:0}},
      player?'roll below':'\u2191 select player'),

    // ── Roll 4dF button ──────────────────────────────────────────
    h('button',{
      className:'btn btn-ghost',
      disabled:spinning,
      onClick:function(){doRoll({l:'4dF',v:0});},
      style:{fontSize:12,flexShrink:0,whiteSpace:'nowrap'},
    },'\uD83C\uDFB2 Roll 4dF'),

    // ── FP spend ─────────────────────────────────────────────────
    result!=null&&!spinning&&h('button',{
      className:'btn btn-ghost'+(boosted?' active':''),
      disabled:!player||player.fp<=0||boosted,
      onClick:function(){if(!player||boosted||result==null)return;if(spendFP)spendFP(selId);setBoosted(true);},
      style:{fontSize:11,flexShrink:0,whiteSpace:'nowrap'},
      title:'Spend 1 FP for +2',
    },boosted?'\u2705 +2 spent':'\u29BF FP +2'),

    // TC-20: Opposition difficulty & outcome
    h('div',{style:{display:'flex',alignItems:'center',gap:4,flexShrink:0}},
      h('span',{style:{fontSize:11,color:'var(--text-muted)',whiteSpace:'nowrap'}},'vs'),
      h('input',{type:'number',min:-4,max:8,value:diff,
        onChange:function(e){setDiff(parseInt(e.target.value)||0);},
        style:{width:40,background:'var(--inset)',border:'1px solid var(--border)',
          borderRadius:5,padding:'2px 5px',fontSize:12,color:'var(--text)',
          fontFamily:'var(--font-ui)',textAlign:'center',outline:'none'},
        title:'Opposition difficulty (Fate Ladder: -4 to +8)',
      }),
      result!=null&&!spinning&&(function(){
        var margin=final-diff;
        var outcome=margin>=3?'Succeed w/ Style':margin>=1?'Success':margin===0?'Tie':'Fail';
        var col=margin>=3?'var(--c-green)':margin>=1?'var(--accent)':margin===0?'var(--c-amber,#f4b942)':'var(--c-red)';
        return h('span',{style:{fontSize:12,fontWeight:800,color:col,whiteSpace:'nowrap'}},outcome+(margin>0?' +'+margin:margin<0?' '+margin:''));
      })()
    ),
    // Separator
    h('div',{style:{width:1,height:28,background:'var(--border)',flexShrink:0}}),

    // ── Skills as pill row ────────────────────────────────────────
    player&&(player.skills||[]).length>0&&h('div',{style:{display:'flex',gap:4,flexWrap:'nowrap',overflowX:'auto',flex:1}},
      player.skills.map(function(sk){
        var isSel=activeSk&&(activeSk.l||activeSk.name)===(sk.l||sk.name);
        var v=sk.v||sk.r||0;
        return h('button',{key:sk.l||sk.name,
          onClick:function(){doRoll(sk);},
          style:{
            background:isSel?'color-mix(in srgb,var(--accent) 12%,transparent)':'var(--inset)',
            border:'1px solid '+(isSel?'var(--accent)':'var(--border)'),
            borderRadius:6,padding:'3px 9px',cursor:'pointer',fontFamily:'var(--font-ui)',
            display:'flex',alignItems:'center',gap:5,whiteSpace:'nowrap',flexShrink:0,
          },
        },
          h('span',{style:{fontSize:11,color:'var(--text)',fontWeight:600}},sk.l||sk.name),
          h('span',{style:{fontSize:12,fontWeight:800,color:tpLcol(v)}},'+'+v),
          h('span',{style:{fontSize:11}},spinning&&isSel?'\uD83C\uDFB2':'')
        );
      })
    ),
    !player&&h('span',{style:{fontSize:11,color:'var(--text-muted)',flex:1}},'Select a player in the roster to roll their skills'),

    // Separator + history (last 3, compact)
    history.length>0&&h('div',{style:{width:1,height:28,background:'var(--border)',flexShrink:0}}),
    history.length>0&&h('div',{style:{display:'flex',gap:5,alignItems:'center',flexShrink:0}},
      history.slice(0,3).map(function(r,i){
        return h('span',{key:i,style:{fontSize:11,color:'var(--text-muted)',whiteSpace:'nowrap'}},
          h('span',{style:{fontWeight:800,color:tpLcol(r.total)}},r.total>=0?'+'+r.total:String(r.total)),
          ' '+r.skill
        );
      })
    )
  );
}


// ── TpTurnBar ─────────────────────────────────────────────────────────────
function TpTurnBar(props){
  var players=props.players,order=props.order,setOrder=props.setOrder,onToggleActed=props.onToggleActed;
  var _drag=useState(null);var dragId=_drag[0];var setDragId=_drag[1];
  var _over=useState(null);var overId=_over[0];var setOverId=_over[1];
  var allActed=players.length>0&&players.every(function(p){return p.acted;});
  var orderedPlayers=order.map(function(id){return players.find(function(p){return p.id===id;});}).filter(Boolean);
  players.forEach(function(p){if(order.indexOf(p.id)<0)orderedPlayers.push(p);});
  return h('div',{className:'rs-turn-bar'},
    h('span',{className:'rs-turn-label'},'Turn Order'),
    orderedPlayers.map(function(p){
      return h('div',{key:p.id,
        className:'rs-turn-pill'+(p.acted?' acted':'')+(dragId===p.id?' dragging':'')+(overId===p.id?' drag-over':''),
        draggable:true,
        onDragStart:function(e){setDragId(p.id);e.dataTransfer.effectAllowed='move';},
        onDragOver:function(e){e.preventDefault();if(p.id!==dragId)setOverId(p.id);},
        onDrop:function(e){e.preventDefault();if(dragId&&dragId!==p.id){setOrder(function(o){var a=o.slice();var fi=a.indexOf(dragId);var ti=a.indexOf(p.id);if(fi<0||ti<0)return o;a.splice(fi,1);a.splice(ti,0,dragId);return a;});}setDragId(null);setOverId(null);},
        onDragEnd:function(){setDragId(null);setOverId(null);},
        onClick:function(){onToggleActed(p.id);},
      },
        h('div',{className:'rs-turn-dot',style:{background:p.color||'var(--accent)',width:6,height:6,borderRadius:'50%',flexShrink:0}}),
        h('span',{style:{fontSize:11,fontWeight:700,color:p.acted?'var(--c-green)':'var(--text)'}},p.name),
        p.acted&&h('span',{style:{fontSize:11,color:'var(--c-green)'}},' \u2713')
      );
    }),
    allActed&&h('div',{style:{fontSize:11,color:'var(--c-green)',fontStyle:'italic',marginLeft:6}},'\u2756 All acted')
  );
}

