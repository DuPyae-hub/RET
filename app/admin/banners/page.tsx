"use client";

import { useState, useEffect, useCallback } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";

interface Banner {
  id: string;
  pageKey: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  sortOrder: number;
  isActive: number;
  createdAt?: string;
  updatedAt?: string;
}

const PAGE_OPTIONS = [
  { value: "home", label: "Home" },
  { value: "ret-advertising", label: "RET Advertising" },
  { value: "million-zone", label: "Million Zone" },
  { value: "nl-truth", label: "NL Truth" },
  { value: "agricultural-friends", label: "Agricultural Friends" },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPage, setFilterPage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    pageKey: "home",
    title: "",
    subtitle: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const url = filterPage ? `/api/banners?pageKey=${encodeURIComponent(filterPage)}` : "/api/banners";
      const res = await fetch(url);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setBanners([]);
        setErrorMessage((data && data.error) || "Could not load banners.");
        return;
      }
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]);
      setErrorMessage("Could not load banners.");
    } finally {
      setLoading(false);
    }
  }, [filterPage]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      return data.url;
    } catch (error) {
      setFormMessage({ type: "error", text: error instanceof Error ? error.message : "Upload failed" });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);
    let imageUrl = formData.imageUrl?.trim() || "";
    if (selectedFile) {
      const url = await handleUpload();
      if (!url) return;
      imageUrl = url;
    } else if (editingBanner) {
      imageUrl = editingBanner.imageUrl || "";
    }
    if (!imageUrl) {
      setFormMessage({ type: "error", text: "Please upload an image (required for new banners; when editing, leave empty to keep current)." });
      return;
    }
    setSaving(true);
    try {
      const url = editingBanner ? `/api/banners/${editingBanner.id}` : "/api/banners";
      const method = editingBanner ? "PUT" : "POST";
      const body = JSON.stringify({
        pageKey: formData.pageKey,
        title: formData.title?.trim() || null,
        subtitle: formData.subtitle?.trim() || null,
        imageUrl,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive,
      });
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormMessage({ type: "error", text: (data as any).error || "Failed to save." });
        return;
      }
      await fetchBanners();
      resetForm();
      setFormMessage({ type: "success", text: editingBanner ? "Banner updated." : "Banner added." });
    } catch (error) {
      setFormMessage({ type: "error", text: "Failed to save banner." });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      pageKey: banner.pageKey,
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl,
      sortOrder: banner.sortOrder ?? 0,
      isActive: banner.isActive !== 0,
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(true);
  };

  const handleDelete = async (banner: Banner) => {
    const countForPage = banners.filter((b) => b.pageKey === banner.pageKey).length;
    const msg =
      countForPage <= 2
        ? countForPage === 1
          ? "This is the only banner for this page. The carousel works best with at least 2. Delete anyway?"
          : "This page would have only 1 banner left. The carousel works best with at least 2. Delete anyway?"
        : "Delete this banner?";
    if (!confirm(msg)) return;
    setDeletingId(banner.id);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/banners/${banner.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        await fetchBanners();
      } else {
        setErrorMessage((data as any).error || "Failed to delete banner.");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      setErrorMessage("Failed to delete banner.");
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      pageKey: "home",
      title: "",
      subtitle: "",
      imageUrl: "",
      sortOrder: 0,
      isActive: true,
    });
    setEditingBanner(null);
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const filteredBanners = filterPage
    ? banners.filter((b) => b.pageKey === filterPage)
    : banners;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Banners", href: "/admin/banners" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F2942]">Page Banners</h1>
            <p className="text-sm text-gray-500 mt-1">Add at least 2 banners per page so the carousel can rotate.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-[#1A4A94] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#143870] transition-colors"
          >
            {showForm ? "Cancel" : "+ Add banner"}
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        {showForm && (
          <div className="card-ret p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#0F2942] mb-4">
              {editingBanner ? "Edit banner" : "New banner"}
            </h2>
            {formMessage && (
              <div
                className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                  formMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {formMessage.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
                  <select
                    value={formData.pageKey}
                    onChange={(e) => setFormData({ ...formData, pageKey: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1A4A94] focus:border-transparent"
                  >
                    {PAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1A4A94] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Overrides default page title on this slide"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1A4A94] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (optional)</label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short line under the title"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1A4A94] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image {selectedFile ? "(new file chosen)" : editingBanner ? "(leave empty to keep current)" : "(required)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {(previewUrl || (editingBanner?.imageUrl && !selectedFile)) && (
                  <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={previewUrl || editingBanner!.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-[#1A4A94] focus:ring-[#1A4A94]"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active (show on site)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploading || saving}
                  className="rounded-lg bg-[#1A4A94] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#143870] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading…" : saving ? "Saving…" : editingBanner ? "Update" : "Create"}
                </button>
                {editingBanner && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by page</label>
          <select
            value={filterPage}
            onChange={(e) => setFilterPage(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#1A4A94] focus:border-transparent"
          >
            <option value="">All pages</option>
            {PAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading banners…</p>
        ) : filteredBanners.length === 0 ? (
          <div className="card-ret p-8 text-center text-gray-500">
            <p>No banners yet.</p>
            <p className="text-sm mt-1">Add a banner above to show images in the hero carousel on each page.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => (
              <div key={banner.id} className="card-ret overflow-hidden">
                <div className="relative w-full h-40 bg-gray-100">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title || banner.pageKey}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-[#1A4A94] uppercase tracking-wide">{banner.pageKey}</p>
                  <p className="font-semibold text-[#0F2942] mt-1 truncate">{banner.title || "—"}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{banner.subtitle || "—"}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(banner)}
                      className="flex-1 rounded bg-[#1A4A94] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#143870]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(banner)}
                      disabled={deletingId === banner.id}
                      className="flex-1 rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === banner.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
