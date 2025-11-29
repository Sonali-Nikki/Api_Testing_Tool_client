import React, { useEffect, useState } from "react";
import { apiGet } from "../api.js";

function Sidebar({onSelect}) {
    const [history, setHistory] = useState([]);


  const fetchHistory = async () => {
    try {
      const data = await apiGet("/history");

      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        console.error("History API did not return an array:", data);
      }
    } catch (error) {
      console.error("History fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4 h-fit">
      <h2 className="text-xl font-semibold mb-4">History</h2>
      <div className="space-y-2">
        {history.length === 0 && (
          <p className="text-gray-500 text-sm">No history yet…</p>
        )}

        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="p-2 bg-gray-200 text-wrap rounded cursor-pointer hover:bg-gray-300"
          >
            <strong>{item.method}</strong> — {item.url}
            <p className="text-xs text-wrap text-gray-500">{item.created_at}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Collections</h2>
      <div className="space-y-2">
        <div className="p-2 bg-gray-200 rounded">Auth APIs</div>
        <div className="p-2 bg-gray-200 rounded">User APIs</div>
      </div>
    </div>
  );
}

export default Sidebar;
