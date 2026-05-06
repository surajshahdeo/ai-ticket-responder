import { useState, useEffect } from "react";
import { getTickets } from "../services/api";

const STATUS_COLORS = {
  pending:    "bg-yellow-900 text-yellow-300 border-yellow-700",
  processing: "bg-blue-900 text-blue-300 border-blue-700",
  resolved:   "bg-green-900 text-green-300 border-green-700",
  failed:     "bg-red-900 text-red-300 border-red-700",
};

const CATEGORY_COLORS = {
  billing:   "bg-purple-900 text-purple-300",
  technical: "bg-orange-900 text-orange-300",
  general:   "bg-gray-700 text-gray-300",
  other:     "bg-gray-700 text-gray-300",
};

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", category: "" });
  const [selected, setSelected] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.category) params.category = filter.category;
      const res = await getTickets(params);
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [filter]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">AI Ticket Auto-Responder System</p>
        </div>
        <button onClick={fetchTickets}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {["All", "Pending", "Processing", "Resolved"].map((s) => (
          <div key={s} className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <p className="text-2xl font-bold text-white">
              {s === "All" ? tickets.length :
                tickets.filter(t => t.status === s.toLowerCase()).length}
            </p>
            <p className="text-gray-400 text-sm mt-1">{s}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 text-sm"
        >
          <option value="">All Categories</option>
          <option value="billing">Billing</option>
          <option value="technical">Technical</option>
          <option value="general">General</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No tickets found</div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id}
              onClick={() => setSelected(selected?.id === ticket.id ? null : ticket)}
              className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-gray-600 cursor-pointer transition-all"
            >
              {/* Ticket Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[ticket.status] || STATUS_COLORS.other}`}>
                      {ticket.status}
                    </span>
                    {ticket.category && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[ticket.category] || CATEGORY_COLORS.other}`}>
                        {ticket.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold">{ticket.subject}</h3>
                  <p className="text-gray-400 text-sm mt-1">{ticket.name} · {ticket.email}</p>
                </div>
                <p className="text-gray-500 text-xs ml-4">
                  {new Date(ticket.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>

              {/* Expanded View */}
              {selected?.id === ticket.id && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase mb-2">Customer Message</p>
                    <p className="text-gray-300 text-sm bg-gray-800 rounded-lg p-3">{ticket.message}</p>
                  </div>
                  {ticket.ai_reply && (
                    <div>
                      <p className="text-gray-400 text-xs font-medium uppercase mb-2">🤖 AI Reply</p>
                      <p className="text-green-300 text-sm bg-green-950 rounded-lg p-3 border border-green-900">
                        {ticket.ai_reply}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}