import { useState } from "react";
import JsonEditor from "./AceModel.jsx";
import { useEnv } from "../context/EnvContext.jsx";
import { replaceVars } from "../utils/ReplaceEnvVars.jsx";

function ApiForm({ setResponseData, fetchHistory }) {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("{}");
  const { envs, activeEnvIndex } = useEnv();
  const activeVars = envs[activeEnvIndex].vars;

  const finalUrl = replaceVars(url, activeVars);
  const finalBody = replaceVars(body, activeVars);

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const addParam = () => setParams([...params, { key: "", value: "" }]);

const sendRequest = async () => {
  try {
    const token = localStorage.getItem("token");

    // Format headers
    const formattedHeaders = {};
    headers.forEach((h) => {
      if (h.key.trim()) formattedHeaders[h.key] = h.value;
    });

    if (token) {
      formattedHeaders["Authorization"] = `Bearer ${token}`;
    }

    const queryString = new URLSearchParams(
      params
        .filter((p) => p.key.trim())
        .reduce((a, p) => ({ ...a, [p.key]: p.value }), {})
    ).toString();
    const requestUrl = queryString ? `${url}?${queryString}` : url;

    let jsonBody = null;
    if (method !== "GET" && body.trim() !== "") {
      try {
        jsonBody = JSON.parse(body);
      } catch {
        alert("Invalid JSON Body");
        return;
      }
    }

    // Send to backend proxy
    const res = await fetch("http://localhost:8000/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        url: requestUrl,
        method,
        headers: formattedHeaders,
        body: jsonBody, 
      }),
    });

    const data = await res.json();
    setResponseData(data);

    // Save history
    await fetch("http://localhost:8000/api/save-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        url,
        method,
        headers: formattedHeaders,
        body: jsonBody,
      }),
    });

    fetchHistory();

  } catch (err) {
    console.error(err);
    alert(" Error sending request");
  }
};

const saveToCollection = async () => {
  try {
    const collectionId = prompt("Enter Collection ID");
    if (!collectionId) return;

    const formattedHeaders = {};
    headers.forEach((h) => {
      if (h.key.trim()) formattedHeaders[h.key] = h.value;
    });

    let jsonBody = null;
    if (body.trim() !== "") {
      try {
        jsonBody = JSON.parse(body);
      } catch {
        alert("Invalid JSON Body");
        return;
      }
    }

    await fetch(`http://localhost:8000/api/collections/${collectionId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        method,
        headers: formattedHeaders,
        body: jsonBody,
      }),
    });

    alert("Saved to collection!");
  } catch (err) {
    console.error(err);
    alert("Error saving to collection");
  }
};


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">API Request</h1>

      <input
        type="text"
        placeholder="Enter API URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <select
        className="p-2 border rounded w-full mb-4"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>PATCH</option>
        <option>DELETE</option>
      </select>

      <h2 className="text-lg font-semibold mb-2">Headers</h2>
      {headers.map((h, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            placeholder="Key"
            className="p-2 border rounded w-1/2"
            value={h.key}
            onChange={(e) => {
              const newHeaders = [...headers];
              newHeaders[i].key = e.target.value;
              setHeaders(newHeaders);
            }}
          />
          <input
            placeholder="Value"
            className="p-2 border rounded w-1/2"
            value={h.value}
            onChange={(e) => {
              const newHeaders = [...headers];
              newHeaders[i].value = e.target.value;
              setHeaders(newHeaders);
            }}
          />
        </div>
      ))}
      <button className="text-blue-600 mb-4" onClick={addHeader}>
        + Add Header
      </button>

      <h2 className="text-lg font-semibold mb-2 mt-4">Params</h2>
      {params.map((p, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            placeholder="Key"
            className="p-2 border rounded w-1/2"
            value={p.key}
            onChange={(e) => {
              const newParams = [...params];
              newParams[i].key = e.target.value;
              setParams(newParams);
            }}
          />
          <input
            placeholder="Value"
            className="p-2 border rounded w-1/2"
            value={p.value}
            onChange={(e) => {
              const newParams = [...params];
              newParams[i].value = e.target.value;
              setParams(newParams);
            }}
          />
        </div>
      ))}
      <button className="text-blue-600 mb-4" onClick={addParam}>
        + Add Param
      </button>

      <JsonEditor value={body} onChange={(v) => setBody(v)} />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        onClick={sendRequest}
      >
        Send Request
      </button>

      <button
        className="bg-green-600 text-white w-full mt-2 p-2 rounded"
        onClick={saveToCollection}
      >
        Save to Collection
      </button>
    </div>
  );
}

export default ApiForm;
