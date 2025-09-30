"use client"

import React, { useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

type Props = {
  images: string[]
}

export default function EmblaCarousel({ images }: Props) {
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, align: 'center' })
  const autoplayRef = useRef<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Start autoplay when embla is ready
  useEffect(() => {
    if (!embla) return

    // clear any previous interval
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }

    const play = () => {
      if (!embla) return
      try {
        embla.scrollNext()
      } catch {
        // if embla is not ready, stop autoplay
        if (autoplayRef.current) {
          window.clearInterval(autoplayRef.current)
          autoplayRef.current = null
        }
      }
    }

    autoplayRef.current = window.setInterval(play, 3000)

    const onSelect = () => setSelectedIndex(embla.selectedScrollSnap())
    embla.on('select', onSelect)
    onSelect()

    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
      embla.off('select', onSelect)
    }
  }, [embla])

  // Pause on hover/focus
  const pause = () => {
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }
  const play = () => {
    if (!embla) return
    if (autoplayRef.current) return
    autoplayRef.current = window.setInterval(() => embla.scrollNext(), 3000)
  }

  return (
    <div className="embla w-full">
      <style jsx>{`
        .embla { overflow: hidden }
        .embla__container { display: flex; gap: 12px }
        .embla__slide { position: relative; flex: 0 0 80%; max-width: 80%; border-radius: 10px; overflow: hidden }
        @media (min-width: 768px) {
          .embla__slide { flex: 0 0 45%; max-width: 45% }
        }
        /* Ensure no conflicting transitions on images */
        .embla__slide img { transition: transform 350ms ease; }
      `}</style>

      <div
        className="embla__viewport"
        ref={viewportRef}
        onMouseEnter={pause}
        onMouseLeave={play}
        onFocus={pause}
        onBlur={play}
      >
        <div className="embla__container">
          {images.map((img, i) => (
            <div className="embla__slide" key={i}>
              <Image
                src={`/img/${img}`}
                alt={`Slide ${i + 1}`}
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          aria-label="Previous"
          onClick={() => embla && embla.scrollPrev()}
          className="px-3 py-2 rounded bg-[#f3f3f3] hover:bg-[#eee]"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => embla && embla.scrollTo(idx)}
              aria-current={selectedIndex === idx}
              className={`w-2 h-2 rounded-full ${selectedIndex === idx ? 'bg-[#f39c12]' : 'bg-[#ddd]'}`}
              style={{ border: 'none' }}
            />
          ))}
        </div>
        <button
          aria-label="Next"
          onClick={() => embla && embla.scrollNext()}
          className="px-3 py-2 rounded bg-[#f3f3f3] hover:bg-[#eee]"
        >
          ›
        </button>
      </div>
    </div>
  )
}
