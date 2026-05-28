const BASE_URL = import.meta.env.VITE_DEPOSIT_API_URL;

const API_URL = `${BASE_URL}/api/blackai`;

export async function sendMessageToAI(question) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error(`Erreur serveur : ${res.status}`);
  }

  return res.json();
}