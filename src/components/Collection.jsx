import { useEffect, useState } from "react";
import { apiGet } from "../api.js";

function Collections({ onSelectCollectionItem }) {
  const [collections, setCollections] = useState([]);
  const [newName, setNewName] = useState("");
  const [items, setItems] = useState([]);

  const fetchCollections = async () => {
    try {
      const data = await apiGet("/collections");
      if (Array.isArray(data)) {
        setCollections(data);
      }
    } catch (err) {
      console.error("Error loading collections:", err);
    }
  };

  const fetchCollectionItems = async(collectionId) => {
    try {
      const data = await apiGet(`/collections/${collectionId}/items`);

      setItems((prev) => ({
        ...prev,
        [collectionId]: data, // store items separately for each collection
      }));
    } catch (err) {
      console.error("Error loading items:", err);
    }
  };

  const addCollection = async () => {
     if (!newName.trim()) return;

    await apiPost("/collections", { name: newName });

    setNewName("");
    fetchCollections();
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="p-3">
      <h2 className="font-bold text-lg mb-3">Collections</h2>

      {/* Input new collection */}
      <div className="flex gap-2 mb-3">
        <input
          className="border p-1 rounded w-full"
          placeholder="New Collection"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 rounded"
          onClick={addCollection}
        >
          +
        </button>
      </div>

      {/* Collection list */}
      {collections.map((col) => (
        <div key={col.id}>
          <p
            className="font-semibold cursor-pointer mb-1"
            onClick={() => fetchCollectionItems(col.id)}
          >
            📂 {col.name}
          </p>

          {/* Items under collection */}
          {items
            .filter((i) => i.collection_id === col.id)
            .map((item) => (
              <div
                key={item.id}
                className="ml-4 p-2 bg-gray-200 rounded mb-1 cursor-pointer"
                onClick={() => onSelectCollectionItem(item)}
              >
                {item.method} {item.url}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default Collections;
