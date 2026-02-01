'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
}

export default function ScrollAnimation({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // useLayoutEffect runs before paint - makes above-fold content visible immediately
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
      setIsVisible(true)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [delay])

  const directionClasses = {
    up: 'scroll-animate',
    down: 'scroll-animate',
    left: 'scroll-animate',
    right: 'scroll-animate',
    fade: 'scroll-animate',
  }

  return (
    <div
      ref={ref}
      className={`${directionClasses[direction]} ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
