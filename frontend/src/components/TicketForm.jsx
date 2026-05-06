
import { useState } from "react";
import { submitTicket } from "../services/api";

export default function TicketForm() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await submitTicket(form);
      setSuccess(res.data);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Support Center</h1>
          <p className="text-gray-400 mt-2">Submit your ticket — AI will respond instantly</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-900 border border-green-500 rounded-lg p-4 mb-6">
            <p className="text-green-300 font-semibold">✅ Ticket submitted successfully!</p>
            <p className="text-green-400 text-sm mt-1">Ticket ID: {success.data?.id}</p>
            <p className="text-green-400 text-sm">Our AI is processing your request...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300">❌ {error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-gray-300 text-sm font-medium block mb-1">Full Name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} required
                placeholder="Rahul Sharma"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium block mb-1">Email</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required
                placeholder="rahul@example.com"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium block mb-1">Subject</label>
              <input
                type="text" name="subject" value={form.subject}
                onChange={handleChange} required
                placeholder="Payment not processed"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium block mb-1">Message</label>
              <textarea
                name="message" value={form.message}
                onChange={handleChange} required rows={4}
                placeholder="Describe your issue in detail..."
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}