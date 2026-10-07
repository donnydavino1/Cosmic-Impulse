// The rules fingerprint: a short hash of every rule. Two games can only fight if they match,
// which is how an open-source game keeps everyone on the same physics.

import * as RULES from '../rules/rules.js';

export function fingerprint() {
  const text = JSON.stringify(Object.keys(RULES).sort().map((k) => [k, RULES[k]]));
  let h = 2166136261; // FNV-1a, 32 bit
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
