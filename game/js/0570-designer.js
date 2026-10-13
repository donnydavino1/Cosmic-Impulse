// ===== PART DESIGNER (RULES): invent your own parts from the same physics as the stock ones =====
// You choose a kind of part and its main dimensions; these formulas (shared by everyone, so designs are fair) work
// out its mass, materials (they always add up to exactly its mass: Law 3), build energy, research needed and
// performance. A saved design becomes a real part (id 'c_…') that you build, mount, upgrade and repair like any other.
const DES={
 radiator:{lo:{kgm2:2,T:400,req:null,mat:{iron:.6,silicates:.4}},hi:{kgm2:7.5,T:1200,req:'t_hpr',mat:{iron:.5,nickel:.49,platinum:.01}},drop:{kgm2:1,T:900,req:'t_ldr',mat:{iron:.75,nickel:.24,platinum:.01}},Jkg:5e6},
 battery:{li:{e:9e5,p:2e3,wear:true,req:null,mat:{nickel:.5,carbon:.33,silicates:.17}},ss:{e:1.8e6,p:4e3,wear:true,req:'t_ssb',mat:{nickel:.33,silicates:.666,platinum:.004}},
  fly:{e:3.6e5,p:2e4,req:'t_fly',mat:{carbon:.75,iron:.25}},cap:{e:2e4,p:2.5e6,req:'t_cap',mat:{carbon:.6,iron:.3,silicates:.1}},Jkg:4e6},
 reactor:{stirling:{eta:.25,ref:4e4,m:1500,req:'t_fis'},brayton:{eta:.3,ref:1e6,m:12000,req:'t_fis2'},Jkg:1.3e7},
 armour:{rho:2800,req:'t_ti',mat:{iron:.5,silicates:.4,carbon:.1},Jkg:2e6},
 // frames: mass grows as (g rating)^0.6 from the stock frame of the same material
 frame:{al:{g0:3,m0:150,g:[1,6],req:null,mat:{iron:1},Jkg:3.3e6},cf:{g0:6,m0:110,g:[2,12],req:'t_cf',mat:{carbon:1},Jkg:3.6e7},ti:{g0:12,m0:260,g:[4,24],req:'t_ti',mat:{iron:.82,nickel:.18},Jkg:2.3e7}},
 // radiation liners: 300 kg per g/cm² of areal density around the cabin (polyethylene counts 1.6× per kg)
 liner:{al:{req:null,mat:{iron:.2,silicates:.8},Jkg:1.33e6},pe:{req:'t_pe',mat:{carbon:.8667,water:.1333},Jkg:2.67e6},kgPer:300},
 // sensors: mass = aperture area × kg/m² + transmit power × kg/W; range ∝ (power × area²)^¼ (radar equation)
 sensor:{dop:{tier:1,A0:7,P0:2e3,kgm2:12,kgW:.018,req:'t_lab2',mat:{iron:.5,silicates:.333,nickel:.1666,platinum:.0004},Jkg:2.5e7},
  pa:{tier:2,A0:12,P0:2e4,kgm2:35,kgW:.009,req:'t_fab2',mat:{silicates:.5,iron:.366,nickel:.1333,platinum:.0007},Jkg:3.3e7},
  lid:{tier:3,A0:1,P0:1e5,kgm2:630,kgW:.0027,req:'t_lab3',mat:{silicates:.389,iron:.333,carbon:.111,nickel:.1644,platinum:.0022},Jkg:8.9e7}},
 // laboratories: research points grow as mass^0.85 from the stock module; power per kg fixed by the kind
 lab:{lab:{m0:800,rp0:6,Wkg:25,m:[200,3000],req:'t_lab2',mat:{iron:.6,silicates:.398,platinum:.002},Jkg:6.25e6},
  station:{m0:5000,rp0:30,Wkg:60,m:[2000,20000],req:'t_lab3',mat:{iron:.5,silicates:.373,platinum:.0025,carbon:.1245},Jkg:2e7}},
 // fabricators: manufacturing power proportional to mass
 fab:{ind:{Wkg:5e6/3000,m:[500,10000],req:'t_fab2',mat:{iron:.714,nickel:.143,silicates:.143},Jkg:1.67e7},
  orb:{Wkg:5e8/3e4,m:[5000,1e5],req:'t_fab3',mat:{iron:.6489,nickel:.1298,silicates:.2163,platinum:.005},Jkg:6.7e7}}};
const desClamp=(v,lo,hi,def)=>{v=+v;if(!isFinite(v))v=def;return Math.max(lo,Math.min(hi,v))};
const desMat=(frac,m)=>{const o={};let sum=0;for(const k in frac){o[k]=Math.round(frac[k]*m*1000)/1000;sum+=o[k]}const k0=Object.keys(o)[0];o[k0]=Math.round((o[k0]+m-sum)*1000)/1000;return o};
// p: {kind, ...dimensions} → a part definition (or {err})
function desPart(p){let d;
 if(p.kind==='radiator'){const v=DES.radiator[p.type]||DES.radiator.lo,A=Math.max(10,Math.min(2000,+p.area||60)),carbon=!!p.carbon&&p.type!=='drop',m=A*v.kgm2*(carbon?.65:1);
  d={cat:'therm',A,loop:p.type==='lo'?'lo':'hi',Tmax:v.T,hp:p.type==='hi'?1:0,m,mat:desMat(carbon?{carbon:.7,silicates:.3}:v.mat,m),req:carbon&&!v.req?'t_cf':v.req,
   d:`${A} m² ${p.type==='lo'?'low-temperature':p.type==='hi'?'heat-pipe':'liquid-droplet'} radiator, up to ${v.T} K${carbon?', carbon-composite fins':''}.`}}
 else if(p.kind==='battery'){const v=DES.battery[p.type]||DES.battery.li,m=Math.max(20,Math.min(20000,+p.mass||500));
  d={cat:'store',m,cap:v.e*m,pmax:v.p*m,wear:!!v.wear,mat:desMat(v.mat,m),req:v.req,d:`${(v.e*m/1e6).toFixed(0)} MJ, up to ${(v.p*m/1e6).toFixed(2)} MW.`}}
 else if(p.kind==='reactor'){const v=DES.reactor[p.type]||DES.reactor.stirling,P=Math.max(1e4,Math.min(1e7,+p.power||4e4)),m=v.m*Math.pow(P/v.ref,.75);
  d={cat:'gen',m,pe:P,eta:v.eta,rad:Math.min(1.2,.3*Math.pow(P/4e4,.22)),earth:true,mat:desMat(p.type==='brayton'?{iron:.78,nickel:.2198,platinum:.0002}:{iron:.82,nickel:.18},m),req:v.req,
   d:`${(P/1e3).toFixed(0)} kW electric at ${Math.round(v.eta*100)} % (${(P/v.eta/1e3).toFixed(0)} kW of heat to radiate). Needs uranium from Earth.`}}
 else if(p.kind==='armour'){const t=Math.max(1,Math.min(30,+p.thick||5)),A=Math.max(10,Math.min(200,+p.area||40)),m=DES.armour.rho*t/100*A,ab=Math.min(.85,1-Math.exp(-t/5));
  d={cat:'shield',m,armor:ab,ad:Math.min(20,DES.armour.rho*t/100/10*.3),mat:desMat(DES.armour.mat,m),req:DES.armour.req,d:`${t} cm ceramic composite over ${A} m²: a hit that strikes it loses ${Math.round(ab*100)} % of its energy.`}}
 else if(p.kind==='frame'){const v=DES.frame[p.type]||DES.frame.al,g=desClamp(p.g,v.g[0],v.g[1],v.g0),m=v.m0*Math.pow(g/v.g0,.6);
  d={cat:'frame',one:true,m,g,mat:desMat(v.mat,m),req:v.req,Jkg:v.Jkg,d:`${p.type==='al'?'Light-alloy':p.type==='cf'?'Carbon-composite':'Titanium-steel'} space frame rated for ${(Math.round(g*10)/10)} g of thrust.`}}
 else if(p.kind==='liner'){const v=DES.liner[p.type]||DES.liner.al,ad=desClamp(p.ad,1,20,5),m=ad*DES.liner.kgPer;
  d={cat:'shield',m,ad,hyd:p.type==='pe',mat:desMat(v.mat,m),req:v.req,Jkg:v.Jkg,d:`${p.type==='pe'?'Polyethylene liner':'Aluminium plating'} around the cabin: +${(Math.round(ad*10)/10)} g/cm²${p.type==='pe'?' (counts 1.6× against radiation)':''}.`}}
 else if(p.kind==='sensor'){const v=DES.sensor[p.type]||DES.sensor.dop,A=desClamp(p.ap,v.A0/4,v.A0*6,v.A0),P=desClamp(p.power,v.P0/5,v.P0*20,v.P0),m=A*v.kgm2+P*v.kgW,
  rng=Math.round(Math.max(.4,Math.min(3,Math.pow(P/v.P0*(A/v.A0)**2,.25)))*1000)/1000;
  d={cat:'sensor',m,p:P,tier:v.tier,rng,mat:desMat(v.mat,m),req:v.req,Jkg:v.Jkg,d:`${p.type==='dop'?'Doppler radar dish':p.type==='pa'?'Phased-array panel':'Lidar and spectrometer'}: ${(Math.round(A*10)/10)} m² aperture, ${(P/1e3).toFixed(1)} kW: ${Math.round(rng*100)} % of the standard range.`}}
 else if(p.kind==='lab'){const v=DES.lab[p.type]||DES.lab.lab,m=desClamp(p.mass,v.m[0],v.m[1],v.m0),rp=Math.round(v.rp0*Math.pow(m/v.m0,.85)*100)/100;
  d={cat:'lab',one:true,m,p:v.Wkg*m,rp,mat:desMat(v.mat,m),req:v.req,Jkg:v.Jkg,d:`${p.type==='lab'?'Laboratory':'Research station'} module: ${rp} research points per hour for ${(v.Wkg*m).toExponential(2)} W.`}}
 else if(p.kind==='fab'){const v=DES.fab[p.type]||DES.fab.ind,m=desClamp(p.mass,v.m[0],v.m[1],v.m[0]),pw=v.Wkg*m;
  d={cat:'fab',one:true,m,pw,mat:desMat(v.mat,m),req:v.req,Jkg:v.Jkg,d:`${p.type==='ind'?'Industrial fabricator':'Orbital factory'}: puts up to ${pw.toExponential(2)} W into manufacturing.`}}
 else return{err:'unknown kind'};
 const J=Math.round(d.m*(d.Jkg||DES[p.kind].Jkg));delete d.Jkg;d.m=Math.round(d.m*10)/10;d.J=J;d.custom=true;d.spec=Object.assign({},p);
 d.n=(String(p.name||'').trim().slice(0,40))||({radiator:'Custom radiator',battery:'Custom battery',reactor:'Custom reactor',armour:'Custom armour',frame:'Custom frame',liner:'Custom radiation liner',sensor:'Custom sensor',lab:'Custom laboratory',fab:'Custom fabricator'})[p.kind]+' '+desSize(p);return d}
const desSize=p=>p.kind==='radiator'?`(${p.area} m²)`:p.kind==='battery'||p.kind==='lab'||p.kind==='fab'?`(${p.mass} kg)`:p.kind==='reactor'?`(${Math.round(p.power/1e3)} kW)`:p.kind==='frame'?`(${p.g} g)`:p.kind==='liner'?`(${p.ad} g/cm²)`:p.kind==='sensor'?`(${p.ap} m², ${Math.round(p.power/1e3)} kW)`:`(${p.thick} cm)`;
if(!s.custom)s.custom={};
function desRegister(){for(const id in s.custom)PARTS[id]=s.custom[id]}
function desSave(p){const d=desPart(p);if(d.err)return null;const id='c_'+(Date.now().toString(36)+Math.random().toString(36).slice(2,5));s.custom[id]=d;PARTS[id]=d;return id}
function desDelete(id){if(s.parts.some(q=>q.id===id))return false;delete s.custom[id];delete PARTS[id];return true}
desRegister();
