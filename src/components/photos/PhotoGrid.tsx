import PhotoCard from './PhotoCard'
import type { Photo } from '../../types'

export default function PhotoGrid() {
  const photos: Photo[] = [
    {
      id: '1',
      url: 'https://picsum.photos/seed/mountain/800/600',
      alt: 'Snow-capped mountain peak at sunrise',
      caption: 'The summit at golden hour'
    },
    {
      id: '2',
      url: 'https://picsum.photos/seed/forest/800/600',
      alt: 'Dense pine forest with morning fog',
      caption: 'Mist rolling through the pines'
    },
    {
      id: '3',
      url: 'https://picsum.photos/seed/ocean/800/600',
      alt: 'Turquoise ocean waves crashing on shore',
      caption: 'High tide at Crescent Beach'
    },
    {
      id: '4',
      url: 'https://picsum.photos/seed/city/800/600',
      alt: 'City skyline reflected in a river at night',
      caption: 'Downtown lights after midnight'
    },
    {
      id: '5',
      url: 'https://picsum.photos/seed/desert/800/600',
      alt: 'Red sand dunes stretching to the horizon',
      caption: 'Sahara at midday'
    },
    {
      id: '6',
      url: 'https://picsum.photos/seed/waterfall/800/600',
      alt: 'Tall waterfall cascading into a jungle pool',
      caption: 'Hidden falls deep in the rainforest'
    }
  ]
  return (
    <div>
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo}></PhotoCard>
      ))}
    </div>
  )
}
