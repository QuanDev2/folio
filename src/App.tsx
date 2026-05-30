import PhotoGrid from './components/photos/PhotoGrid'

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 border-b border-zinc-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
            Folio
          </p>
          <h1 className="text-4xl font-bold">Welcome to Folio</h1>
          <h2 className="max-w-2xl text-lg text-zinc-600">
            Where your portfolio tells your story
          </h2>
        </header>

        <PhotoGrid></PhotoGrid>
      </main>
    </div>
  )
}

export default App
