"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Service } from "@shared/types";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Zap,
  Wrench,
  Paintbrush,
  Snowflake,
  Bug,
  Home,
  Lock,
  Leaf,
  Blocks,
  Sofa,
  Hammer,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="w-5 h-5" />,
  wrench: <Wrench className="w-5 h-5" />,
  paintbrush: <Paintbrush className="w-5 h-5" />,
  snowflake: <Snowflake className="w-5 h-5" />,
  bug: <Bug className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  lock: <Lock className="w-5 h-5" />,
  leaf: <Leaf className="w-5 h-5" />,
  brick: <Blocks className="w-5 h-5" />,
  sofa: <Sofa className="w-5 h-5" />,
  hammer: <Hammer className="w-5 h-5" />,
};

const iconOptions = [
  { key: "zap", label: "Electric" },
  { key: "wrench", label: "Plumbing" },
  { key: "paintbrush", label: "Painting" },
  { key: "snowflake", label: "AC" },
  { key: "bug", label: "Pest" },
  { key: "home", label: "General" },
  { key: "lock", label: "Lock" },
  { key: "leaf", label: "Garden" },
  { key: "brick", label: "Masonry" },
  { key: "sofa", label: "Furniture" },
  { key: "hammer", label: "Repair" },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    basePrice: 0,
    duration: 60,
    icon: "wrench",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get("/admin/services");
      setServices(data.data.services);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/services/${editingId}`, formData);
        toast.success("Service updated");
      } else {
        await api.post("/admin/services", formData);
        toast.success("Service created");
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchServices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      basePrice: service.basePrice,
      duration: service.duration,
      icon: service.icon,
    });
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await api.delete(`/admin/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", category: "", description: "", basePrice: 0, duration: 60, icon: "wrench" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warmgray-900">Services</h1>
          <p className="text-sm text-warmgray-500 mt-1">Manage available services</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm(); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Service"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 p-6">
          <h2 className="text-sm font-semibold text-warmgray-900 uppercase tracking-wide mb-4">
            {editingId ? "Edit Service" : "New Service"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-warmgray-500 mb-1.5">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-warmgray-500 mb-1.5">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-warmgray-500 mb-1.5">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-warmgray-500 mb-1.5">Base Price (Rs.)</label>
              <input
                type="number"
                required
                min={0}
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-warmgray-500 mb-1.5">Duration (min)</label>
              <input
                type="number"
                required
                min={15}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })}
                className="w-full px-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-warmgray-500 mb-1.5">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: opt.key })}
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors ${
                      formData.icon === opt.key
                        ? "border-primary-500 bg-primary-50 text-primary-600"
                        : "border-warmgray-200 text-warmgray-400 hover:border-warmgray-300"
                    }`}
                    title={opt.label}
                  >
                    {iconMap[opt.key] || <Wrench className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                {editingId ? "Update Service" : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={5} />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services"
          description="Get started by adding your first service."
          action={{ label: "Add Service", href: "#" }}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warmgray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Service</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Duration</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-warmgray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-warmgray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                          {iconMap[service.icon] || <Wrench className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-medium text-warmgray-900">{service.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-warmgray-500">{service.category}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-warmgray-900">Rs. {service.basePrice}</td>
                    <td className="px-5 py-3.5 text-sm text-warmgray-500">{service.duration} min</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-1.5 rounded-lg text-warmgray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-1.5 rounded-lg text-warmgray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
