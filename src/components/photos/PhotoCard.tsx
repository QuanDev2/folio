import type { Photo } from "../../types"

interface Props {
  photo: Photo
}

export default function PhotoCard({ photo}: Props) {
  return (
    <div>
      <img src={photo.url} alt={photo.alt} />
      <div>{photo.caption}</div>
    </div>
  )
}