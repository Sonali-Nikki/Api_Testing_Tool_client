import { useState } from "react";
import { apiRequest } from "../utils/request.js";
import Spinner from "../components/Spinner.jsx";
import Alert from "../components/Alert.jsx";

export default function ApiTester() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [response, setResponse] = useState(null);

  const handleSend = async () => {
    setLoading(true);
    setAlert(null);
    setResponse(null);

    const result = await apiRequest(url, { method });

    setLoading(false);

    if (!result.success) {
      setAlert({ type: "error", message: result.error });
    } else {
      setAlert({ type: "success", message: "Request successful" });
      setResponse(result.data);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-xl font-bold mb-4">API Request Tester</h1>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <input
        className="border p-2 w-full mb-3"
        placeholder="Enter URL"
        onChange={(e) => setUrl(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-3"
        onChange={(e) => setMethod(e.target.value)}
      >
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>PATCH</option>
        <option>DELETE</option>
      </select>

      <button
        className="bg-blue-600 text-white p-2 rounded w-full"
        onClick={handleSend}
      >
        Send Request
      </button>

      {loading && <Spinner />}

      {response && (
        <pre className="bg-gray-100 p-3 rounded mt-3 overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
