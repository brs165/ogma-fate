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
  function addStunt(name){
    if(!name||!name.trim())return;
    onUpd({stunts:(stunts).concat([{name:name.trim(),desc:''}])});
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

// ── PrepCanvas ───────────────────────────────────────────────────────────────────────────
var TP_CANVAS_KEY_PREFIX='tp_canvas_';
// Option D: category dropdown component for generate sub-bar
function TpGenDropdown(props){
  var label=props.label,icon=props.icon,items=props.items,onAdd=props.onAdd;
  var _open=React.useState(false);var open=_open[0];var setOpen=_open[1];
  var btnRef=React.useRef(null);var menuRef=React.useRef(null);
  // Close on outside click
  React.useEffect(function(){
    if(!open)return;
    function handler(e){
      if(btnRef.current&&btnRef.current.contains(e.target))return;
      if(menuRef.current&&menuRef.current.contains(e.target))return;
      setOpen(false);
    }
    document.addEventListener("mousedown",handler);
    return function(){document.removeEventListener('mousedown',handler);};
  },[open]);
  // Close on Escape
  function onKeyDown(e){
    if(e.key==='Escape')setOpen(false);
    if(e.key==='ArrowDown'&&!open)setOpen(true);
  }
  return h('div',{className:'tp-dd-wrap'},
    h('button',{
      className:'tp-dd-btn',
      ref:btnRef,
      'aria-haspopup':'menu',
      'aria-expanded':String(open),
      onClick:function(){setOpen(function(v){return !v;});},
      onKeyDown:onKeyDown,
    },
      h('span',null,icon+' '+label),
      h('span',{className:'chevron','aria-hidden':'true'},'▾')
    ),
    h('div',{
      className:'tp-dd-menu',
      ref:menuRef,
      role:'menu',
      hidden:!open,
      'aria-label':label+' generators',
    },
      items.map(function(item,i){
        if(item.sep)return h("div",{key:"sep"+i,className:"tp-dd-sep","aria-hidden":"true"});
        return h('button',{
          key:item.id||i,
          className:'tp-dd-item',
          role:'menuitem',
          onClick:function(){onAdd(item);setOpen(false);},
          onKeyDown:function(e){if(e.key==='Escape'){setOpen(false);btnRef.current&&btnRef.current.focus();}}
        },
          h('span',{'aria-hidden':'true'},item.icon),
          h('span',null,item.label)
        );
      })
    )
  );
}
// ── TpHeroModal: full-screen FlipCard on canvas card tap ─────────────────
function TpHeroModal(props){
  var card=props.card,campId=props.campId,onClose=props.onClose;
  var _in=useState(false);var animIn=_in[0];var setAnimIn=_in[1];
  var overlayRef=useRef(null);
  useEffect(function(){
    var t=requestAnimationFrame(function(){
      requestAnimationFrame(function(){setAnimIn(true);});
    });
    return function(){cancelAnimationFrame(t);};
  },[]);
  useEffect(function(){
    function onKey(e){if(e.key==='Escape')onClose();}
    document.addEventListener('keydown',onKey);
    return function(){document.removeEventListener('keydown',onKey);};
  },[onClose]);
  useEffect(function(){
    if(!animIn)return;
    if(window.ogmaMountDiceRollers){
      var mts=document.querySelectorAll('.tp-hero-dice-mount');
      if(mts.length)window.ogmaMountDiceRollers(mts);
    }
  },[animIn]);
  var skillLabel='Roll 4dF';
  var skillVal=0;
  if(card.data&&card.data.skills&&card.data.skills.length){
    skillLabel=(card.data.name||card.title)+' — '+(card.data.skills[0].name||'Roll');
    skillVal=card.data.skills[0].r||0;
  }
  return h('div',{
    ref:overlayRef,
    className:'tp-hero-overlay'+(animIn?' in':''),
    onClick:function(e){if(e.target===overlayRef.current)onClose();},
    role:'dialog','aria-modal':'true','aria-label':card.title||'Card',
  },
    h('div',{className:'tp-hero-shell'+(animIn?' in':'')},
      h('button',{className:'tp-hero-close',onClick:onClose,'aria-label':'Close'},'×'),
      h('div',{className:'tp-hero-card-wrap'},
        renderCard(card.genId, card.data||{}, campId||'', function(){}, [], null)
      ),
      h('div',{
        className:'tp-hero-dice-mount',
        'data-mode':'skill',
        'data-skill':String(skillVal),
        'data-label':skillLabel,
      })
    )
  );
}


// ── TpGeneratePopover ─────────────────────────────────────────────────────
// Replaces the sub-bar drawer for generation. The "Generate" toolbar button
// opens a floating popover anchored below it, containing the same
// TpGenDropdown groups. No sub-bar needed.
// Uses position:fixed + getBoundingClientRect so it escapes overflow:auto toolbar.
function TpGeneratePopover(props) {
  var campId=props.campId,partySize=props.partySize;
  var onAdd=props.onAdd,onAddZone=props.onAddZone,onAddAspect=props.onAddAspect;
  var _open=useState(false);var open=_open[0];var setOpen=_open[1];
  var _pos=useState({top:0,left:0});var pos=_pos[0];var setPos=_pos[1];
  var btnRef=React.useRef(null);var popRef=React.useRef(null);

  React.useEffect(function(){
    if(!open)return;
    function handler(e){
      if(btnRef.current&&btnRef.current.contains(e.target))return;
      if(popRef.current&&popRef.current.contains(e.target))return;
      setOpen(false);
    }
    document.addEventListener('mousedown',handler);
    return function(){document.removeEventListener('mousedown',handler);};
  },[open]);

  React.useEffect(function(){
    function onKey(e){if(e.key==='Escape')setOpen(false);}
    document.addEventListener('keydown',onKey);
    return function(){document.removeEventListener('keydown',onKey);};
  },[]);

  function handleOpen(){
    if(btnRef.current){
      var r=btnRef.current.getBoundingClientRect();
      setPos({top:r.bottom+4,left:r.left});
    }
    setOpen(function(v){return !v;});
  }

  return h('div',{style:{position:'relative',display:'inline-block'}},
    h('button',{
      ref:btnRef,
      className:'btn btn-ghost'+(open?' active':''),
      onClick:handleOpen,
      style:{fontSize:12},
      'aria-haspopup':'true',
      'aria-expanded':String(open),
      title:'Generate and add to canvas',
    },'\u2795 Generate'),
    open&&h('div',{
      ref:popRef,
      className:'tp-gen-popover',
      role:'dialog',
      'aria-label':'Generate and add to canvas',
      style:{position:'fixed',top:pos.top+'px',left:pos.left+'px',zIndex:600},
    },
      h('div',{className:'tp-gen-popover-title'},'➕ Generate & Add to Canvas'),
      h('div',{className:'tp-gen-bar',role:'toolbar','aria-label':'Generate and add to canvas'},
        h(TpGenDropdown,{
          label:'Characters',icon:'◆',
          items:[
            {id:'npc_major',label:'Major NPC',icon:'◆'},
            {id:'npc_minor',label:'Minor NPC',icon:'◈'},
            {sep:true},
            {id:'faction',label:'Faction',icon:'⚑'},
            {id:'encounter',label:'Encounter',icon:'⚔'},
          ],
          onAdd:function(item){onAdd(item.id);setOpen(false);}
        }),
        h(TpGenDropdown,{
          label:'Scene',icon:'◉',
          items:[
            {id:'scene',label:'Scene',icon:'◉'},
            {id:'seed',label:'Seed',icon:'✦'},
            {sep:true},
            {id:'zone',label:'Zone',icon:'□'},
            {id:'aspect',label:'Aspect',icon:'◈'},
          ],
          onAdd:function(item){
            if(item.id==='zone'){
              var n=prompt('Zone name:');if(!n||!n.trim())return;
              var a=prompt('Zone aspect (optional):');
              var m=prompt('Movement cost (optional):');
              onAddZone(n.trim(),a||'',m||'');
            }else if(item.id==='aspect'){
              var na=prompt('Aspect name:');
              if(na&&na.trim())onAddAspect(na.trim());
            }else{onAdd(item.id);}
            setOpen(false);
          }
        }),
        h(TpGenDropdown,{
          label:'Mechanics',icon:'⚙',
          items:[
            {id:'challenge',label:'Challenge',icon:'🎯'},
            {id:'contest',label:'Contest',icon:'🏆'},
            {id:'compel',label:'Compel',icon:'↩'},
            {sep:true},
            {id:'countdown',label:'Countdown',icon:'⏳'},
            {id:'constraint',label:'Constraint',icon:'🔒'},
            {id:'consequence',label:'Consequence',icon:'💔'},
          ],
          onAdd:function(item){onAdd(item.id);setOpen(false);}
        }),
        h(TpGenDropdown,{
          label:'GM Note',icon:'🔒',
          items:[
            {id:'gm_note',label:'Blank GM note',icon:'📝'},
          ],
          onAdd:function(item){
            var t=prompt('GM note title (optional):');
            onAdd('gm_note',t||'');
            setOpen(false);
          }
        })
      )
    )
  );
}

// ── TpExportModal ─────────────────────────────────────────────────────────
// Checkbox list of all canvas cards + players. Downloads selected as JSON.
function TpExportModal(props){
  var cards=props.cards,players=props.players,campName=props.campName,onClose=props.onClose;
  var _sel=useState(function(){
    var s={};
    cards.forEach(function(c){s['card_'+c.id]=true;});
    return s;
  });
  var sel=_sel[0];var setSel=_sel[1];
  var _incPlayers=useState(true);var incPlayers=_incPlayers[0];var setIncPlayers=_incPlayers[1];

  function toggle(key){setSel(function(s){var n=Object.assign({},s);n[key]=!n[key];return n;});}
  function toggleAll(v){setSel(function(){var n={};cards.forEach(function(c){n['card_'+c.id]=v;});return n;});}

  function doExport(){
    var out={
      format:'ogma-table-export',
      version:'1',
      campaign:campName||'',
      ts:Date.now(),
      players:incPlayers?players:[],
      cards:cards.filter(function(c){return sel['card_'+c.id];}).map(function(c){
        return {id:c.id,genId:c.genId,title:c.title,data:c.data||{}};
      }),
    };
    var blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;
    a.download=(campName||'session').replace(/\s+/g,'-').toLowerCase()+'-export.json';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(url);},30000);
    onClose();
  }

  var selectedCount=Object.values(sel).filter(Boolean).length;

  return h('div',{
    className:'tp-export-overlay',
    onClick:function(e){if(e.target===e.currentTarget)onClose();},
    role:'dialog','aria-modal':'true','aria-label':'Export cards',
  },
    h('div',{className:'tp-export-modal'},
      h('div',{className:'tp-export-header'},
        h('div',{style:{fontWeight:700,fontSize:14}},'💾 Export Cards as JSON'),
        h('button',{className:'rs-drawer-close',onClick:onClose,'aria-label':'Close'},'×')
      ),
      h('div',{className:'tp-export-body'},
        h('div',{className:'tp-export-section-label'},'Players'),
        h('label',{className:'tp-export-row'},
          h('input',{type:'checkbox',checked:incPlayers,onChange:function(){setIncPlayers(function(v){return !v;});}}),
          h('span',null,'Include '+players.length+' player'+(players.length!==1?'s':''))
        ),
        h('div',{className:'tp-export-section-label',style:{marginTop:12}},
          'Cards ',
          h('span',{style:{fontWeight:400,color:'var(--text-muted)',fontSize:11}},'('+selectedCount+'/'+cards.length+' selected)'),
          h('span',{style:{marginLeft:8}},
            h('button',{className:'tp-export-selectall',onClick:function(){toggleAll(true);}},'All'),
            h('button',{className:'tp-export-selectall',onClick:function(){toggleAll(false);}},'None')
          )
        ),
        h('div',{className:'tp-export-card-list'},
          cards.length===0
            ? h('div',{style:{color:'var(--text-muted)',fontSize:12,padding:'8px 0'}},'No cards on canvas')
            : cards.map(function(c){
                return h('label',{key:c.id,className:'tp-export-row'},
                  h('input',{type:'checkbox',checked:!!sel['card_'+c.id],
                    onChange:function(){toggle('card_'+c.id);}}),
                  h('span',{style:{flex:1,minWidth:0}},
                    h('span',{style:{fontSize:11,color:'var(--accent)',marginRight:4}},
                      TP_TYPE_CLS[c.genId]?'●':'○'),
                    c.title||c.genId
                  ),
                  h('span',{style:{fontSize:10,color:'var(--text-muted)',flexShrink:0}},
                    TP_TYPE_LBL[c.genId]||c.genId)
                );
              })
        )
      ),
      h('div',{className:'tp-export-footer'},
        h('button',{
          className:'btn',
          onClick:doExport,
          disabled:selectedCount===0&&!incPlayers,
          style:{background:'var(--accent)',color:'#000',border:'none',fontWeight:700,fontSize:13,padding:'8px 20px'},
        },'💾 Download JSON'),
        h('button',{
          className:'btn btn-ghost',
          onClick:onClose,
          style:{fontSize:13},
        },'Cancel')
      )
    )
  );
}

function PrepCanvas(props){
  var campId=props.campId,campName=props.campName;
  var partySize=props.partySize||4;
  var pinnedCards=props.pinnedCards,setPinnedCards=props.setPinnedCards;
  var onBack=props.onBack,onExport=props.onExport,showToast=props.showToast,DB=props.DB;
  var onShowMilestones=props.onShowMilestones;
  // Sync props
  var tableSync=props.tableSync;
  var onRemoteCursor=props.onRemoteCursor; // MP-22: called when a remote cursor arrives
  var onRemoteState=props.onRemoteState;   // MP-07 fix: called when GM broadcasts full state
  var tableRoomCode=props.tableRoomCode;
  var tableIsRemote=props.tableIsRemote;
  var tablePresence=props.tablePresence||[];
  var onHostTable=props.onHostTable;
  var onJoinTable=props.onJoinTable;
  var onDisconnectTable=props.onDisconnectTable;
  var _loaded=useState(false);var loaded=_loaded[0];var setLoaded=_loaded[1];
  var _scale=useState(1);var scale=_scale[0];var setScale=_scale[1];
  var _ox=useState(40);var ox=_ox[0];var setOx=_ox[1];
  var _oy=useState(40);var oy=_oy[0];var setOy=_oy[1];
  var _players=useState([]);var players=_players[0];var setPlayers=_players[1];
  var _order=useState([]);var order=_order[0];var setOrder=_order[1];
  var _selPlayer=useState(null);var selPlayer=_selPlayer[0];var setSelPlayer=_selPlayer[1];
  var _round=useState(1);var round=_round[0];var setRound=_round[1];
  var _scene=useState(1);var scene=_scene[0];var setScene=_scene[1];
  var _gmFP=useState(0);var gmFP=_gmFP[0];var setGmFP=_gmFP[1];
  var _editMode=useState(true);var editMode=_editMode[0];var setEditMode=_editMode[1];
  var _drawerOpen=useState(false);var drawerOpen=_drawerOpen[0];var setDrawerOpen=_drawerOpen[1];
  var _drawerTab=useState('gen');var drawerTab=_drawerTab[0];var setDrawerTab=_drawerTab[1];
  var _showDiceFloat=useState(false);var showDiceFloat=_showDiceFloat[0];var setShowDiceFloat=_showDiceFloat[1]; // floating dice panel
  var _showExportModal=useState(false);var showExportModal=_showExportModal[0];var setShowExportModal=_showExportModal[1]; // JSON export modal
  var _editingCard=useState(null);var editingCard=_editingCard[0];var setEditingCard=_editingCard[1];
  var _heroCard=useState(null);var heroCard=_heroCard[0];var setHeroCard=_heroCard[1];
  var newCardRef=useRef(null); // ID of most recently added card for entrance anim
  var _extras=useState(function(){
    var ex={};var COL_W=240,COL_H=260,COLS=4,PAD=20;
    pinnedCards.forEach(function(card,i){
      var col=i%COLS,row=Math.floor(i/COLS);
      ex[card.id]={x:PAD+col*(COL_W+PAD),y:PAD+row*(COL_H+PAD),size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:false,title:null,notes:'',zoneId:null};
    });
    return ex;
  });
  var extras=_extras[0];var setExtras=_extras[1];
  var canvasRef=useRef(null);
  var dragState=useRef(null);
  var _rc=useState({});var remoteCursors=_rc[0];var setRemoteCursors=_rc[1]; // MP-22
  var cursorThrottleRef=useRef(null); // MP-22: throttle cursor broadcasts
  // MP-22: register cursor handler with parent on mount
  useEffect(function(){
    if(!onRemoteCursor)return;
    // onRemoteCursor is a registrar — pass it our setter so the parent can call us
    onRemoteCursor(function(data){
      setRemoteCursors(function(prev){
        var next=Object.assign({},prev);
        next[data.id]={x:data.x,y:data.y,name:data.name,color:data.color,ts:Date.now()};
        return next;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  // MP-07 fix: register remote state handler — applies full GM canvas state to player view
  useEffect(function(){
    if(!onRemoteState)return;
    onRemoteState(function(data){
      if(!data||typeof data!=='object')return;
      if(Array.isArray(data.cards)){
        // Merge into pinnedCards — don't overwrite local IDB, just update view
        setPinnedCards(data.cards);
      }
      if(Array.isArray(data.players))setPlayers(data.players);
      if(Array.isArray(data.order))setOrder(data.order);
      if(typeof data.round==='number')setRound(data.round);
      if(typeof data.scene==='number')setScene(data.scene);
      if(typeof data.gmFP==='number')setGmFP(data.gmFP);
      if(data.extras&&typeof data.extras==='object')setExtras(data.extras);
      if(typeof data.scale==='number')setScale(data.scale);
      if(typeof data.ox==='number')setOx(data.ox);
      if(typeof data.oy==='number')setOy(data.oy);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  var saveTimer=useRef(null);
  useEffect(function(){return function(){if(saveTimer.current)clearTimeout(saveTimer.current);};},[]);
  var lastRemovedRef=useRef(null); // TC-18: undo
  var SAVE_KEY=TP_CANVAS_KEY_PREFIX+(campId||'default');

  // TC-01: Persist canvas state to IDB
  function persistCanvas(){
    if(!loaded)return;
    if(saveTimer.current)clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(function(){
      var s={scale:scale,ox:ox,oy:oy,players:players,order:order,round:round,scene:scene,gmFP:gmFP,editMode:editMode,extras:extras,ts:Date.now()};
      if(DB)DB.saveSession(SAVE_KEY,s).catch(function(err){console.warn('[Ogma] table canvas save failed:',err);});
      // Broadcast to remote players if hosting
      if(tableSync&&tableSync.role==='gm'&&tableSync.connected){
        var broadcast=Object.assign({},s);
        broadcast.cards=(pinnedCards||[]).filter(function(c){var ex=extras[c.id]||{};return !ex.gmOnly;});
        // Strip gmOnly card extras so positions/notes don't leak to players
        var visibleIds={}; broadcast.cards.forEach(function(c){visibleIds[c.id]=true;});
        broadcast.extras=Object.keys(extras).reduce(function(acc,id){
          if(visibleIds[id])acc[id]=extras[id]; return acc;
        },{});
        tableSync.broadcastState(broadcast);
      }
    },400);
  }
  useEffect(function(){
    if(!DB){setLoaded(true);return;}
    DB.loadSession(SAVE_KEY).then(function(saved){
      if(saved){
        if(typeof saved.scale==='number')setScale(saved.scale);
        if(typeof saved.ox==='number')setOx(saved.ox);
        if(typeof saved.oy==='number')setOy(saved.oy);
        if(Array.isArray(saved.players))setPlayers(saved.players);
        if(Array.isArray(saved.order))setOrder(saved.order);
        if(typeof saved.round==='number')setRound(saved.round);
        if(typeof saved.scene==='number')setScene(saved.scene);
        if(typeof saved.gmFP==='number')setGmFP(saved.gmFP);
        if(typeof saved.editMode==='boolean')setEditMode(saved.editMode);
        if(saved.extras&&typeof saved.extras==='object'){
          setExtras(function(prev){return Object.assign({},saved.extras,Object.keys(prev).reduce(function(acc,id){if(!saved.extras[id])acc[id]=prev[id];return acc;},{}));});
        }
      }
      setLoaded(true);
    }).catch(function(){setLoaded(true);});
  },[]);
  function updExtra(id,patch){setExtras(function(prev){var next=Object.assign({},prev);next[id]=Object.assign({},prev[id]||{},patch);return next;});}
  function updPlayer(id,patch){setPlayers(function(ps){return ps.map(function(p){return p.id===id?Object.assign({},p,patch):p;});});}
  useEffect(function(){
    if(!loaded)return;
    setExtras(function(prev){
      var next=Object.assign({},prev);
      var idx=Object.keys(next).length;
      var COL_W=240,COL_H=260,COLS=4,PAD=20;
      pinnedCards.forEach(function(card){
        if(!next[card.id]){
          var col=idx%COLS,row=Math.floor(idx/COLS);
          next[card.id]={x:PAD+col*(COL_W+PAD),y:PAD+row*(COL_H+PAD),size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:false,title:null,notes:'',zoneId:null};
          idx++;
        }
      });
      return next;
    });
  },[pinnedCards.length,loaded]);
  useEffect(function(){if(loaded)persistCanvas();},[scale,ox,oy,round,scene,gmFP,editMode,loaded]);
  useEffect(function(){if(loaded)persistCanvas();},[players,order]);
  useEffect(function(){if(loaded)persistCanvas();},[extras]);
  useEffect(function(){
    function onKey(e){
      if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
      if((e.key==='z'||e.key==='Z')&&(e.ctrlKey||e.metaKey)){e.preventDefault();undoRemove();}
    }
    window.addEventListener('keydown',onKey);
    return function(){window.removeEventListener('keydown',onKey);};
  },[pinnedCards,extras]);
  function removeCard(id){
    var card=pinnedCards.find(function(c){return c.id===id;});
    var ex=extras[id];
    lastRemovedRef.current={card:card,ex:ex};
    setPinnedCards(function(cs){var next=cs.filter(function(c){return c.id!==id;});if(DB)DB.deleteCard(campId,id).catch(function(err){console.warn('[Ogma] card delete failed:',err);});return next;});
    setExtras(function(prev){var next=Object.assign({},prev);delete next[id];return next;});
    if(showToast)showToast('Card removed — Ctrl+Z to undo');
  }
  function undoRemove(){
    var last=lastRemovedRef.current;
    if(!last||!last.card)return;
    var card=last.card;
    if(DB)DB.saveCard(campId,card).catch(function(err){console.warn('[Ogma] undo-restore save failed:',err);});
    setPinnedCards(function(cs){return cs.concat([card]);});
    if(last.ex)setExtras(function(prev){var next=Object.assign({},prev);next[card.id]=last.ex;return next;});
    lastRemovedRef.current=null;
    if(showToast)showToast('Card restored');
  }
  function spendFP(playerId){updPlayer(playerId,{fp:Math.max(0,(players.find(function(p){return p.id===playerId;})||{fp:0}).fp-1)});}
  function addGeneratedCard(genId){
    newCardRef.current='pending';
    var camp=typeof CAMPAIGNS!=='undefined'&&CAMPAIGNS[campId];
    if(!camp){if(showToast)showToast('No campaign loaded');return;}
    var eff=filteredTables(mergeUniversal(camp.tables),{});
    var data;try{data=generate(genId,eff,4);}catch(e){if(showToast)showToast('Generate failed');return;}
    if(!data)return;
    var card=tpCardFromResult(genId,data);
    var pinnedCard={id:card.id,genId:card.genId,title:card.title,data:card.data,ts:card.ts||Date.now()};
    if(DB)DB.saveCard(campId,pinnedCard).catch(function(err){console.warn('[Ogma] card save failed:',err);});
    setPinnedCards(function(cs){return cs.concat([pinnedCard]);});
    setExtras(function(prev){var next=Object.assign({},prev);next[card.id]={x:card.x,y:card.y,size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:false,title:null,notes:'',zoneId:null};return next;});
    if(showToast)showToast('\u2795\u00A0'+(TP_TYPE_LBL[genId]||genId)+' added');
  }
  // TC-03: Add situation aspect card mid-scene
  function addAspectCard(name){
    if(!name||!name.trim())return;
    var id=tpUid();
    var pinnedCard={id:id,genId:'aspect',title:name.trim(),data:{aspects:[{name:name.trim()}]},ts:Date.now()};
    if(DB)DB.saveCard(campId,pinnedCard).catch(function(err){console.warn('[Ogma] card save failed:',err);});
    setPinnedCards(function(cs){return cs.concat([pinnedCard]);});
    var idx=Object.keys(extras).length,PAD=20,COL_W=220;
    setExtras(function(prev){var next=Object.assign({},prev);next[id]={x:PAD+(idx%4)*(COL_W+PAD),y:PAD+Math.floor(idx/4)*160,size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:true,title:name.trim(),notes:''};return next;});
    if(showToast)showToast('Aspect added with free invoke');
  }
  // TC-09: Add GM note card
  function addGMNote(){
    var id=tpUid();
    var pinnedCard={id:id,genId:'gm',title:'GM Note',data:{},ts:Date.now()};
    if(DB)DB.saveCard(campId,pinnedCard).catch(function(err){console.warn('[Ogma] card save failed:',err);});
    setPinnedCards(function(cs){return cs.concat([pinnedCard]);});
    setExtras(function(prev){var next=Object.assign({},prev);next[id]={x:40+Math.random()*200,y:40+Math.random()*200,size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:true,freeInvoke:false,title:'GM Note',notes:'',zoneId:null};return next;});
    setEditingCard(id);
  }
  // TC-07: Add zone card
  function addZone(name,aspect,movement){
    if(!name||!name.trim())return;
    var id=tpUid();
    var notes=(aspect||'')+(movement?'\nMovement: '+movement:'');
    var pinnedCard={id:id,genId:'zone',title:name.trim(),data:{name:name,aspect:aspect,movement:movement},ts:Date.now()};
    if(DB)DB.saveCard(campId,pinnedCard).catch(function(err){console.warn('[Ogma] card save failed:',err);});
    setPinnedCards(function(cs){return cs.concat([pinnedCard]);});
    setExtras(function(prev){var next=Object.assign({},prev);next[id]={x:60+Math.random()*300,y:60+Math.random()*200,size:'full',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:false,title:name.trim(),notes:notes,zoneId:null};return next;});
    if(showToast)showToast('Zone added');
  }
  // TC-07: Assign card to zone
  function assignToZone(cardId,zoneId){
    updExtra(cardId,{zoneId:zoneId});
    if(showToast)showToast(zoneId?'Card added to zone':'Card removed from zone');
  }
  // TC-10: Clear canvas
  function clearCanvas(){
    if(!confirm('Clear all canvas cards and players?'))return;
    setPinnedCards(function(cs){cs.forEach(function(c){if(DB)DB.deleteCard(campId,c.id).catch(function(err){console.warn('[Ogma] clear delete failed:',err);});});return [];});
    setExtras({});setPlayers([]);setOrder([]);setRound(1);setScene(1);setGmFP(0);
    if(DB)DB.saveSession(SAVE_KEY,{}).catch(function(err){console.warn('[Ogma] clear canvas save failed:',err);});
    if(showToast)showToast('Canvas cleared');
  }
  function newRound(){
    setRound(function(r){return r+1;});
    setPlayers(function(ps){return ps.map(function(p){return Object.assign({},p,{acted:false});});});
    if(showToast)showToast('New round');
  }
  // TC-14: New scene — clears stress for all players
  // TC-22: Full export including player state, round, scene
  function exportFull(){
    var lines=[];
    lines.push('# '+(campName||'Session')+' \u2014 Table Export');
    lines.push('_Scene '+scene+' \u00B7 Round '+round+' \u00B7 '+pinnedCards.length+' cards_\n');
    if(players.length>0){
      lines.push('## Players\n');
      players.forEach(function(p){
        lines.push('### '+p.name+(p.conceded?' (conceded)':''));
        lines.push('FP: '+p.fp+'/'+p.ref+' \u00B7 PHY: '+p.phy.map(function(v){return v?'[x]':'[ ]';}).join(' ')+' \u00B7 MEN: '+p.men.map(function(v){return v?'[x]':'[ ]';}).join(' '));
        if(p.hc)lines.push('HC: '+p.hc);
        var tr=p.aspects&&p.aspects[1]?'Trouble: '+p.aspects[1]:''; if(tr)lines.push(tr);
        var cons=p.conseq&&p.conseq.filter(Boolean);if(cons&&cons.length)lines.push('Consequences: '+cons.join(', '));
        if(p.stunts&&p.stunts.length)lines.push('Stunts: '+p.stunts.map(function(s){return s.name||(s.l||s);}).join(', '));
        lines.push('');
      });
    }
    lines.push('## Cards\n');
    pinnedCards.forEach(function(card,i){
      var ex=extras[card.id]||{};
      var title=ex.title||card.title;
      var typeLabel=TP_TYPE_LBL[card.genId]||card.genId||'Card';
      lines.push('### '+(i+1)+'. '+title+(ex.gmOnly?' (GM only)':'')+(ex.freeInvoke?' \u2605FI':''));
      lines.push('_'+typeLabel+'_');
      if(ex.notes)lines.push('\n'+ex.notes);
      lines.push('');
    });
    var blob=new Blob([lines.join('\n')],{type:'text/markdown'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download=(campName||'session').replace(/\s+/g,'-').toLowerCase()+'-table.md';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(url);},30000);
    if(showToast)showToast('Session exported');
  }
  function newScene(){
    setScene(function(s){return s+1;});setRound(1);
    setPlayers(function(ps){return ps.map(function(p){return Object.assign({},p,{acted:false,phy:p.phy.map(function(){return false;}),men:p.men.map(function(){return false;})});});});
    if(showToast)showToast('New scene — stress cleared');
  }

  // ── Canvas interaction ────────────────────────────────────────────
  function onCanvasMouseDown(e){
    if(e.target!==canvasRef.current&&!e.target.classList.contains('tp-canvas-inner'))return;
    dragState.current={type:'pan',startX:e.clientX,startY:e.clientY,origOx:ox,origOy:oy};
    canvasRef.current&&canvasRef.current.classList.add('panning');
  }
  function onCardDragStart(e,cardId){
    if(!editMode)return;
    e.stopPropagation();e.preventDefault();
    var ex=extras[cardId]||{x:0,y:0};
    dragState.current={type:'card',cardId:cardId,startX:e.clientX,startY:e.clientY,origX:ex.x,origY:ex.y};
    updExtra(cardId,{_dragging:true});
  }
  function onMouseMove(e){
    // MP-22: broadcast cursor position (throttled 80ms) — GM and player
    if(tableSync&&tableSync.connected&&canvasRef.current){
      if(!cursorThrottleRef.current){
        cursorThrottleRef.current=setTimeout(function(){cursorThrottleRef.current=null;},80);
        var cRect=canvasRef.current.getBoundingClientRect();
        var cx=Math.round((e.clientX-cRect.left-ox)/scale);
        var cy=Math.round((e.clientY-cRect.top-oy)/scale);
        if(tableSync.role==='gm'){
          tableSync.ws.send(JSON.stringify({type:'cursor',x:cx,y:cy,
            id:'gm',name:'GM',color:'var(--accent)'}));
        } else if(tableSync.sendCursor){
          var pcp=players.find(function(p){return p.id===selPlayer;});
          if(pcp)tableSync.sendCursor(cx,cy,pcp.name,pcp.color||'var(--c-blue)',pcp.id);
        }
      }
    }
    var ds=dragState.current;if(!ds)return;
    if(ds.type==='pan'){setOx(ds.origOx+(e.clientX-ds.startX));setOy(ds.origOy+(e.clientY-ds.startY));}
    else if(ds.type==='card'){updExtra(ds.cardId,{x:ds.origX+(e.clientX-ds.startX)/scale,y:ds.origY+(e.clientY-ds.startY)/scale,_dragging:true});}
  }
  function onMouseUp(){
    var ds=dragState.current;
    if(ds&&ds.type==='card')updExtra(ds.cardId,{_dragging:false});
    dragState.current=null;
    canvasRef.current&&canvasRef.current.classList.remove('panning');
  }
  function onWheel(e){
    e.preventDefault();
    var rect=canvasRef.current.getBoundingClientRect();
    var mx=e.clientX-rect.left,my=e.clientY-rect.top;
    var delta=e.deltaY<0?1.08:0.93;
    var ns=Math.min(Math.max(scale*delta,0.2),3);
    setScale(ns);setOx(mx-(mx-ox)*(ns/scale));setOy(my-(my-oy)*(ns/scale));
  }
  function fitAll(){
    var CARD_W=240,CARD_H=220;
    var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    pinnedCards.forEach(function(card){var ex=extras[card.id]||{x:0,y:0};minX=Math.min(minX,ex.x);minY=Math.min(minY,ex.y);maxX=Math.max(maxX,ex.x+CARD_W);maxY=Math.max(maxY,ex.y+CARD_H);});
    if(!canvasRef.current||minX===Infinity){setScale(1);setOx(40);setOy(40);return;}
    var vw=canvasRef.current.clientWidth-60,vh=canvasRef.current.clientHeight-60;
    var ns=Math.min(Math.min(vw/(maxX-minX),vh/(maxY-minY)),1.5);
    setScale(Math.max(ns,0.2));setOx(20-minX*ns);setOy(20-minY*ns);
  }

  function removeCard(id){
    setPinnedCards(function(cs){var next=cs.filter(function(c){return c.id!==id;});if(DB)DB.deleteCard(campId,id).catch(function(err){console.warn('[Ogma] card delete failed:',err);});return next;});
    if(showToast)showToast('Card removed');
  }

  function spendFP(playerId){updPlayer(playerId,{fp:Math.max(0,(players.find(function(p){return p.id===playerId;})||{fp:0}).fp-1)});}

  // addGeneratedCard is defined above (see complete version with full extras fields)

  function newRound(){
    setRound(function(r){return r+1;});
    setPlayers(function(ps){return ps.map(function(p){return Object.assign({},p,{acted:false});});});
    if(showToast)showToast('New round');
  }

  return h('div',{className:'tp-view',onMouseMove:onMouseMove,onMouseUp:onMouseUp,onMouseLeave:onMouseUp},
    // Floating Dice Panel (MP-20/21)
    showDiceFloat&&h('div',{className:'tp-dice-float'},
      h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'6px 10px',borderBottom:'1px solid var(--border)',
        fontSize:11,fontWeight:700,color:'var(--text-muted)',
        textTransform:'uppercase',letterSpacing:'.08em',
        cursor:'default',userSelect:'none',
      }},
        h('span',null,'🎲 Dice'),
        h('button',{onClick:function(){setShowDiceFloat(false);},
          style:{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:14,lineHeight:1,padding:'0 2px'},
          'aria-label':'Close dice panel'},'×')
      ),
      h(TpDicePanel,{players:players,selId:selPlayer,spendFP:spendFP,
        onRoll:function(r){
          if(showToast)showToast(r.who+' · '+r.skill+' → '+tpLbl(r.total)+' ('+(r.total>=0?'+':'')+r.total+')');
          if(tableSync&&tableSync.connected){
            if(tableSync.role==='gm')tableSync.broadcastRoll(r);
            else tableSync.sendRoll(selPlayer,r);
          }
        }
      })
    ),
    // JSON Export Modal
    showExportModal&&h(TpExportModal,{
      cards:pinnedCards,
      players:players,
      campName:campName,
      onClose:function(){setShowExportModal(false);},
    }),

    // ── Toolbar — ALL controls live here, nothing in the canvas ──
    h('div',{className:'tp-toolbar'},
      h('div',{className:'tp-toolbar-left'},
        h('button',{className:'btn btn-ghost',onClick:onBack,style:{fontSize:12}},'← Back'),
        h('span',{className:'tp-title'},h(FaCartPlusIcon,{size:13}),' Table'),
        h('span',{className:'tp-count'},pinnedCards.length+' card'+(pinnedCards.length!==1?'s':''))
      ),
      h('div',{className:'tp-toolbar-right'},
        // TC-14: Scene counter
        h('div',{className:'rs-round-pill',style:{fontFamily:'var(--font-ui)',gap:3}},
          h('span',{style:{fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-ui)'}},'Sc'),
          h('span',{className:'rs-round-num',style:{fontFamily:'var(--font-ui)'}},scene),
          h('button',{className:'rs-round-btn',onClick:newScene,'aria-label':'New scene',title:'New scene: clears all stress'},'+')
        ),
        // Round counter
        h('div',{className:'rs-round-pill',style:{fontFamily:'var(--font-ui)'}},
          h('button',{className:'rs-round-btn',onClick:function(){if(round>1)setRound(function(r){return r-1;});},'aria-label':'Prev round'},'\u2212'),
          h('span',{style:{fontSize:11,color:'var(--text-muted)',marginRight:2,fontFamily:'var(--font-ui)'}},'Rnd'),
          h('span',{className:'rs-round-num',style:{fontFamily:'var(--font-ui)'}},round),
          h('button',{className:'rs-round-btn',onClick:newRound,'aria-label':'New round'},'+')
        ),
        // TC-06: GM FP pool
        h('div',{className:'rs-round-pill',title:'GM FP pool (1 per PC). \u21BA resets.',style:{fontFamily:'var(--font-ui)',gap:3}},
          h('button',{className:'rs-round-btn',onClick:function(){setGmFP(function(v){return Math.max(0,v-1);});},'aria-label':'Spend GM FP'},'\u2212'),
          h('span',{style:{fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-ui)'}},'\u25C6 GM'),
          h('span',{className:'rs-round-num',style:{fontFamily:'var(--font-ui)',color:gmFP===0?'var(--c-red)':'var(--c-green)'}},gmFP),
          h('button',{className:'rs-round-btn',onClick:function(){setGmFP(function(v){return v+1;});},'aria-label':'Gain GM FP'},'+'),
          h('button',{className:'rs-round-btn',style:{fontSize:9},onClick:function(){setGmFP(players.length);},title:'Reset to 1 per PC'},'\u21BA')
        ),
        // TC-02: Edit/Play toggle (Play mode hides GM-only cards)
        h('button',{className:'btn btn-ghost',onClick:function(){setEditMode(function(v){return !v;});},title:editMode?'Switch to Play Mode (hides GM cards)':'Switch to Edit Mode',style:{fontSize:12}},
          editMode?'\u25B6 Play':'\u270F Edit'),
        // TC-10: Clear canvas
        h('button',{className:'btn btn-ghost',onClick:clearCanvas,title:'Clear canvas and all players',style:{fontSize:12,color:'var(--c-red)'},'aria-label':'Clear'},'\u2715'),
        // Divider
        h('div',{style:{width:1,height:20,background:'var(--border)',flexShrink:0}}),
        // Zoom
        h('button',{className:'btn btn-ghost',onClick:function(){setScale(function(s){return Math.min(s*1.2,3);});},'aria-label':'Zoom in',style:{fontSize:13,padding:'4px 8px',minWidth:32}},'+'),
        h('span',{style:{fontSize:11,color:'var(--text-muted)',minWidth:38,textAlign:'center',fontFamily:'var(--font-ui)',fontWeight:700}},Math.round(scale*100)+'%'),
        h('button',{className:'btn btn-ghost',onClick:function(){setScale(function(s){return Math.max(s/1.2,0.2);});},'aria-label':'Zoom out',style:{fontSize:13,padding:'4px 8px',minWidth:32}},'\u2212'),
        h('button',{className:'btn btn-ghost',onClick:fitAll,title:'Fit all cards',style:{fontSize:12}},'\u22DE Fit'),
        // Divider
        h('div',{style:{width:1,height:20,background:'var(--border)',flexShrink:0}}),
        // Generate — inline popover (no sub-bar)
        h(TpGeneratePopover,{
          campId:campId,partySize:partySize,
          onAdd:function(genId){addGeneratedCard(genId);},
          onAddZone:addZone,
          onAddAspect:addAspectCard,
        }),
        // Dice — floating panel toggle
        h('button',{
          className:'btn btn-ghost'+(showDiceFloat?' active':''),
          onClick:function(){setShowDiceFloat(function(v){return !v;});},
          style:{fontSize:12},
          title:'Show/hide dice roller',
        },'\uD83C\uDFB2 Dice'),
        // Export
        h('button',{className:'btn btn-ghost',onClick:function(){setShowExportModal(true);},title:'Export cards as JSON',style:{fontSize:12},'aria-label':'Export cards'},'💾'),
        // TC-21: Milestone tracker
        

        // Table sync controls
        tableSync&&h('div',{style:{display:'flex',alignItems:'center',gap:4,background:'var(--inset)',
          border:'1px solid var(--c-green)',borderRadius:6,padding:'2px 8px',fontSize:11,
          color:'var(--c-green)',fontFamily:'var(--font-ui)',flexShrink:0}},
          h('span',{style:{fontWeight:700}},tableRoomCode),
          h('span',{style:{color:'var(--text-muted)',margin:'0 3px'}},'·'),
          h('span',null,tablePresence.filter(function(p){return p.connected;}).length+' online'),
          h('button',{style:{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',
            fontSize:11,padding:'0 2px',fontFamily:'var(--font-ui)'},
            title:'Copy join link',
            onClick:function(){
              var path=(window.location.pathname).replace(/\.html$/,'');
              var url=window.location.origin+path+'?room='+tableRoomCode;
              navigator.clipboard.writeText(url).then(function(){if(showToast)showToast('Join link copied!');}).catch(function(){if(showToast)showToast('Room: '+tableRoomCode);});
            }},'📋'),
          h('button',{style:{background:'none',border:'none',cursor:'pointer',color:'var(--c-red)',
            fontSize:11,padding:'0 2px',fontFamily:'var(--font-ui)'},
            onClick:onDisconnectTable},tableIsRemote?'Leave':'Stop')
        ),
        !tableSync&&!tableIsRemote&&onHostTable&&h('button',{
          className:'btn btn-ghost',
          onClick:onHostTable,
          style:{fontSize:12,fontWeight:700,color:'var(--c-green)',flexShrink:0},
          title:'Host this Table canvas online',
        },'🌐 Host'),
        !tableSync&&!tableIsRemote&&onJoinTable&&h('button',{
          className:'btn btn-ghost',
          onClick:function(){
            var code=prompt('Enter room code:');
            if(code&&code.trim())onJoinTable(code.trim().toUpperCase());
          },
          style:{fontSize:12,flexShrink:0},
          title:'Join a hosted Table session',
        },'📶 Join'),
        // Start Party Play removed
      ),  // closes tp-toolbar-right
    ),    // closes tp-toolbar


    // ── Main row: left players + canvas ──────────────────────────
    h('div',{style:{display:'flex',flex:1,overflow:'hidden',minHeight:0}},

      // Left: players
      h('div',{className:'rs-left'},
        h('div',{className:'rs-sidebar-hdr'},
          h('span',null,'Players & FP'),
          h('span',{title:'GM pool. Click to reset to 1 per PC.',onClick:function(){setGmFP(players.length);},
            style:{marginLeft:'auto',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:'var(--font-ui)',
              color:gmFP===0?'var(--c-red)':'var(--c-green)'}},
            '\u25C6\u00A0'+gmFP)
        ),
        h('div',{className:'rs-sidebar-body',role:'list','aria-label':'Players'},
          players.map(function(p){
            return h(TpPlayerRow,{key:p.id,player:p,sel:selPlayer===p.id,
              onUpd:function(patch){updPlayer(p.id,patch);},
              onSel:function(id){setSelPlayer(id);}});
          }),
          h('button',{className:'rs-add-player','aria-label':'Add player',onClick:function(){
            var name=prompt('Player name:');if(!name)return;
            var np={id:tpUid(),name:name,hc:'',fp:3,ref:3,
              phy:[false,false,false],men:[false,false],
              color:TP_COLORS[players.length%TP_COLORS.length],acted:false,conceded:false,skills:[],conseq:['','',''],treating:[false,false,false],aspects:[],stunts:[]};
            setPlayers(function(ps){return ps.concat([np]);});
            setOrder(function(o){return o.concat([np.id]);});
            setGmFP(function(v){return v+1;});
          }},'+ Add Player'),
          // TC-15: Import from .ogma.json
          h('label',{
            className:'rs-add-player',
            title:'Import player from Ogma .ogma.json export',
            style:{cursor:'pointer',display:'block',textAlign:'center'},
          },
            '📂 Import .ogma',
            h('input',{type:'file',accept:'.json,.ogma.json',style:{display:'none'},
              onChange:function(e){
                var file=e.target.files[0];if(!file)return;
                var reader=new FileReader();
                reader.onload=function(ev){
                  var player=tpParseOgmaCharacter(ev.target.result,players.length);
                  if(!player){if(showToast)showToast('Not a valid Ogma file');return;}
                  setPlayers(function(ps){return ps.concat([player]);});
                  setOrder(function(o){return o.concat([player.id]);});
                  setGmFP(function(v){return v+1;});
                  if(showToast)showToast(player.name+' imported');
                };
                reader.readAsText(file);e.target.value='';
              }
            })
          )
        )
      ),

      // Canvas — cards + empty state only, no drawer, no zoom
      h('div',{
        className:'tp-canvas-wrap'+(editMode?' edit-mode':''),
        role:'region','aria-label':'Session canvas',
        ref:canvasRef,onMouseDown:onCanvasMouseDown,onWheel:onWheel,
        style:{touchAction:'none'},
      },
        // MP-22: cursor presence dots
    Object.keys(remoteCursors).length>0&&h('div',{style:{position:'absolute',inset:0,pointerEvents:'none',zIndex:9999}},
      Object.keys(remoteCursors).map(function(id){
        var c=remoteCursors[id];
        var sx=c.x*scale+ox,sy=c.y*scale+oy;
        return h('div',{key:id,style:{
          position:'absolute',left:sx-6,top:sy-6,
          width:12,height:12,borderRadius:'50%',
          background:c.color||'var(--accent)',
          opacity:0.85,pointerEvents:'none',
          boxShadow:'0 0 0 2px rgba(0,0,0,0.3)',
          transition:'left 0.08s linear,top 0.08s linear',
        },title:c.name||'Player'});
      })
    ),
  h('div',{className:'tp-canvas-inner',style:{transform:'translate('+ox+'px,'+oy+'px) scale('+scale+')'}},
          // TC-07: Zone-aware render — zones first (full), then non-child cards on top
        (function(){
          var visCards=pinnedCards.filter(function(card){
            var ex=extras[card.id]||{};
            return editMode||!ex.gmOnly;
          });
          var zones=visCards.filter(function(card){return card.genId==='zone';});
          var nonZone=visCards.filter(function(card){
            var ex=extras[card.id]||{};
            return card.genId!=='zone'&&!ex.zoneId;
          });
          var inZone=visCards.filter(function(card){
            var ex=extras[card.id]||{};
            return card.genId!=='zone'&&ex.zoneId;
          });
          function renderCard(card,inZoneMode){
            var ex=extras[card.id]||{x:0,y:0,size:'md'};
            var typeKey=TP_TYPE_CLS[card.genId]||'cct-mechanic';
            var typeLbl=TP_TYPE_LBL[card.genId]||(card.genId||'').toUpperCase();
            var sz=ex.size||'md';
            var genMeta=(typeof GENERATORS!=='undefined'?GENERATORS:[]).find(function(g){return g.id===card.genId;})||{};
            var zoneChildren=card.genId==='zone'?inZone.filter(function(ch){return (extras[ch.id]||{}).zoneId===card.id;}):[];
            return h('div',{key:card.id,
              className:'cc cc-'+sz+(ex._dragging?' drag-active':'')+(ex.gmOnly?' cc-gm-only':'')+(ex.freeInvoke?' cc-free-invoke':'')+(card.genId==='zone'?' cc-zone-card':'')+(newCardRef.current===card.id?' tp-card-new':''),
              ref:newCardRef.current===card.id?function(el){if(el){setTimeout(function(){newCardRef.current=null;},400);}}:null,
              style:{left:ex.x+'px',top:ex.y+'px',zIndex:ex._dragging?1000:(card.genId==='zone'?1:2)},
              onDragOver:card.genId==='zone'?function(e){e.preventDefault();}:null,
              onDrop:card.genId==='zone'?function(e){
                e.preventDefault();
                var dragId=e.dataTransfer.getData('text/plain');
                if(dragId&&dragId!==card.id)assignToZone(dragId,card.id);
              }:null,
            },
              h('div',{className:'cc-hdr',
                onMouseDown:function(e){onCardDragStart(e,card.id);},
                draggable:!inZoneMode,
                onDragStart:!inZoneMode?function(e){e.dataTransfer.setData('text/plain',card.id);}:null,
              },
                h('span',{className:'cc-type '+typeKey},(genMeta.icon?genMeta.icon+' ':'')+typeLbl),
                ex.zoneId&&h('span',{style:{fontSize:9,color:'var(--c-green)',marginLeft:4}},'⬤'),
                h('div',{className:'cc-hdr-acts'},
                  ex.freeInvoke&&h('span',{title:'Free invoke — click to consume',
                    onClick:function(e){e.stopPropagation();updExtra(card.id,{freeInvoke:false});if(showToast)showToast('Free invoke used');},
                    style:{fontSize:11,color:'var(--c-green)',cursor:'pointer',fontWeight:700,padding:'0 3px',userSelect:'none'},
                  },'★FI'),
                  editMode&&h('button',{className:'cc-ibtn'+(ex.gmOnly?' active':''),
                    onClick:function(e){e.stopPropagation();updExtra(card.id,{gmOnly:!ex.gmOnly});},
                    title:ex.gmOnly?'GM only':'Make GM only',
                    'aria-label':ex.gmOnly?'Make visible to players':'Make GM only',
                    'aria-pressed':String(!!ex.gmOnly),
                    style:{color:ex.gmOnly?'var(--c-amber,#f4b942)':null,fontSize:10},
                  },ex.gmOnly?'GM':'—'),
                  h('button',{className:'cc-ibtn'+(ex.freeInvoke?' active':''),
                    onClick:function(e){e.stopPropagation();updExtra(card.id,{freeInvoke:!ex.freeInvoke});},
                    title:'Free invoke',
                    'aria-label':ex.freeInvoke?'Remove free invoke':'Add free invoke',
                    'aria-pressed':String(!!ex.freeInvoke),
                  },'★'),
                  ['sm','md','full'].map(function(s){
                    return h('button',{key:s,className:'cc-ibtn'+(sz===s?' active':''),
                      title:s==='sm'?'Compact':s==='md'?'Medium':'Full',
                      'aria-label':(s==='sm'?'Compact':s==='md'?'Medium':'Full')+' size',
                      'aria-pressed':String(sz===s),
                      onClick:function(e){e.stopPropagation();updExtra(card.id,{size:s});}
                    },s==='sm'?'□':s==='md'?'▣':'■');
                  }),
                  editMode&&h('button',{className:'cc-ibtn',
                    onClick:function(e){e.stopPropagation();setEditingCard(card.id);},
                    'aria-label':'Edit card',title:'Edit',
                  },'✏'),
                  // TC-07: remove from zone button
                  ex.zoneId&&editMode&&h('button',{className:'cc-ibtn',
                    onClick:function(e){e.stopPropagation();assignToZone(card.id,null);},
                    title:'Remove from zone',
                    'aria-label':'Remove from zone',
                    style:{fontSize:10},
                  },'↵'),
                  h('button',{className:'cc-ibtn danger',
                    onClick:function(e){e.stopPropagation();removeCard(card.id);},
                    'aria-label':'Remove card'},'×')
                )
              ),
              sz!=='sm'&&card.genId!=='zone'&&h('div',{
                className:'tp-card-expand-btn',
                title:'Tap to expand',
                role:'button',
                tabIndex:0,
                'aria-label':'Expand card',
                onKeyDown:function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();
                  setHeroCard(card);
                  if(tableSync&&tableSync.role==='gm'&&tableSync.connected)
                    tableSync.ws.send(JSON.stringify({type:'card_expand',cardId:card.id}));
                }},
                onClick:function(e){
                  if(e.target.closest('button'))return;
                  setHeroCard(card);
                  if(tableSync&&tableSync.role==='gm'&&tableSync.connected)
                    tableSync.ws.send(JSON.stringify({type:'card_expand',cardId:card.id}));
                },
              },
                h(TpCardBody,{
                  card:Object.assign({},card,{size:sz,phyHit:ex.phyHit,menHit:ex.menHit,cdFilled:ex.cdFilled||0,
                    title:ex.title!=null?ex.title:card.title,
                    _notes:ex.notes||''}),
                  onUpd:function(patch){updExtra(card.id,patch);},
                  onRollSkill:function(sk){
                    setSelPlayer(selPlayer||(players[0]&&players[0].id)||null);
                    setShowDiceFloat(true);
                    if(showToast)showToast('Rolling '+sk.l+' +'+sk.v+' — select player to roll');
                  }
                })
              ),
              // TC-07: Zone body with children list + drop hint
              card.genId==='zone'&&h('div',{className:'cc-zone-body'},
                h('div',{style:{fontSize:12,fontWeight:700,color:'var(--text)',marginBottom:3}},
                  ex.title||card.title),
                (ex.notes||card.notes)&&h('div',{style:{fontSize:11,fontStyle:'italic',color:'var(--text-muted)',marginBottom:4}},
                  (ex.notes||card.notes).split('\n')[0]),
                h('div',{className:'cc-zone-children'},
                  zoneChildren.map(function(ch){
                    var chex=extras[ch.id]||{};
                    return h('div',{key:ch.id,className:'cc-zone-child'},
                      h('span',{style:{fontSize:10,color:'var(--text)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},
                        (TP_TYPE_LBL[ch.genId]||ch.genId)+': '+(chex.title||ch.title)),
                      editMode&&h('button',{className:'cc-zone-child-remove',
                        onClick:function(e){e.stopPropagation();assignToZone(ch.id,null);},
                        title:'Remove from zone'},'×')
                    );
                  }),
                  editMode&&zoneChildren.length===0&&h('div',{className:'cc-zone-drop-hint'},'Drop cards here or drag a card onto this zone')
                )
              )
            );
          }
          return zones.map(function(z){return renderCard(z,false);}).concat(
                 nonZone.map(function(card){return renderCard(card,false);}));
        })()

        ),
        pinnedCards.length===0&&h('div',{className:'tp-empty'},
          h('div',{className:'tp-empty-icon'},'\uD83C\uDFB2'),
          h('div',{className:'tp-empty-title'},'Canvas is empty'),
          h('div',{className:'tp-empty-desc'},
            'Use ',
            h('kbd',{style:{background:'var(--inset)',border:'1px solid var(--border)',borderRadius:4,padding:'1px 5px',fontSize:11,fontFamily:'monospace'}},'\u2795 Generate'),
            ' in the toolbar to add cards, or save results from the generator using ',
            h('kbd',{style:{background:'var(--inset)',border:'1px solid var(--border)',borderRadius:4,padding:'1px 5px',fontSize:11,fontFamily:'monospace'}},'P'),
            ' or the pin button.'
          )
        )
      )
    ),

    // ── Turn order bar ────────────────────────────────────────────
    players.length>0&&h(TpTurnBar,{
      players:players,order:order,setOrder:setOrder,
      onToggleActed:function(id){updPlayer(id,{acted:!(players.find(function(p){return p.id===id;})||{}).acted});},
    }),

    // TC-08: Edit card modal
        heroCard&&h(TpHeroModal,{
      card:heroCard,
      campId:campId,
      onClose:function(){
        setHeroCard(null);
        if(tableSync&&tableSync.role==='gm'&&tableSync.connected)
          tableSync.ws.send(JSON.stringify({type:'card_collapse'}));
      },
    }),
    editingCard&&(function(){
      var card=pinnedCards.find(function(c){return c.id===editingCard;});
      var ex=extras[editingCard]||{};
      var curTitle=ex.title!=null?ex.title:(card?card.title:'');
      var curNotes=ex.notes||'';
      return h('div',{
        style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:500,
          display:'flex',alignItems:'center',justifyContent:'center',padding:16},
        onClick:function(){setEditingCard(null);},
      },
        h('div',{
          style:{background:'var(--panel-raised)',border:'1px solid var(--border)',
            borderRadius:10,padding:18,width:'min(420px,90vw)',
            display:'flex',flexDirection:'column',gap:10},
          onClick:function(e){e.stopPropagation();},
        },
          h('div',{style:{fontSize:12,fontWeight:700,color:'var(--text-muted)',
            textTransform:'uppercase',letterSpacing:'.06em'}},'Edit Card'),
          h('input',{type:'text',value:curTitle,placeholder:'Card title',
            autoFocus:true,
            style:{width:'100%',background:'var(--inset)',border:'1px solid var(--border)',
              borderRadius:6,padding:'7px 10px',fontSize:13,color:'var(--text)',
              fontFamily:'var(--font-ui)',outline:'none'},
            onChange:function(e){updExtra(editingCard,{title:e.target.value});},
          }),
          h('textarea',{value:curNotes,placeholder:'Notes (shown on card)',rows:4,
            style:{width:'100%',background:'var(--inset)',border:'1px solid var(--border)',
              borderRadius:6,padding:'7px 10px',fontSize:12,color:'var(--text)',
              fontFamily:'var(--font-ui)',outline:'none',resize:'vertical'},
            onChange:function(e){updExtra(editingCard,{notes:e.target.value});},
          }),
          h('div',{style:{display:'flex',justifyContent:'flex-end',gap:8}},
            h('button',{className:'btn btn-ghost',
              onClick:function(){setEditingCard(null);},style:{fontSize:12}},'Cancel'),
            h('button',{className:'btn',
              onClick:function(){setEditingCard(null);if(showToast)showToast('Card updated');},
              style:{fontSize:12,background:'var(--accent)',color:'var(--bg)',border:'none'}
            },'Save')
          )
        )
      );
    })()
  );
}