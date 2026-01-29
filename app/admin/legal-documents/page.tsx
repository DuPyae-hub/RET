'use client'

import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Image from 'next/image'
import Link from 'next/link'

interface LegalDocument {
  id: string
  title: string
  description: string | null
  documentUrl: string
  type: string
  createdAt: string
  updatedAt: string
}

const documentTypes = ['Certificate', 'License', 'Registration', 'Other']

export default function AdminLegalDocumentsPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingDocument, setEditingDocument] = useState<LegalDocument | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentUrl: '',
    type: 'Certificate',
  })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  // Auto-add default certificates if none exist (only once, after initial load)
  useEffect(() => {
    if (!loading && documents.length === 0 && !errorMessage) {
      const hasAutoAdded = sessionStorage.getItem('legal-docs-auto-added')
      if (!hasAutoAdded) {
        // Small delay to let the page render first
        setTimeout(() => {
          handleAutoAdd()
          sessionStorage.setItem('legal-docs-auto-added', 'true')
        }, 500)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, documents.length, errorMessage])

  const fetchDocuments = async () => {
    setErrorMessage(null)
    try {
      const res = await fetch('/api/legal-documents')
      const data = await res.json().catch(() => null)

      if (!res.ok || !Array.isArray(data)) {
        setDocuments([])
        const apiMessage =
          data && typeof data === 'object' && 'error' in data ? String((data as any).error) : null
        setErrorMessage(apiMessage || 'Could not load legal documents.')
        return
      }

      setDocuments(data)
    } catch (error) {
      console.error('Error fetching documents:', error)
      setDocuments([])
      setErrorMessage('Could not load legal documents.')
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
        text: error instanceof Error ? error.message : 'Failed to upload document',
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormMessage(null)

    let documentUrl: string | null = null
    if (selectedFile) {
      const uploadedUrl = await handleUpload()
      if (!uploadedUrl) return
      documentUrl = uploadedUrl
    } else if (editingDocument) {
      // If editing and no new file selected, use the existing document's documentUrl
      documentUrl = editingDocument.documentUrl
    }

    if (!documentUrl) {
      setFormMessage({ type: 'error', text: 'Please upload a document' })
      return
    }

    try {
      const url = editingDocument ? `/api/legal-documents/${editingDocument.id}` : '/api/legal-documents'
      const method = editingDocument ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, documentUrl }),
      })

      if (res.ok) {
        fetchDocuments()
        resetForm()
        setFormMessage({
          type: 'success',
          text: `Document ${editingDocument ? 'updated' : 'created'} successfully.`,
        })
      } else {
        const data = await res.json().catch(() => null)
        const apiMessage =
          data && typeof data === 'object' && 'error' in data ? String((data as any).error) : null
        setFormMessage({
          type: 'error',
          text: apiMessage || `Failed to ${editingDocument ? 'update' : 'create'} document.`,
        })
      }
    } catch (error) {
      console.error('Error saving document:', error)
      setFormMessage({
        type: 'error',
        text: `Failed to ${editingDocument ? 'update' : 'create'} document.`,
      })
    }
  }

  const handleEdit = (doc: LegalDocument) => {
    setEditingDocument(doc)
    setFormData({
      title: doc.title,
      description: doc.description || '',
      documentUrl: '', // Don't pre-fill documentUrl since we only use file uploads
      type: doc.type,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const res = await fetch(`/api/legal-documents/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchDocuments()
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      documentUrl: '',
      type: 'Certificate',
    })
    setEditingDocument(null)
    setShowForm(false)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleAutoAdd = async () => {
    setFormMessage(null)
    const wasLoading = loading
    if (!wasLoading) setLoading(true)
    try {
      const res = await fetch('/api/seed/legal-documents', {
        method: 'POST',
      })

      const data = await res.json()

      if (res.ok) {
        if (data.inserted > 0) {
          setFormMessage({
            type: 'success',
            text: `✨ Automatically added ${data.inserted} default certificates!`,
          })
        } else {
          setFormMessage({
            type: 'success',
            text: data.message || 'Certificates already exist.',
          })
        }
        fetchDocuments()
      } else {
        setFormMessage({
          type: 'error',
          text: data.message || data.error || 'Failed to add default certificates',
        })
      }
    } catch (error) {
      console.error('Error auto-adding documents:', error)
      setFormMessage({
        type: 'error',
        text: 'Failed to add default certificates',
      })
    } finally {
      if (!wasLoading) setLoading(false)
    }
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Legal Documents', href: '/admin/legal-documents' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Legal Documents Management</h1>
          <div className="flex gap-3">
            <button
              onClick={handleAutoAdd}
              disabled={loading || documents.length > 0}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Auto-Add Default Certificates
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              {showForm ? 'Cancel' : '+ Add Document'}
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
              {editingDocument ? 'Edit Document' : 'Add New Document'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document {selectedFile ? '(File Selected)' : '(Upload from Device)'}
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {previewUrl && (
                  <div className="mt-3">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={200}
                      height={150}
                      className="rounded border border-gray-300 object-cover"
                    />
                  </div>
                )}
                {editingDocument && editingDocument.documentUrl && !selectedFile && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Current document:</p>
                    <Link
                      href={editingDocument.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      View Document →
                    </Link>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : editingDocument ? 'Update' : 'Create'} Document
                </button>
                {editingDocument && (
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

        {/* Documents List */}
        {loading ? (
          <div className="text-center py-12">Loading documents...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-primary-600 uppercase">{doc.type}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(doc)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                  {doc.description && <p className="text-gray-600 text-sm mb-4">{doc.description}</p>}
                  <Link
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Document →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && documents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No legal documents yet. Add your first document above!</p>
          </div>
        )}
      </div>
    </div>
  )
}
