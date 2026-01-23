'use client'

import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Image from 'next/image'

interface Settings {
  mission: string
  vision: string
  history: string
  attitude: string
  coreValues: string
  officeAddress: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    mission: '',
    vision: '',
    history: '',
    attitude: '',
    coreValues: '',
    officeAddress: 'No. 1168, Min Ye\' Kyaw Swar Road, 6th Quarter, East Dagon Township, Yangon, Myanmar',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [orgChartUrl, setOrgChartUrl] = useState<string | null>(null)
  const [uploadingChart, setUploadingChart] = useState(false)
  const [selectedChartFile, setSelectedChartFile] = useState<File | null>(null)
  const [previewChartUrl, setPreviewChartUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings({
        mission: data.mission || '',
        vision: data.vision || '',
        history: data.history || '',
        attitude: data.attitude || '',
        coreValues: data.coreValues || '',
        officeAddress: data.officeAddress || 'No. 1168, Min Ye\' Kyaw Swar Road, 6th Quarter, East Dagon Township, Yangon, Myanmar',
      })

      // Fetch organization chart
      const chartRes = await fetch('/api/organization-chart')
      const chartData = await chartRes.json()
      setOrgChartUrl(chartData.url || null)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChartFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedChartFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewChartUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChartUpload = async () => {
    if (!selectedChartFile) {
      setMessage({ type: 'error', text: 'Please select a file to upload' })
      return
    }

    setUploadingChart(true)
    setMessage(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedChartFile)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadRes.ok) {
        const error = await uploadRes.json()
        throw new Error(error.error || 'Upload failed')
      }

      const uploadData = await uploadRes.json()

      // Save the URL to settings
      const saveRes = await fetch('/api/organization-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: uploadData.url }),
      })

      if (saveRes.ok) {
        setOrgChartUrl(uploadData.url)
        setSelectedChartFile(null)
        setPreviewChartUrl(null)
        setMessage({ type: 'success', text: 'Organization chart uploaded successfully!' })
      } else {
        throw new Error('Failed to save organization chart URL')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to upload organization chart',
      })
    } finally {
      setUploadingChart(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveIndividual = async (key: keyof Settings) => {
    setSavingKey(key)
    setMessage(null)

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: settings[key] }),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: `${key.charAt(0).toUpperCase() + key.slice(1)} updated successfully!` })
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
      } else {
        const errorData = await res.json()
        setMessage({ type: 'error', text: errorData.error || 'Failed to save setting' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving setting' })
    } finally {
      setSavingKey(null)
    }
  }

  if (loading) {
    return (
      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Admin', href: '/admin' },
            { label: 'Settings', href: '/admin/settings' },
          ]}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading settings...</div>
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
          { label: 'Settings', href: '/admin/settings' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Mission</label>
              <button
                type="button"
                onClick={() => handleSaveIndividual('mission')}
                disabled={savingKey === 'mission'}
                className="text-sm bg-primary-600 text-white px-4 py-1.5 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingKey === 'mission' ? 'Saving...' : 'Save'}
              </button>
            </div>
            <textarea
              value={settings.mission}
              onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              placeholder="Enter the company mission statement"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Vision</label>
              <button
                type="button"
                onClick={() => handleSaveIndividual('vision')}
                disabled={savingKey === 'vision'}
                className="text-sm bg-primary-600 text-white px-4 py-1.5 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingKey === 'vision' ? 'Saving...' : 'Save'}
              </button>
            </div>
            <textarea
              value={settings.vision}
              onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              placeholder="Enter the company vision statement"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Attitude</label>
              <button
                type="button"
                onClick={() => handleSaveIndividual('attitude')}
                disabled={savingKey === 'attitude'}
                className="text-sm bg-primary-600 text-white px-4 py-1.5 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingKey === 'attitude' ? 'Saving...' : 'Save'}
              </button>
            </div>
            <textarea
              value={settings.attitude}
              onChange={(e) => setSettings({ ...settings, attitude: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Enter the company attitude statement"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Core Values</label>
              <button
                type="button"
                onClick={() => handleSaveIndividual('coreValues')}
                disabled={savingKey === 'coreValues'}
                className="text-sm bg-primary-600 text-white px-4 py-1.5 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingKey === 'coreValues' ? 'Saving...' : 'Save'}
              </button>
            </div>
            <textarea
              value={settings.coreValues}
              onChange={(e) => setSettings({ ...settings, coreValues: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              placeholder="Enter the company core values"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">History</label>
              <button
                type="button"
                onClick={() => handleSaveIndividual('history')}
                disabled={savingKey === 'history'}
                className="text-sm bg-primary-600 text-white px-4 py-1.5 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingKey === 'history' ? 'Saving...' : 'Save'}
              </button>
            </div>
            <textarea
              value={settings.history}
              onChange={(e) => setSettings({ ...settings, history: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={6}
              placeholder="Enter the company history"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Office Address</label>
              <button
                type="button"
                onClick={() => handleSaveIndividual('officeAddress')}
                disabled={savingKey === 'officeAddress'}
                className="text-sm bg-primary-600 text-white px-4 py-1.5 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingKey === 'officeAddress' ? 'Saving...' : 'Save'}
              </button>
            </div>
            <input
              type="text"
              value={settings.officeAddress}
              onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter the head office address"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default: No. 1168, Min Ye' Kyaw Swar Road, 6th Quarter, East Dagon Township, Yangon, Myanmar
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? 'Saving All...' : 'Save All Settings'}
            </button>
          </div>
        </form>

        {/* Organization Chart Upload Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Organization Chart</h2>
          
          {orgChartUrl && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Current organization chart:</p>
              <div className="relative w-full h-96 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <Image
                  src={orgChartUrl}
                  alt="Organization Chart"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Organization Chart
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleChartFileChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {previewChartUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="relative w-full h-64 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <Image
                      src={previewChartUrl}
                      alt="Preview"
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleChartUpload}
              disabled={!selectedChartFile || uploadingChart}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingChart ? 'Uploading...' : 'Upload Organization Chart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
