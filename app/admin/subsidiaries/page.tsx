'use client'

import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'

interface Subsidiary {
  id: string
  name: string
  path: string
  description: string
  imageUrl: string | null
  displayOrder: number
}

export default function AdminSubsidiariesPage() {
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(true)
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingSubsidiary, setEditingSubsidiary] = useState<Subsidiary | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
  })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchSubsidiaries()
  }, [])

  const fetchSubsidiaries = async () => {
    try {
      const res = await fetch('/api/subsidiaries')
      const data = await res.json()
      
      // Handle error response or ensure data is an array
      if (res.ok && Array.isArray(data)) {
        setSubsidiaries(data)
      } else if (data.error) {
        console.error('API Error:', data.error)
        setSubsidiaries([])
      } else {
        // If data is not an array, set empty array
        setSubsidiaries(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching subsidiaries:', error)
      setSubsidiaries([])
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
    if (!selectedFile) return null

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
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
        text: error instanceof Error ? error.message : 'Failed to upload image',
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormMessage(null)

    let imageUrl: string | null = null
    if (selectedFile) {
      const uploadedUrl = await handleUpload()
      if (!uploadedUrl) return
      imageUrl = uploadedUrl
    } else if (editingSubsidiary) {
      // If editing and no new file selected, use the existing subsidiary's imageUrl
      imageUrl = editingSubsidiary.imageUrl || null
    }

    try {
      const url = editingSubsidiary
        ? `/api/subsidiaries/${editingSubsidiary.id}`
        : '/api/subsidiaries'
      const method = editingSubsidiary ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      })

      if (res.ok) {
        setFormMessage({
          type: 'success',
          text: editingSubsidiary ? 'Subsidiary updated successfully!' : 'Subsidiary created successfully!',
        })
        resetForm()
        fetchSubsidiaries()
      } else {
        const error = await res.json()
        setFormMessage({ type: 'error', text: error.error || 'Failed to save subsidiary' })
      }
    } catch (error) {
      setFormMessage({ type: 'error', text: 'Error saving subsidiary' })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      path: '',
      description: '',
      imageUrl: '',
      displayOrder: 0,
    })
    setSelectedFile(null)
    setPreviewUrl(null)
    setEditingSubsidiary(null)
    setShowForm(false)
  }

  const handleEdit = (subsidiary: Subsidiary) => {
    setEditingSubsidiary(subsidiary)
    setFormData({
      name: subsidiary.name,
      path: subsidiary.path,
      description: subsidiary.description || '',
      imageUrl: '', // Don't pre-fill imageUrl since we only use file uploads
      displayOrder: subsidiary.displayOrder,
    })
    setPreviewUrl(null) // Clear preview when editing
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subsidiary?')) return

    try {
      const res = await fetch(`/api/subsidiaries/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setFormMessage({ type: 'success', text: 'Subsidiary deleted successfully!' })
        fetchSubsidiaries()
      } else {
        const error = await res.json()
        setFormMessage({ type: 'error', text: error.error || 'Failed to delete subsidiary' })
      }
    } catch (error) {
      setFormMessage({ type: 'error', text: 'Error deleting subsidiary' })
    }
  }

  if (loading) {
    return (
      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Admin', href: '/admin' },
            { label: 'Subsidiaries', href: '/admin/subsidiaries' },
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading subsidiaries...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Subsidiaries', href: '/admin/subsidiaries' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Subsidiaries</h1>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Add New Subsidiary
          </button>
        </div>

        {formMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              formMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {formMessage.text}
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingSubsidiary ? 'Edit Subsidiary' : 'Add New Subsidiary'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Path *</label>
                  <input
                    type="text"
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="/subsidiary-name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image {selectedFile ? '(File Selected)' : editingSubsidiary ? '(Optional - Upload New Image)' : '(Upload from Device)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  </div>
                )}
                {editingSubsidiary && editingSubsidiary.imageUrl && !previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                    <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
                      <Image src={editingSubsidiary.imageUrl} alt="Current" fill className="object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : editingSubsidiary ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Path
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(subsidiaries) && subsidiaries.length > 0 ? (
                subsidiaries.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sub.imageUrl ? (
                      <div className="relative w-16 h-16">
                        <Image src={sub.imageUrl} alt={sub.name} fill className="object-cover rounded" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{sub.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sub.path}</td>
                  <td className="px-6 py-4 text-gray-500">{sub.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sub.displayOrder}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(sub)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(sub.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No subsidiaries found. Click &quot;Add New Subsidiary&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
