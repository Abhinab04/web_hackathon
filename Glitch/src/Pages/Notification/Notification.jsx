import React, { useState, useEffect } from 'react';
import './Notifications.css'; // Optional styling

const Notifications = () => {
  // Dummy notification data (replace with real API call later)
  const dummyNotifications = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    message: `Notification #${i + 1}: This is a sample message.`,
    date: new Date().toLocaleDateString(),
  }));

  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Simulate API call
    setNotifications(dummyNotifications);
  }, []);

  // Pagination Logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = notifications.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      <ul className="notification-list">
        {currentItems.map((note) => (
          <li key={note.id} className="notification-item">
            <p>{note.message}</p>
            <span className="date">{note.date}</span>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={index + 1 === currentPage ? 'active' : ''}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Notifications;
