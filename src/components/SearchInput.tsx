type SearchInputProps = {
  searchQuery: string
  onSearchQueryChange: (query: string) => void
}

export default function SearchInput({
  searchQuery,
  onSearchQueryChange,
}: SearchInputProps) {
  console.log(searchQuery)

  return (
    <div>
      <label htmlFor="photo-search">Search Caption</label>
      <input
        id="photo-search"
        type="text"
        placeholder="Search by caption"
        onChange={(e) => {
          searchQuery = e.target.value
          onSearchQueryChange(searchQuery)
        }}
      ></input>
    </div>
  )
}