// ===== SPACE RADIO: original music generated live by this code (royalty-free, no files) =====
let AC=null,MG=null,RV=null,DL=null,chan=0,radioOn=false,rStep=0,rNext=0,rTimer=0,vol=.5;
const CH=[{n:'Off'},{n:'Deep Drift',bpm:60},{n:'Solar Wind',bpm:96},{n:'Pulsar',bpm:112},{n:'Nebula Choir',bpm:50}],mtof=m=>440*Math.pow(2,(m-69)/12);
function initAudio(){if(AC)return;const A=window.AudioContext||window.webkitAudioContext;if(!A)return;AC=new A();MG=AC.createGain();MG.gain.value=vol*.6;const cp=AC.createDynamicsCompressor();MG.connect(cp);cp.connect(AC.destination);
 RV=AC.createConvolver();const n=AC.sampleRate*3.5|0,bf=AC.createBuffer(2,n,AC.sampleRate);for(let c=0;c<2;c++){const d=bf.getChannelData(c);for(let k=0;k<n;k++)d[k]=(Math.random()*2-1)*Math.pow(1-k/n,2.5)}RV.buffer=bf;const rg=AC.createGain();rg.gain.value=.55;RV.connect(rg);rg.connect(cp);
 DL=AC.createDelay(1);DL.delayTime.value=.375;const fb=AC.createGain();fb.gain.value=.35;DL.connect(fb);fb.connect(DL);DL.connect(RV);DL.connect(MG)}
function tone(f,t,d,{type='sine',v=.2,a=.02,r=.3,cut=0,send=.5,del=0}={}){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;let nd=o;if(cut){const fl=AC.createBiquadFilter();fl.type='lowpass';fl.frequency.value=cut;o.connect(fl);nd=fl}nd.connect(g);g.connect(MG);
 if(send){const sg=AC.createGain();sg.gain.value=send;g.connect(sg);sg.connect(RV)}if(del){const dg=AC.createGain();dg.gain.value=del;g.connect(dg);dg.connect(DL)}
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setValueAtTime(v,t+Math.max(a,d-r));g.gain.linearRampToValueAtTime(0,t+d);o.start(t);o.stop(t+d+.05)}
function noise(t,d,v,cut,type='highpass'){const b=AC.createBuffer(1,AC.sampleRate*d|0,AC.sampleRate),x=b.getChannelData(0);for(let k=0;k<x.length;k++)x[k]=Math.random()*2-1;const src=AC.createBufferSource();src.buffer=b;const fl=AC.createBiquadFilter();fl.type=type;fl.frequency.value=cut;const g=AC.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);src.connect(fl);fl.connect(g);g.connect(MG);g.connect(RV);src.start(t)}
function kick(t){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(40,t+.25);g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(MG);o.start(t);o.stop(t+.4)}
function play(ch,st,t){const b=60/CH[ch].bpm,sp=b/4,rnd=Math.random;
 if(ch===1){const c=[[50,57,62,65,69],[46,53,58,62,65],[48,55,60,64,67],[45,52,57,60,64]][(st>>5)%4];
  if(st%32===0){c.slice(0,4).forEach((m,k)=>tone(mtof(m),t,9.5,{type:'sawtooth',v:.035,a:3,r:4,cut:700+k*150,send:.9}));tone(mtof(c[0]-12),t,9,{v:.12,a:2,r:3,send:.3})}
  if(st%4===0&&rnd()<.35)tone(mtof(c[1+(rnd()*4|0)]+12),t,3,{v:.05,a:.005,r:2.6,send:.9,del:.4})}
 else if(ch===2){const c=[[62,65,69,72,74],[58,62,65,69,72],[60,64,67,71,72],[57,60,64,67,69]][(st>>5)%4],pat=[0,2,4,3,1,2,3,4];
  tone(mtof(c[pat[st%8]]+(st%16>11?12:0)),t,sp*1.6,{type:'triangle',v:.06,a:.005,r:.15,cut:3000,send:.4,del:.45});
  if(st%32===0)[0,2,4].forEach(k=>tone(mtof(c[k]-12),t,b*8.2,{type:'triangle',v:.03,a:1.5,r:2.5,send:.8}));if(st%8===0)tone(mtof(c[0]-24),t,b*1.8,{v:.12,a:.02,r:.6,send:.2})}
 else if(ch===3){const R0=[45,41,48,43][(st>>4)%4];if(st%4===0)kick(t);if(st%4===2)noise(t,.06,.12,7000);if(st%8===4)noise(t,.18,.1,1800,'bandpass');
  if(st%2===0)tone(mtof(R0-12+(st%8===6?12:0)),t,sp*1.7,{type:'sawtooth',v:.07,a:.005,r:.08,cut:500,send:.1});
  if(st%16===0)[0,7,12,15].forEach(k=>tone(mtof(R0+12+k),t,b*3.8,{type:'square',v:.012,a:.4,r:1.5,cut:1400,send:.7}));
  if(st%16===10&&rnd()<.6)tone(mtof(R0+24+[0,3,7,10][rnd()*4|0]),t,b*1.5,{type:'triangle',v:.05,a:.01,r:.6,send:.6,del:.5})}
 else if(ch===4){const c=[[48,55,60,64,67],[53,57,60,65,69],[50,57,62,65,72],[43,50,55,59,62]][Math.floor(st/24)%4];
  if(st%24===0){c.forEach(m=>{tone(mtof(m),t,13,{type:'triangle',v:.03,a:4,r:5,send:1});tone(mtof(m)*1.004,t,13,{v:.03,a:4.5,r:5,send:1})});noise(t,12,.03,500,'lowpass')}
  if(rnd()<.18)tone(mtof(c[rnd()*5|0]+24),t,2.5,{v:.025,a:.01,r:2.2,send:1,del:.5})}}
function sched(){if(!radioOn||!AC||!chan)return;while(rNext<AC.currentTime+.25){play(chan,rStep,rNext);rNext+=60/CH[chan].bpm/4;rStep++}}
function startCh(){if(!AC)return;AC.resume&&AC.resume();rStep=0;rNext=AC.currentTime+.1;if(!rTimer)rTimer=setInterval(sched,50)}
function radioToggle(){initAudio();radioOn=!radioOn;if(radioOn&&!chan)chan=1;if(radioOn)startCh()}
function radioCh(d){initAudio();chan=((chan||1)-1+d+4)%4+1;radioOn=true;startCh()}
function chime(){if(!AC)return;const t=AC.currentTime+.02;tone(880,t,.5,{v:.08,a:.005,r:.4,send:.4});tone(1320,t+.12,.6,{v:.07,a:.005,r:.5,send:.4})}
{const rd=$('radio');btn(rd,'◀',()=>radioCh(-1));btn(rd,()=>'📻 '+(radioOn?CH[chan].n:'Music off')+'  ('+KN(BIND.radio)+')',()=>radioToggle());btn(rd,'▶',()=>radioCh(1));
 btn(rd,()=>'🔉 '+Math.round(vol*100)+'%',()=>{vol=vol>=1?.1:Math.round((vol+.1)*10)/10;if(MG)MG.gain.value=vol*.6})}

