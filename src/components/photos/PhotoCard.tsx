import type { Photo } from "../../types"

interface Props {
  photo: Photo
}

export default function PhotoCard({ photo}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <img
        src={photo.url}
        alt={photo.alt}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-col gap-3 p-4">
        <div className="text-base font-semibold text-zinc-950">{photo.caption}</div>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
            {photo.tags?.[0]}
          </span>
          <span className="text-xs text-zinc-500">
            {photo.metaData?.dateTaken}
          </span>
        </div>
      </div>
    </div>
  )
}
