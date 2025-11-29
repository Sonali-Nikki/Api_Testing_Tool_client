import { useEnv } from "../context/EnvContext.jsx";

function EnvSelector() {
  const { envs, activeEnvIndex, setActiveEnvIndex } = useEnv();

  return (
    <select
      className="border p-2"
      value={activeEnvIndex}
      onChange={(e) => setActiveEnvIndex(e.target.value)}
    >
      {envs.map((env, i) => (
        <option key={i} value={i}>
          {env.name}
        </option>
      ))}
    </select>
  );
}

export default EnvSelector;
