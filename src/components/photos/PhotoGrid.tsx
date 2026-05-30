import PhotoCard from './PhotoCard'
import type { Photo } from '../../types'
import TagFilters from '../TagFilters'
import { useState } from 'react'
import photosData from '../../data/photos.json'
import SearchInput from '../SearchInput'

export default function PhotoGrid() {
  const photos = photosData as Photo[]
  const tags = ['All', ...Array.from(new Set(photos.flatMap(photo => photo.tags ?? [])))]
  console.log(tags)
  // States
  const [selectedTag, setSelectedTag] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPhotos = photos.filter((photo) => {
    console.log(searchQuery)
    if (selectedTag === 'All' && searchQuery === '') return true
  
    return photo.tags?.includes(selectedTag)
      || photo.caption?.includes(searchQuery)
  })  

  return (
    <div>
      <div id='filters'>
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
      { filteredPhotos.map((photo) => <PhotoCard key={photo.id} photo={photo}></PhotoCard>
      )}
    </div>
  )
}
