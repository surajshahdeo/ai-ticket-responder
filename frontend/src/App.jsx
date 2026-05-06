import { useState } from "react";
import TicketForm from "./components/TicketForm";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [view, setView] = useState("form");

  return (
    <div>
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex gap-4">
        <button
          onClick={() => setView("form")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === "form"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Submit Ticket
        </button>
        <button
          onClick={() => setView("dashboard")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === "dashboard"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Admin Dashboard
        </button>
      </nav>

      {/* Content */}
      {view === "form" ? <TicketForm /> : <Dashboard />}
    </div>
  );
}