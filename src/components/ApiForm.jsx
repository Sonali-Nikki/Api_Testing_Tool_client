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

      // Convert headers
      const formattedHeaders = {};
      headers.forEach((h) => {
        if (h.key.trim()) formattedHeaders[h.key] = h.value;
      });

      // Convert params → ?key=value
      const queryString = new URLSearchParams(
        params
          .filter((p) => p.key.trim())
          .reduce((a, p) => ({ ...a, [p.key]: p.value }), {})
      ).toString();

      const finalUrl = queryString ? `${url}?${queryString}` : url;

      // Parse JSON body safely
      let jsonBody = null;
      if (method !== "GET" && body.trim() !== "") {
        try {
          jsonBody = JSON.parse(body);
        } catch {
          alert("❌ Invalid JSON Body");
          return;
        }
      }

      // if (token) {
      //   formattedHeaders["Authorization"] = `Bearer ${token}`;
      // }

      // SEND TO BACKEND PROXY
     
      const res = await fetch("http://localhost:8000/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          url: finalUrl,
          method,
          headers: JSON.parse(headersText || "{}"),
          body: finalBody,
        }),
      });

      const data = await res.json(); // Important: JSON not text
      setResponseData(data);

      // SAVE HISTORY
      await fetch("http://localhost:8000/api/save-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          url,
          method,
          headers: formattedHeaders, // ✓ already an object
          body: jsonBody, // ✓ already parsed JSON
        }),
      });

      // Refresh Sidebar
      // fetchHistory();
    } catch (err) {
      console.error(err);
      alert("❌ Error sending request");
    }
  };

  const saveToCollection = async () => {
    const collectionId = prompt("Enter Collection ID");

    if (!collectionId) return;

    // const token = localStorage.getItem("token");

    await fetch(`http://localhost:8000/api/collections/${collectionId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        method,
        headers: formattedHeaders,
        body: jsonBody,
      }),
    });

    alert("Saved to collection!");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">API Request</h1>

      {/* URL */}
      <input
        type="text"
        placeholder="Enter API URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* METHOD */}
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

      {/* HEADERS */}
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

      {/* PARAMS */}
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

      {/* BODY */}
      <JsonEditor value={body} onChange={(v) => setBody(v)} />

      {/* SEND BUTTON */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        onClick={sendRequest}
      >
        Send Request
      </button>

      {/* SAVE TO COLLECTION BUTTON */}

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
