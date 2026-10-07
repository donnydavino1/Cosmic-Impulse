// ===== MODULE BUS: how modules talk without editing each other =====
// Any module can listen:  ORB.on('frame', (now, closeView) => {...})
// Events emitted by the core (add more the same way: ORB.emit('name', ...args)):
//   'frame'       every rendered frame (now = performance.now(), closeView = close-range scene drawn)
//   'ui'          every 4th frame, after the panels refresh (cheap place to update DOM)
//   'ship:build'  the 3D ship model was rebuilt: {g: THREE.Group, rad, part, H (hull material), dark, A (accent colour)}
// ORB.shipKey parts: modules push functions returning strings; when any string changes, the ship model is rebuilt.
// A hook that throws is logged and skipped, so one broken module cannot stop the game.
const ORB={v:1,version:'0.12.0',hooks:{},keyParts:[],mods:{},
 on(ev,fn){(this.hooks[ev]=this.hooks[ev]||[]).push(fn);return fn},
 emit(ev,...a){const L=this.hooks[ev];if(L)for(const f of L){try{f(...a)}catch(e){console.warn('ORB hook '+ev,e)}}},
 shipKey(){let k='';for(const f of this.keyParts){try{k+=f()+'|'}catch(e){}}return k}};
window.ORB=ORB;
