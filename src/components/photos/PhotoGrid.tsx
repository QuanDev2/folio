import PhotoCard from './PhotoCard'
import type { Photo } from '../../types'
import TagFilter from '../TagFilter'
import { useState } from 'react'
import photosData from '../../data/photos.json'

export default function PhotoGrid() {
  const photos = photosData as Photo[]
  const tags = ['All', ...Array.from(new Set(photos.flatMap(photo => photo.tags ?? [])))]
  console.log(tags)
  // States
  const [selectedTag, setSelectedTag] = useState('All')

  const filteredPhotos = photos.filter((photo) => {
    if (selectedTag === 'All') return true
    return photo.tags?.includes(selectedTag)
  })  

  return (
    <div>
      <TagFilter
        tags={tags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      ></TagFilter>
      { filteredPhotos.map((photo) => <PhotoCard key={photo.id} photo={photo}></PhotoCard>
      )}
    </div>
  )
}
