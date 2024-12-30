import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleDetail from './pages/api/ArticleDetail.jsx';
import ArticleList from './pages/api/ArticleList.jsx';
import { Button } from '@/components/ui/button';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <header className="border-b">
          <div className="mx-auto max-w-[1200px] flex items-center justify-between px-4 py-4">
            <Link to="/" className="text-2xl font-bold">Brutalist</Link>
            <nav className="space-x-6 text-zinc-600">
              <Link to="/" className="text-sm">Home</Link>
              <Link to="/categories" className="text-sm">Categories</Link>
              <Link to="/shop" className="text-sm">Shop</Link>
              <Link to="/admin" className="text-sm">Admin</Link>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;