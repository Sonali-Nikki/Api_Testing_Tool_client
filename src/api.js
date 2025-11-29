// api.js
const API_BASE_URL = "http://localhost:8000/api";

// Add token to every request
function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
  };
}

// ----------------------
// GET
// ----------------------
export async function apiGet(path) {
  const res = await fetch(API_BASE_URL + path, {
    method: "GET",
    headers: getHeaders()
  });

  return res.json();
}

// ----------------------
// POST
// ----------------------
export async function apiPost(path, body) {
  const res = await fetch(API_BASE_URL + path, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body)
  });

  return res.json();
}

// ----------------------
// DELETE
// ----------------------
export async function apiDelete(path) {
  const res = await fetch(API_BASE_URL + path, {
    method: "DELETE",
    headers: getHeaders()
  });

  return res.json();
}
