import PhotoCard from './PhotoCard'
import type { Photo } from '../../types'
import TagFilters from '../TagFilters'
import { useState } from 'react'
import photosData from '../../data/photos.json'
import SearchInput from '../SearchInput'

export default function PhotoGrid() {
  const photos = photosData as Photo[]
  const tags = ['All', ...Array.from(new Set(photos.flatMap(photo => photo.tags ?? [])))]

  // States
  const [selectedTag, setSelectedTag] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPhotos = photos.filter((photo) => {
    const matchesTag = selectedTag === 'All' || photo.tags?.includes(selectedTag)
    const matchesSearch = searchQuery === ''
      || photo.caption?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTag && matchesSearch
  })  

  return (
    <div className="flex flex-col gap-6">
      <div
        id="filters"
        className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between"
      >
        <SearchInput
          searchQuery={searchQuery} 
          onSearchQueryChange={setSearchQuery}
          ></SearchInput>
        <TagFilters
          tags={tags}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          ></TagFilters>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-600">
          Showing <span className="font-medium text-zinc-950">{filteredPhotos.length}</span> photos
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPhotos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo}></PhotoCard>
        ))}
      </div>
    </div>
  )
}
