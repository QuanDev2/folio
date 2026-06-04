import { createPortal } from 'react-dom'
import React, { useRef } from 'react'
import type { Photo } from '../../types'
import type { RefObject } from 'react'

interface Props {
  photos: Photo[]
  currIdx: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

export default function Lightbox({
  photos,
  currIdx,
  onClose,
  onNext,
  onPrev,
  triggerRef
}: Props) {
  const photo = photos[currIdx]

  const handleOnKeydown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        triggerRef.current?.focus()
        onClose()
        break
      case 'ArrowRight':
        onNext()
        break
      case 'ArrowLeft':
        onPrev()
        break
    }
  }
  return createPortal(
    <div tabIndex={-1} onKeyDown={handleOnKeydown}>
      <img src={photo.url} alt={photo.alt}></img>
      <div>{photo.caption}</div>
      <div className='metadata'>
        <div>Camera: {photo.metaData?.camera}</div>
        <div>Lens: {photo.metaData?.lens}</div>
        <div>Aperture: {photo.metaData?.aperture}</div>
        <div>Shutter Speed: {photo.metaData?.shutterSpeed}</div>
        <div>ISO: {photo.metaData?.iso}</div>
        <div>Focal Length: {photo.metaData?.focalLength}</div>
        <div>Location: {photo.metaData?.location}</div>
        <div>Date Taken: {photo.metaData?.dateTaken}</div>
      </div>
    </div>,
    document.body
  )
}
