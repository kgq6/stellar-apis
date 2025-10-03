// api/_lib/storage.js
// A small storage abstraction: Use Upstash REST if configured, else fall back to in-memory.

const UPSTASH_URL = process.env.UPSTASH_REST_URL || null;
const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN || null;

const inMemory = {
  users: {},   // key -> {key, total, remaining, history:[], created, activeSince}
  chat: []     // {ts, keyMask, text}
};

// helpers for Upstash via REST API
async function upstashGet(key) {
  const url = `${UPSTASH_URL}/string/get/${encodeURIComponent(key)}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }});
  const j = await r.json();
  return j.result ? JSON.parse(j.result) : null;
}
async function upstashSet(key, value) {
  const url = `${UPSTASH_URL}/string/set/${encodeURIComponent(key)}`;
  await fetch(url, { method:'POST', headers:{ Authorization:`Bearer ${UPSTASH_TOKEN}`, 'Content-Type':'application/json' }, body: JSON.stringify({ value: JSON.stringify(value) })});
  return true;
}

// export generic getters/setters for our named keys
export async function getStore(storeKey) {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    const v = await upstashGet(storeKey);
    return v ?? null;
  } else {
    return inMemory[storeKey] ?? null;
  }
}

export async function setStore(storeKey, value) {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    await upstashSet(storeKey, value);
  } else {
    inMemory[storeKey] = value;
  }
}

// convenience wrappers
export async function getUsers() {
  let u = await getStore('users');
  if (!u) { u = {}; await setStore('users', u); }
  return u;
}
export async function saveUsers(u) { await setStore('users', u); }

export async function getChat() {
  let c = await getStore('chat');
  if (!c) { c = []; await setStore('chat', c); }
  return c;
}
export async function saveChat(c) { await setStore('chat', c); }
