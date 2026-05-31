import { Routes, Route, Link } from 'react-router-dom'
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
              <div className='flex flex-col items-center gap-6 py-24 text-center'>
                <h1 className='text-4xl font-bold text-zinc-950'>Folio</h1>
                <p className='max-w-md text-zinc-500'>A home for photographers to share their work.</p>
                <Link
                  to='/explore'
                  className='rounded-md bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600'
                >
                  Explore Portfolios
                </Link>
              </div>
            </Layout>
          }
        />

        <Route
          path='/explore'
          element={
            <Layout>
              <PostFeed />
            </Layout>
          }
        />

        <Route
          path='/user/:username'
          element={
            <Layout>
              <div>User Portfolio (stub)</div>
            </Layout>
          }
        ></Route>

        <Route
          path='/posts/:slug'
          element={
            <Layout>
              <div>Single post (stub)</div>
            </Layout>
          }
        />
        <Route
          path='/login'
          element={
            <Layout>
              <div>Login (stub)</div>
            </Layout>
          }
        />
        <Route
          path='/editor'
          element={
            <Layout>
              <div>Editor (stub)</div>
            </Layout>
          }
        />
        <Route
          path='/editor/:postId'
          element={
            <Layout>
              <div>Post editor (stub)</div>
            </Layout>
          }
        />
      </Routes>
    </CurrentUserProvider>
  )
}

export default App
