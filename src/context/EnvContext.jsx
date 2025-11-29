import { createContext, useState, useContext } from "react";

const EnvContext = createContext();

export function EnvProvider({ children }) {
  const [envs, setEnvs] = useState([
    {
      name: "Development",
      vars: { BASE_URL: "https://jsonplaceholder.typicode.com" }
    },
    {
      name: "Production",
      vars: { BASE_URL: "https://api.example.com" }
    }
  ]);

  const [activeEnvIndex, setActiveEnvIndex] = useState(0);

  return (
    <EnvContext.Provider value={{ envs, setEnvs, activeEnvIndex, setActiveEnvIndex }}>
      {children}
    </EnvContext.Provider>
  );
}

export function useEnv() {
  return useContext(EnvContext);
}
