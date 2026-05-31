import type { Photo } from "../../types"

interface Props {
  photo: Photo
}

export default function PhotoCard({ photo}: Props) {
  const dateTaken = photo.metaData?.dateTaken
  const formattedDate = dateTaken
    ? new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateTaken))
    : undefined

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <img
        src={photo.url}
        alt={photo.alt}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-col gap-3 p-4">
        <div className="text-base font-semibold text-zinc-950">{photo.caption}</div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
            {photo.tags?.[0]}
          </span>
          {formattedDate && <span>Taken {formattedDate}</span>}
        </div>
      </div>
    </div>
  )
}
