// ===== RAILGUN SLUGS (RULES): how heavy a slug the railgun throws =====
// Each shot puts the same 64 MJ into the slug (half of the 128 MJ drawn; the rest heats the rails), so its speed is
// v = √(2E/m). Light slugs fly fast: less time for a target to dodge, and closing speed adds to the hit. Heavy slugs are
// slow but push the ship back more (recoil momentum m·v = √(2E·m)) and cost more iron. Impact energy is ½·m·v_rel²,
// with v_rel the speed relative to the target, so a fast slug fired at a target coming toward you hits hardest.
const SLUGS={.5:{n:'Needle (0.5 kg)'},2:{n:'Standard (2 kg)'},8:{n:'Heavy (8 kg)'}},RAIL_E=6.4e7;
if(!s.slug)s.slug=2;
const slugM=()=>SLUGS[s.slug]?+s.slug:2,slugV=m=>Math.sqrt(2*RAIL_E/(m||slugM()));
