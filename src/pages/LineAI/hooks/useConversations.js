// Gère toutes les conversations sauvegardées
const CONV_KEY = "lineai_conversations";
const ACTIVE_KEY = "lineai_active_conv";

function generateId() {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function generateTitle(firstMessage) {
  const text = firstMessage?.trim() || "Nouvelle conversation";
  return text.length > 40 ? text.slice(0, 40) + "…" : text;
}

export function loadConversations() {
  try {
    const saved = localStorage.getItem(CONV_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveConversations(convs) {
  localStorage.setItem(CONV_KEY, JSON.stringify(convs));
}

export function getActiveId() {
  return localStorage.getItem(ACTIVE_KEY) || null;
}

export function setActiveId(id) {
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function createConversation(firstMessage) {
  const convs = loadConversations();
  const newConv = {
    id: generateId(),
    title: generateTitle(firstMessage),
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const updated = [newConv, ...convs];
  saveConversations(updated);
  setActiveId(newConv.id);
  return newConv;
}

export function updateConversation(id, messages) {
  const convs = loadConversations();
  const updated = convs.map((c) =>
    c.id === id ? { ...c, messages, updatedAt: Date.now() } : c
  );
  saveConversations(updated);
}

export function deleteConversation(id) {
  const convs = loadConversations();
  const updated = convs.filter((c) => c.id !== id);
  saveConversations(updated);
  if (getActiveId() === id) setActiveId(null);
}