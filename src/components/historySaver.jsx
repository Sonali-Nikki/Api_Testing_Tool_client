import { useEffect, useState } from "react";
import { apiGet } from "../api.js";

function HistorySaver({ onSelect }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/history");

        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          console.error("History API did not return an array:", data);
        }
      } catch (err) {
        console.error("History Saver Error:", err);
      }
    };

    load();
  }, []);

  return (
    <div className=" bg-gray-100 p-4 border-r overflow-y-auto">
      <h2 className="font-bold text-lg mb-3">History</h2>

      {history.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          className="p-2 mb-2 bg-white shadow cursor-pointer rounded hover:bg-gray-200"
        >
          <p className="font-semibold text-sm">
            {item.method} {item.url}
          </p>
          <p className="text-xs text-gray-600">
            {new Date(item.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default HistorySaver;