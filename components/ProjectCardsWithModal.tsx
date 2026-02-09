'use client'

import { useState } from 'react'
import Image from 'next/image'
import ScrollAnimation from './ScrollAnimation'

export type ProjectItem = {
  id: string
  title: string
  description: string | null
  category?: string | null
  imageUrl: string
  status?: string | null
}

interface ProjectCardsWithModalProps {
  projects: ProjectItem[]
  accent: string
}

export default function ProjectCardsWithModal({ projects, accent }: ProjectCardsWithModalProps) {
  const [detailProject, setDetailProject] = useState<ProjectItem | null>(null)

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects to display at this time. Check back soon!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project, index) => (
          <ScrollAnimation key={project.id} direction="up" delay={100 + index * 50}>
            <div className="card-ret overflow-hidden group hover-lift flex flex-col h-full">
              <div className="relative h-56 w-full overflow-hidden flex-shrink-0">
                <Image
                  src={
                    project.imageUrl ||
                    'https://via.placeholder.com/400x300?text=Project+Image'
                  }
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {project.status && (
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        project.status === 'ongoing'
                          ? 'bg-[#059669] text-white'
                          : project.status === 'finished'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-500 text-white'
                      }`}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 md:p-6 flex flex-col flex-1">
                {project.category && (
                  <span
                    className="text-xs font-semibold uppercase px-3 py-1 rounded-full inline-block mb-2 w-fit"
                    style={{
                      backgroundColor: `${accent}20`,
                      color: accent,
                    }}
                  >
                    {project.category}
                  </span>
                )}
                <h3 className="text-base md:text-lg font-semibold mb-2 text-[#0F2942]">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-1">
                    {project.description}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setDetailProject(project)}
                  className="mt-4 w-full py-2.5 px-4 rounded-[12px] text-sm font-semibold transition-colors border-2 border-[#1A4A94] text-[#1A4A94] bg-white hover:bg-[#1A4A94] hover:text-white"
                >
                  View detail
                </button>
              </div>
            </div>
          </ScrollAnimation>
        ))}
      </div>

      {/* Popup modal */}
      {detailProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDetailProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
        >
          <div
            className="card-ret w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52 w-full flex-shrink-0 overflow-hidden bg-[#F8F9FA]">
              <Image
                src={
                  detailProject.imageUrl ||
                  'https://via.placeholder.com/400x300?text=Project+Image'
                }
                alt={detailProject.title}
                fill
                className="object-cover"
              />
              {detailProject.status && (
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      detailProject.status === 'ongoing'
                        ? 'bg-[#059669] text-white'
                        : detailProject.status === 'finished'
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-500 text-white'
                    }`}
                  >
                    {detailProject.status.charAt(0).toUpperCase() +
                      detailProject.status.slice(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {detailProject.category && (
                <span
                  className="text-xs font-semibold uppercase px-3 py-1 rounded-full inline-block mb-2"
                  style={{
                    backgroundColor: `${accent}20`,
                    color: accent,
                  }}
                >
                  {detailProject.category}
                </span>
              )}
              <h2 id="project-detail-title" className="text-xl font-semibold text-[#0F2942] mb-3">
                {detailProject.title}
              </h2>
              {detailProject.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {detailProject.description}
                </p>
              )}
            </div>
            <div className="p-4 border-t border-[#E9ECEF] flex justify-end">
              <button
                type="button"
                onClick={() => setDetailProject(null)}
                className="py-2 px-5 rounded-[12px] text-sm font-semibold bg-[#1A4A94] text-white hover:bg-[#0F2942] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
