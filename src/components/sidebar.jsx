import React, { useEffect, useState } from "react";
import { apiGet } from "../api.js";

function Sidebar({ onSelect }) {
  const [history, setHistory] = useState([]);
  const [collections, setCollections] = useState([]);

  const fetchHistory = async () => {
    try {
      const data = await apiGet("/history");
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("History fetch failed:", error);
    }
  };

  const fetchCollections = async () => {
    try {
      const data = await apiGet("/collections");
      setCollections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Collections fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchCollections();
  }, []);

  return (
    <div className="p-4 h-fit">
      <h2 className="text-xl font-semibold mb-4">History</h2>
      <div className="space-y-2">
        {history.length === 0 && <p className="text-gray-500 text-sm">No history yet…</p>}
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
          >
            <strong>{item.method}</strong> — {item.url}
            <p className="text-xs text-gray-500">{item.created_at}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Collections</h2>
      <div className="space-y-2">
        {collections.map((col) => (
          <div
            key={col.id}
            className="p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
          >
            {col.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
