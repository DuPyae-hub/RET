'use client'

import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Image from 'next/image'

interface Client {
  id: string
  name: string
  logoUrl: string
  category: string
  subsidiary: string | null
}

const categories = ['Contract Client', 'Campaign Client', 'Other Client']


export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    category: 'Contract Client',
  })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setErrorMessage(null)
    try {
      const res = await fetch('/api/clients')
      const data = await res.json().catch(() => null)

      if (!res.ok || !Array.isArray(data)) {
        setClients([])
        const apiMessage =
          data && typeof data === 'object' && 'error' in data ? String((data as any).error) : null
        setErrorMessage(
          apiMessage ||
            'Could not load clients. If you just set this up, check that DATABASE_URL is configured and the database is reachable.'
        )
        return
      }

      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
      setClients([])
      setErrorMessage(
        'Could not load clients. If you just set this up, check that DATABASE_URL is configured and the database is reachable.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async (): Promise<string | null> => {
    if (!selectedFile) return formData.logoUrl || null

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await res.json()
      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      setFormMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to upload logo',
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormMessage(null)

    let logoUrl = formData.logoUrl
    if (selectedFile) {
      const uploadedUrl = await handleUpload()
      if (!uploadedUrl) return
      logoUrl = uploadedUrl
    }

    if (!logoUrl) {
      setFormMessage({ type: 'error', text: 'Please upload a logo or provide a logo URL' })
      return
    }

    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients'
      const method = editingClient ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, logoUrl }),
      })

      if (res.ok) {
        fetchClients()
        resetForm()
        setFormMessage({ type: 'success', text: `Client ${editingClient ? 'updated' : 'created'} successfully.` })
      } else {
        const data = await res.json().catch(() => null)
        const apiMessage =
          data && typeof data === 'object' && 'error' in data ? String((data as any).error) : null
        setFormMessage({
          type: 'error',
          text: apiMessage || `Failed to ${editingClient ? 'update' : 'create'} client.`,
        })
      }
    } catch (error) {
      console.error('Error saving client:', error)
      setFormMessage({
        type: 'error',
        text: `Failed to ${editingClient ? 'update' : 'create'} client.`,
      })
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      logoUrl: '', // Don't pre-fill - we use file upload only
      category: client.category,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchClients()
      }
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      logoUrl: '',
      category: 'Contract Client',
    })
    setEditingClient(null)
    setShowForm(false)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleSeedClients = async () => {
    if (!confirm('This will add all predefined clients to the database. Continue?')) return

    setFormMessage(null)
    try {
      const res = await fetch('/api/seed/clients', {
        method: 'POST',
      })

      const data = await res.json()

      if (res.ok) {
        setFormMessage({
          type: 'success',
          text: `Successfully seeded clients! Inserted: ${data.inserted}, Skipped: ${data.skipped} (already exist)`,
        })
        fetchClients()
      } else {
        setFormMessage({
          type: 'error',
          text: data.error || 'Failed to seed clients',
        })
      }
    } catch (error) {
      console.error('Error seeding clients:', error)
      setFormMessage({
        type: 'error',
        text: 'Failed to seed clients',
      })
    }
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Clients', href: '/admin/clients' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Client Management</h1>
          <div className="flex gap-3">
            <button
              onClick={handleSeedClients}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              🌱 Seed All Clients
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              {showForm ? 'Cancel' : '+ Add Client'}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            {formMessage && (
              <div
                className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
                  formMessage.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                {formMessage.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo {selectedFile ? '(File Selected)' : '(Upload from Device)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {previewUrl && (
                  <div className="mt-3">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={150}
                      height={100}
                      className="rounded border border-gray-300 object-contain"
                    />
                  </div>
                )}
                {formData.logoUrl && !selectedFile && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Current logo:</p>
                    <Image
                      src={formData.logoUrl}
                      alt="Current"
                      width={150}
                      height={100}
                      className="rounded border border-gray-300 object-contain"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Or provide a logo URL (optional if uploading file):
                </p>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  placeholder="https://example.com/logo.png (optional)"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : editingClient ? 'Update' : 'Create'} Client
                </button>
                {editingClient && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Clients List */}
        {loading ? (
          <div className="text-center py-12">Loading clients...</div>
        ) : (
          <div>
            {categories.map((category) => {
              const categoryClients = clients.filter((c) => c.category === category)
              if (categoryClients.length === 0) return null

              return (
                <div key={category} className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6">{category}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categoryClients.map((client) => (
                      <div
                        key={client.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-24 w-full mb-3">
                          <Image
                            src={client.logoUrl || 'https://via.placeholder.com/150x100'}
                            alt={client.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-sm font-medium text-center mb-2">{client.name}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="flex-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && clients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No clients yet. Add your first client above!</p>
          </div>
        )}
      </div>
    </div>
  )
}
