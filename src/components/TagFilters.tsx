type TagFiltersProps = {
  tags: string[]
  selectedTag: string
  onTagChange: (tag: string) => void
}

export default function TagFilters({
  tags,
  selectedTag,
  onTagChange,
}: TagFiltersProps) {
  return (
    <div>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`rounded-full px-4 py-2 text-sm ${tag === selectedTag 
            ? 'bg-black text-white' 
            : 'bg-gray-200 text-black'}`}
        >{tag}</button>
      ))}
    </div>
  )
}
