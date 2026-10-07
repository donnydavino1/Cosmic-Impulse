// Peer-to-peer transport for two players. Knows nothing about the game: it delivers JSON
// messages. Two ways to connect:
//   1. Room code: the free PeerJS matchmaking server introduces the two browsers.
//   2. Manual: players exchange two text codes by chat or email. No server at all.
// Game data always flows directly between the two computers (WebRTC data channel).

const ICE = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] };
const PREFIX = 'orbital-arena-';
const encode = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const decode = (t) => JSON.parse(decodeURIComponent(escape(atob(t.trim()))));

export class Net {
  constructor({ onOpen, onMessage, onClose, onStatus }) {
    Object.assign(this, { onOpen, onMessage, onClose, onStatus });
    this.channel = null;
    this.role = null;
  }

  get connected() {
    return !!this.channel;
  }

  send(msg) {
    if (!this.channel) return;
    try {
      this.channel.send(JSON.stringify(msg));
    } catch (e) {
      /* channel closing */
    }
  }

  open(channel, role) {
    this.channel = channel;
    this.role = role;
    this.onOpen(role);
  }

  receive(data) {
    let msg;
    try {
      msg = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      return;
    }
    if (msg && typeof msg === 'object' && typeof msg.t === 'string') this.onMessage(msg);
  }

  lost() {
    if (!this.channel) return;
    this.channel = null;
    this.onClose();
  }

  close() {
    try {
      this.conn && this.conn.close();
      this.peer && this.peer.destroy();
      this.rtc && this.rtc.close();
    } catch (e) {
      /* already closed */
    }
    this.lost();
  }

  // ---- 1. Room code (PeerJS) ----
  host() {
    if (typeof Peer === 'undefined') return this.onStatus('The PeerJS library did not load (offline?). Use the manual codes below.', 'bad');
    const code = Array.from({ length: 5 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
    this.peer = new Peer(PREFIX + code);
    this.peer.on('open', () => this.onStatus(`Hosting. Give your friend the room code ${code}.`, 'ok', code));
    this.peer.on('connection', (c) => c.on('open', () => (this.channel ? c.close() : this.wirePeer(c, 'host'))));
    this.peer.on('error', (e) => this.onStatus(`Connection error: ${e.type || e}`, 'bad'));
  }

  join(code) {
    code = String(code || '').trim().toUpperCase();
    if (!code) return this.onStatus('Type the room code first.', 'bad');
    if (typeof Peer === 'undefined') return this.onStatus('The PeerJS library did not load (offline?). Use the manual codes below.', 'bad');
    this.peer = new Peer();
    this.peer.on('open', () => {
      const c = this.peer.connect(PREFIX + code, { reliable: true });
      c.on('open', () => this.wirePeer(c, 'guest'));
    });
    this.peer.on('error', (e) =>
      this.onStatus(e.type === 'peer-unavailable' ? 'No match with that code. Check it, and make sure the host keeps the game open.' : `Could not connect: ${e.type || e}`, 'bad'),
    );
    this.onStatus('Connecting…');
  }

  wirePeer(c, role) {
    this.conn = c;
    c.on('data', (d) => this.receive(d));
    c.on('close', () => this.lost());
    c.on('error', () => this.lost());
    this.open({ send: (x) => c.send(x) }, role);
  }

  // ---- 2. Manual codes (WebRTC without any server) ----
  async invite() {
    this.rtc = new RTCPeerConnection(ICE);
    this.wireChannel(this.rtc.createDataChannel('orbital'), 'host');
    await this.rtc.setLocalDescription(await this.rtc.createOffer());
    await this.gathered();
    return `ORBITAL-INVITE:${encode(this.rtc.localDescription)}`;
  }

  async answer(invite) {
    this.rtc = new RTCPeerConnection(ICE);
    this.rtc.ondatachannel = (e) => this.wireChannel(e.channel, 'guest');
    await this.rtc.setRemoteDescription(decode(invite.replace('ORBITAL-INVITE:', '')));
    await this.rtc.setLocalDescription(await this.rtc.createAnswer());
    await this.gathered();
    return `ORBITAL-REPLY:${encode(this.rtc.localDescription)}`;
  }

  async finish(reply) {
    await this.rtc.setRemoteDescription(decode(reply.replace('ORBITAL-REPLY:', '')));
  }

  gathered() {
    const pc = this.rtc;
    return new Promise((resolve) => {
      if (pc.iceGatheringState === 'complete') return resolve();
      pc.addEventListener('icegatheringstatechange', () => pc.iceGatheringState === 'complete' && resolve());
      setTimeout(resolve, 5000);
    });
  }

  wireChannel(dc, role) {
    dc.onopen = () => this.open({ send: (x) => dc.send(x) }, role);
    dc.onmessage = (e) => this.receive(e.data);
    dc.onclose = () => this.lost();
  }
}
