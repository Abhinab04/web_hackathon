import React from 'react';
import './Student_dashboard.css';

const UserDashboard = ({ name, upcomingHackathons = [], ongoingHackathons = [] }) => {
    return (
        <div className="user-dashboard">
            <div className="sidebar">
                <h2>Panel</h2>
                <ul>
                    <li><a href="#">Assignment</a></li>
                    <li><a href="#">Notifications</a></li>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </div>

            <div className="main-content">
                <div className="header">
                    <h1 className='welcome'>Welcome Back!, {name}</h1>
                </div>

                <div className="dashboard-section">
                    <h2>Enrolled Course</h2>
                    <div className="hackathon-list">
                        {upcomingHackathons.map((hackathon, index) => (
                            <div className="hackathon-card" key={index}>
                                <h3>{hackathon.Name}</h3>
                                <p>Ends: {hackathon.EndDate}</p>
                                <a href={`/details/${hackathon.Name}`}><button>View Details</button></a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-section">
                    <h2>All Courses</h2>
                    <div className="hackathon-list">
                        {ongoingHackathons.map((hackathon, index) => (
                            <div className="hackathon-card" key={index}>
                                <h3>{hackathon.Name}</h3>
                                <p>Ends: {hackathon.EndDate}</p>
                                <a href={`/details/${hackathon.Name}`}><button>View Details</button></a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-section">
                    <h2>Assignment Submission</h2>
                    <p className="statusp">Status: <span className="status statusp">Pending</span></p>
                    <button>Submit Now</button>
                </div>

                <div className="dashboard-section">
                    <h2>Notifications</h2>
                    <ul className="notifications">
                        <li>AI Challenge Deadline Extended!</li>
                        <li>New leaderboard rankings are out!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
