import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar.jsx";
import ApiForm from "./components/ApiForm.jsx";
import ResponseViewer from "./components/ResponseViwer.jsx";
import { useState, useEffect } from "react";
import HistorySaver from "./components/historySaver.jsx";
import Collections from "./components/Collection.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import EnvSelector from "./components/EnvSelector.jsx";
import ApiTester from "./pages/ApiTester.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headersText, setHeadersText] = useState("{}");
  const [bodyText, setBodyText] = useState("{}");
  const [responseData, setResponseData] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch history from backend
  const fetchHistory = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/history", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.log("History error:", err));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

 
  const loadHistoryItem = (item) => {
    setUrl(item.url);
    setMethod(item.method);
    setHeadersText(JSON.stringify(item.headers, null, 2));
    setBodyText(JSON.stringify(item.body, null, 2));
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <div className="h-full w-full grid grid-cols-12 bg-white dark:bg-gray-900 dark:text-white">
              {/* Left Sidebar */}

              <div className="h-fit col-span-2 border-r bg-white overflow-y-auto shadow-sm">
                <Sidebar />

                <ApiTester />

                {/* Pass history */}
                <HistorySaver history={history} onSelect={loadHistoryItem} />
                <Collections onSelectCollectionItem={loadHistoryItem} />
              </div>

              {/* Center API Form */}
              <div className="col-span-6 p-4 h-fit overflow-y-auto  bg-white dark:bg-gray-900 dark:text-white">
                <ApiForm
                  url={url}
                  setUrl={setUrl}
                  method={method}
                  setMethod={setMethod}
                  headersText={headersText}
                  setHeadersText={setHeadersText}
                  bodyText={bodyText}
                  setBodyText={setBodyText}
                  setResponseData={setResponseData}
                  fetchHistory={fetchHistory}
                />
              </div>

              {/* Right Response Viewer */}
              <div className="col-span-4 border-l bg-white dark:bg-gray-800 p-4 overflow-y-auto shadow-sm dark:text-white">
                <ResponseViewer responseData={responseData} />
              </div>
              <EnvSelector />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
