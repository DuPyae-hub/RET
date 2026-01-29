'use client'

import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  description: string | null
  category: string
  imageUrl: string
  subsidiary: string | null
  status?: string | null
}

const categories = [
  'Nationwide Merchandising',
  'Event Management',
  'Building Paint Branding',
  'Vehicle Branding',
  'Signage',
]

const subsidiaries = [
  'RET Advertising',
  'Million Zone',
  'Inner True',
  'Agricultural Friends',
]

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Nationwide Merchandising',
    imageUrl: '',
    subsidiary: 'RET Advertising',
    status: 'ongoing',
  })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setErrorMessage(null)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json().catch(() => null)

      if (!res.ok || !Array.isArray(data)) {
        setProjects([])
        const apiMessage =
          data && typeof data === 'object' && 'error' in data ? String((data as any).error) : null
        setErrorMessage(
          apiMessage ||
            'Could not load projects. If you just set this up, check that DATABASE_URL is configured and the database is reachable.'
        )
        return
      }

      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
      setErrorMessage(
        'Could not load projects. If you just set this up, check that DATABASE_URL is configured and the database is reachable.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
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

    // Upload image only if a new file is selected
    let imageUrl: string | null = null
    if (selectedFile) {
      const uploadedUrl = await handleUpload()
      if (!uploadedUrl) return // Error already shown
      imageUrl = uploadedUrl
    } else if (editingProject) {
      // If editing and no new file selected, use the existing project's imageUrl
      imageUrl = editingProject.imageUrl
    }

    // Require image for new projects
    if (!imageUrl && !editingProject) {
      setFormMessage({ type: 'error', text: 'Please upload an image' })
      return
    }

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'

      // Only include category if subsidiary is RET Advertising
      // Include status for all subsidiaries
      const payload: any = {
        title: formData.title,
        description: formData.description,
        imageUrl,
        subsidiary: formData.subsidiary,
        status: formData.status,
      }
      
      if (formData.subsidiary === 'RET Advertising') {
        payload.category = formData.category
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        fetchProjects()
        resetForm()
        setFormMessage({ type: 'success', text: `Project ${editingProject ? 'updated' : 'created'} successfully.` })
      } else {
        const data = await res.json().catch(() => null)
        const apiMessage =
          data && typeof data === 'object' && 'error' in data ? String((data as any).error) : null
        setFormMessage({
          type: 'error',
          text: apiMessage || `Failed to ${editingProject ? 'update' : 'create'} project.`,
        })
      }
    } catch (error) {
      console.error('Error saving project:', error)
      setFormMessage({
        type: 'error',
        text: `Failed to ${editingProject ? 'update' : 'create'} project.`,
      })
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      category: project.category,
      imageUrl: '', // Don't pre-fill imageUrl since we only use file uploads
      subsidiary: project.subsidiary || 'RET Advertising',
      status: project.status || 'ongoing',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Vehicle Branding',
      imageUrl: '',
      subsidiary: 'RET Advertising',
      status: 'ongoing',
    })
    setEditingProject(null)
    setShowForm(false)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Projects', href: '/admin/projects' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            {showForm ? 'Cancel' : '+ Add Project'}
          </button>
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
              {editingProject ? 'Edit Project' : 'Add New Project'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subsidiary</label>
                  <select
                    value={formData.subsidiary}
                    onChange={(e) => {
                      const newSubsidiary = e.target.value
                      setFormData({ 
                        ...formData, 
                        subsidiary: newSubsidiary,
                        // Clear category if not RET Advertising
                        category: newSubsidiary === 'RET Advertising' ? formData.category : ''
                      })
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {subsidiaries.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.subsidiary === 'RET Advertising' && (
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
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="finished">Finished</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image {selectedFile ? '(New File Selected)' : editingProject ? '(Optional - Upload New Image)' : '(Upload from Device)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {editingProject && !selectedFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    ⓘ Leave empty to keep the current image
                  </p>
                )}
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
                {editingProject && editingProject.imageUrl && !selectedFile && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Current image:</p>
                    <Image
                      src={editingProject.imageUrl}
                      alt="Current"
                      width={200}
                      height={150}
                      className="rounded border border-gray-300 object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : editingProject ? 'Update' : 'Create'} Project
                </button>
                {editingProject && (
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

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12">Loading projects...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={project.imageUrl || 'https://via.placeholder.com/400x300'}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    {project.category && (
                      <span className="text-xs font-semibold text-primary-600 uppercase">
                        {project.category}
                      </span>
                    )}
                    {project.status && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        project.status === 'ongoing' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                    )}
                    {project.subsidiary && (
                      <span className="text-xs text-gray-500">{project.subsidiary}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects yet. Add your first project above!</p>
          </div>
        )}
      </div>
    </div>
  )
}
