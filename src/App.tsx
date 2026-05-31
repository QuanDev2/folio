import { Routes, Route } from 'react-router-dom'
import PostFeed from './components/posts/PostFeed'
import { CurrentUserProvider } from './context/CurrentUserContext'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-950'>
      <nav className='border-b border-zinc-200 bg-white px-6 py-4 flex items-center justify-between'>
        <span className='font-bold text-teal-700'>Folio</span>
      </nav>
      <main className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <CurrentUserProvider>
      <Routes>
        <Route
          path='/'
          element={
            <Layout>
              <PostFeed />
            </Layout>
          }
        />
      </Routes>
    </CurrentUserProvider>
  )
}

export default App
