import { useState } from "react";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Signup successful. Now login.");
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900">
      <h1 className="text-2xl mb-4 font-bold">Signup</h1>

      <form onSubmit={handleSubmit}>
        <input className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-white"
          placeholder="Name"
          onChange={(e) => setForm({...form, name: e.target.value})}
        />
        <input className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-white"
          placeholder="Email"
          onChange={(e) => setForm({...form, email: e.target.value})}
        />
        <input className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-white"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({...form, password: e.target.value})}
        />
        <button className="bg-blue-600 text-white p-2 w-full rounded">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
