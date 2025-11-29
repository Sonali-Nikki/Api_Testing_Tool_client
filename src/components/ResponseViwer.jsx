function ResponseViewer({ responseData }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Response</h1>

      <div className="bg-gray-900 text-green-400 p-4 rounded h-lvh overflow-auto font-mono text-sm">
        {!responseData && <p className="text-gray-500">No response yet…</p>}

        {responseData && (
          <pre className="whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto">
            {(() => {
              try {
                if (typeof responseData === "string") {
                  const parsed = JSON.parse(responseData);
                  return JSON.stringify(parsed, null, 2);
                }
                return JSON.stringify(responseData, null, 2);
              } catch {
                return responseData;
              }
            })()}
          </pre>
        )}
      </div>
    </div>
  );
}

export default ResponseViewer;
