import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AppShell from './components/Layout/AppShell/AppShell';
import HomePage from './components/HomePage/HomePage';
import LibraryPage from './components/LibraryPage/LibraryPage';
import BookDetailsPage from './components/BookDetailsPage/BookDetailsPage';
import ReaderPage from './components/ReaderPage/ReaderPage';
import MyShelfPage from './components/MyShelfPage/MyShelfPage';
import AboutPage from './components/AboutPage/AboutPage';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import { LibraryProvider } from './context/LibraryContext/LibraryContext';
import { ReaderProvider } from './context/ReaderContext/ReaderContext';

function App() {
  return (
    <BrowserRouter>
      <LibraryProvider>
        <ReaderProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/book/:id" element={<BookDetailsPage />} />
              <Route path="/read/:id" element={<ReaderPage />} />
              <Route path="/my-shelf" element={<MyShelfPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppShell>
        </ReaderProvider>
      </LibraryProvider>
    </BrowserRouter>
  );
}

export default App;
