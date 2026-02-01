import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import UserTable from './components/UserTable';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchUsers = async (page = 1, searchQuery = search, sortColumn = sortBy, sortDir = sortOrder) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/users`, {
        params: {
          page,
          limit: 10,
          search: searchQuery,
          sortBy: sortColumn,
          order: sortDir
        }
      });
      setUsers(response.data.users);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalUsers || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search, sortBy, sortOrder);
  }, [currentPage, sortBy, sortOrder]);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1, search, sortBy, sortOrder);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleUploadSuccess = () => {
    fetchUsers(1);
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      setLoading(true);
      try {
        await axios.delete('http://localhost:5000/users');
        fetchUsers(1);
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">

          <a href="/" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className='customselect'>

          <FileUpload className="customFileselect" onUploadSuccess={handleUploadSuccess} />
        </section>

        <section>
          <UserTable
            users={users}
            currentPage={currentPage}
            totalPages={totalPages}
            totalUsers={totalUsers}
            onPageChange={setCurrentPage}
            loading={loading}
            onClearData={handleClearData}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            search={search}
            onSearchChange={setSearch}
            onSortOrderChange={setSortOrder}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} DataImporter. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
