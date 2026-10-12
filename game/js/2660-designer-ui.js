// ===== PART DESIGNER WINDOW (client): key F7, or 🧪 in the Ship Builder =====
const DSW=document.createElement('div');DSW.id='desw';DSW.className='h';
DSW.innerHTML='<div class="card"><h2>🧪 Part designer</h2><p class="opsn">Invent a part: choose what it is and its size. Its mass, materials, build energy and performance come from the same physics for every player. Saved designs appear in 🧱 Builder → Add a part, and are built, mounted, upgraded and repaired like any other part.</p><div id="desb"></div><button id="desc">Close (F7)</button></div>';
document.body.appendChild(DSW);$('desc').onclick=()=>DSW.classList.add('h');
const DSP={kind:'radiator',type:'lo',area:120,carbon:false,mass:500,power:1e5,thick:5,g:3,ad:5,ap:7,name:''};
function desToggle(){DSW.classList.toggle('h');desDraw()}
const DS_KINDS={radiator:'♨ Radiator',battery:'🔋 Battery',reactor:'⚛ Reactor',armour:'🛡 Armour',frame:'🏗 Frame',liner:'☢ Radiation liner',sensor:'📡 Sensor',lab:'🔬 Laboratory',fab:'🏭 Fabricator'};
const DS_TYPES={radiator:[['lo','Low-temperature (crew loop, 400 K)'],['hi','Heat-pipe (1,200 K)'],['drop','Liquid-droplet (900 K)']],battery:[['li','Li-ion'],['ss','Solid-state'],['fly','Flywheel'],['cap','Supercapacitor']],
 reactor:[['stirling','Fission, Stirling engines'],['brayton','Fission, Brayton turbines']],armour:[['ceramic','Ceramic composite']],
 frame:[['al','Aluminium truss'],['cf','Carbon composite'],['ti','Titanium steel']],liner:[['al','Aluminium plating'],['pe','Polyethylene (1.6× per kg)']],
 sensor:[['dop','Doppler radar dish'],['pa','Phased-array panel'],['lid','Lidar and spectrometer']],lab:[['lab','Onboard laboratory'],['station','Research station']],fab:[['ind','Industrial fabricator'],['orb','Orbital factory']]};
// choosing a type starts from the stock part it is based on
function desType(t){DSP.type=t;const k=DSP.kind;
 if(k==='frame')DSP.g=DES.frame[t].g0;else if(k==='liner')DSP.ad=5;else if(k==='sensor'){DSP.ap=DES.sensor[t].A0;DSP.power=DES.sensor[t].P0}
 else if(k==='lab')DSP.mass=DES.lab[t].m0;else if(k==='fab')DSP.mass=t==='ind'?3000:3e4;else if(k==='reactor')DSP.power=t==='brayton'?1e6:4e4;else if(k==='battery')DSP.mass=500}
function desDraw(){if(DSW.classList.contains('h'))return;const p=DSP,d=desPart(p),ok=!d.req||hasT(d.req),num=(id,lab,v,min,max,step,unit)=>`<label class="desf"><span>${lab}</span> <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"> <b>${v.toLocaleString()} ${unit}</b></label>`;
 let h=`<p class="deskinds">${Object.keys(DS_KINDS).map(k=>`<button data-k="${k}" class="${p.kind===k?'bldsel':''}">${DS_KINDS[k]}</button>`).join(' ')}</p>
 <p>${DS_TYPES[p.kind].map(([t,l])=>`<label class="desr"><input type="radio" name="dest" value="${t}" ${p.type===t||(!DS_TYPES[p.kind].some(x=>x[0]===p.type)&&t===DS_TYPES[p.kind][0][0])?'checked':''}> ${l}</label>`).join(' ')}</p>`;
 if(p.kind==='radiator')h+=num('dsa','Area',p.area,10,1000,10,'m²')+(p.type!=='drop'?`<label class="desr"><input type="checkbox" id="dsc" ${p.carbon?'checked':''}> <span>Carbon-composite fins (35 % lighter)</span></label>`:'');
 if(p.kind==='battery')h+=num('dsm','Mass',p.mass,50,20000,50,'kg');
 if(p.kind==='reactor')h+=num('dsp','Electric power',Math.round(p.power/1e3),10,10000,10,'kW');
 if(p.kind==='armour')h+=num('dst','Thickness',p.thick,1,30,1,'cm')+num('dsa','Area covered',p.area,10,200,5,'m²');
 if(p.kind==='frame'){const v=DES.frame[p.type]||DES.frame.al;h+=num('dsg','Thrust rating',d.g,v.g[0],v.g[1],.5,'g')}
 if(p.kind==='liner')h+=num('dsd','Areal density',d.ad,1,20,.5,'g/cm²');
 if(p.kind==='sensor'){const v=DES.sensor[p.type]||DES.sensor.dop,st=v.A0>=4?1:.25;h+=num('dsap','Aperture',Math.round(p.ap/st)*st,Math.max(st,Math.round(v.A0/4/st)*st),v.A0*6,st,'m²')+num('dsp','Transmit power',+(p.power/1e3).toFixed(1),v.P0/5e3,v.P0*20/1e3,v.P0/5e3,'kW')}
 if(p.kind==='lab'||p.kind==='fab'){const v=DES[p.kind][p.type]||DES[p.kind][p.kind==='lab'?'lab':'ind'],stp=v.m[1]>3e4?1000:v.m[1]>5000?100:50;h+=num('dsm','Mass',d.m,v.m[0],v.m[1],stp,'kg')}
 const perf=d.cat==='therm'?`${d.A} m² · ${d.Tmax} K · ${sci(.85*5.67e-8*2*d.A*(d.Tmax**4-256))} W ${tr('at full temperature')}`:d.cat==='store'?`${sci(d.cap)} J · ${sci(d.pmax)} W`:d.cat==='gen'?`${sci(d.pe)} W ${tr('electric')} · ${sci(d.pe/d.eta)} W ${tr('heat')}`
  :d.cat==='frame'?`${f1(d.g,1)} g ${tr('maximum thrust')}`:d.cat==='sensor'?`${tr(SENSOR_TIERS[d.tier].n)} · ${fmtD(SENSOR_TIERS[d.tier].range*d.rng)} (${Math.round(d.rng*100)} %) · ${sci(d.p)} W`
  :d.cat==='lab'?`${f1(d.rp,2)} ${tr('research points per hour')} · ${sci(d.p)} W`:d.cat==='fab'?`${sci(d.pw)} W ${tr('of manufacturing')}`
  :d.armor?`${Math.round(d.armor*100)} % ${tr('absorbed')} · +${f1(d.ad,1)} g/cm²`:`+${f1(d.ad*(d.hyd?1.6:1),1)} g/cm² ${tr('of radiation shielding')}`;
 h+=`<table class="bldt"><tr><td>Mass</td><td>${f1(d.m,1)} kg</td></tr><tr><td>Materials</td><td>${Object.entries(d.mat).map(([k,v])=>f1(v,v<1?3:0)+' kg '+k).join(', ')}</td></tr>
  <tr><td>Energy to build</td><td>${sci(d.J)} J</td></tr><tr><td>Performance</td><td>${perf}</td></tr><tr><td>Research needed</td><td>${d.req?(ok?'✓ ':'🔒 ')+(TECH.find(t=>t.id===d.req)||{n:d.req}).n:'—'}</td></tr></table>
  <p><input id="dsn" placeholder="${d.n}" value="${p.name.replace(/"/g,'')}"> <button id="dss" ${ok?'':'disabled'}>💾 Save design</button></p>`;
 const mine=Object.entries(s.custom||{});if(mine.length)h+='<h4>YOUR DESIGNS</h4>'+mine.map(([id,c])=>`<div class="navr"><b>${c.n}</b> <small>${f1(c.m,0)} kg · ${c.d}</small> <button data-del="${id}">✕</button></div>`).join('');
 const b=$('desb');b.innerHTML=h;
 b.querySelectorAll('[data-k]').forEach(x=>x.onclick=()=>{DSP.kind=x.dataset.k;desType(DS_TYPES[DSP.kind][0][0]);desDraw()});
 b.querySelectorAll('input[name=dest]').forEach(x=>x.onchange=()=>{desType(x.value);desDraw()});
 const bind=(id,key,mul)=>{const e=$(id);if(e)e.oninput=()=>{DSP[key]=+e.value*(mul||1);desDraw()}};bind('dsa','area');bind('dsm','mass');bind('dsp','power',1e3);bind('dst','thick');bind('dsg','g');bind('dsd','ad');bind('dsap','ap');
 const c=$('dsc');if(c)c.onchange=()=>{DSP.carbon=c.checked;desDraw()};
 const n=$('dsn');n.oninput=()=>{DSP.name=n.value};n.addEventListener('keydown',e=>e.stopPropagation());
 $('dss').onclick=()=>{const id=desSave(DSP);if(id){notify('🧪 Design saved: '+PARTS[id].n+'. Build it from 🧱 Builder → Add a part.');DSP.name='';desDraw()}};
 b.querySelectorAll('[data-del]').forEach(x=>x.onclick=()=>{if(!desDelete(x.dataset.del))notify('⚠ That design is installed on your ship: recycle it first.');desDraw()})}
