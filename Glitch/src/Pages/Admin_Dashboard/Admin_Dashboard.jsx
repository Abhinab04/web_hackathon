import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin_Dashboard.css'
import { windowlistner } from '../../Components/WindowListener/WindowListener';
import axios from 'axios'

const HackathonDashboard = ({
    ongoingHackathonscount,
    upcomingHackathonscount,
    ongoingHackathons = [],
    upcomingHackathons = [],
}) => {

    const [courseName, setcourse] = useState('')
    const [description, setdescription] = useState('')
    const [price, setnumber] = useState('')

    const [position, setposition] = useState({ x: 0, y: 0 });
    const [showModal, setShowModal] = useState(false);
    windowlistner('pointermove', (e) => {
        setposition({ x: e.clientX, y: e.clientY })
    })

    async function submits(event) {
        event.preventDefault();
        setnumber('');
        setdescription('')
        setcourse('');
        setShowModal(false); // Close the modal
        try {
            const response = await axios.post("http://localhost:3000/admin/createCourses", { courseName, description, price })
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({
        oldcourseName: '',
        newcourseName: '',
        description: '',
        price: ''
    });

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/admin/editBatch', editData);
            alert('Course updated successfully!');
            setEditData({
                oldcourseName: '',
                newcourseName: '',
                description: '',
                price: ''
            });
            setEditModal(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update course.');
        }
    };

    return (
        <div className="dashboard">
            <div className="cursor" style={{
                ...styles.cursor,
                transform: `translate(${position.x}px, ${position.y}px)`
            }}></div>
            <div className="sidebar">
                <div className="sidebar-logo">
                    <h1 className='adminssss'>Admin</h1>
                </div>
                <ul className="sidebar-menu">
                    <li><a href='#' className="active">Dashboard</a></li>
                    <li><a href='#'>All Student</a></li>
                    <li><a href='#'>All Faculty</a></li>
                    <li><a href='#'>Profile</a></li>
                    <li><a href='#'>Logout</a></li>
                </ul>
            </div>

            <div className="main-content">
                <div className="dashboard-header">
                    <h2 className='main_header'>Admin Dashboard</h2>
                    <div className="quick-actions">
                        <button className="btn" onClick={() => setShowModal(true)}>Create Course</button>
                        <button className="btn btn-secondary" onClick={() => setEditModal(true)}>Manage Course</button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-value">{ongoingHackathonscount}</div>
                        <div className="stat-card-label">Active Batches</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-value">{upcomingHackathonscount}</div>
                        <div className="stat-card-label">Upcoming Batches</div>
                    </div>
                </div>

                <div className="hackathons-section">
                    <div className="hackathons-list">
                        <h3 className="upcome">Upcoming Batches</h3>
                        {upcomingHackathons.map((hackathon, index) => (
                            <div className="hackathon-item" key={index}>
                                <div className="hackathon-details">
                                    <span className="hackathon-name">{hackathon.Name}</span>
                                    <span className="hackathon-date">{hackathon.StartDate}</span>
                                </div>
                                <span className="hackathon-status status-upcoming">Upcoming</span>
                            </div>
                        ))}
                    </div>

                    <br />

                    <div className="hackathons-list">
                        <h3 className="upcome">Ongoing Batches</h3>
                        {ongoingHackathons.map((hackathon, index) => (
                            <div className="hackathon-item" key={index}>
                                <div className="hackathon-details">
                                    <span className="hackathon-name">{hackathon.Name}</span>
                                    <span className="hackathon-date">{hackathon.StartDate}</span>
                                </div>
                                <span className="hackathon-status status-upcoming">Ongoing</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Pop-up Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Create Course</h2>
                            <form>
                                <label>Course Name:</label>
                                <input type="text" placeholder="Enter Course Name" name="course" id="courseName" value={courseName}
                                    onChange={(e) => setcourse(e.target.value)} required />

                                <label>Course Description:</label>
                                <textarea placeholder="Enter Course Details" name="description" id="description" value={description}
                                    onChange={(e) => setdescription(e.target.value)} required></textarea>

                                <label>Price</label>
                                <input type="number" name="price" id="number" value={price}
                                    onChange={(e) => setnumber(e.target.value)} required />

                                <div className="modal-buttons">
                                    <button type="submit" className="btn" onClick={submits}>Submit</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {editModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Edit Course</h2>
                            <form onSubmit={submitEdit}>
                                <label>Old Course Name:</label>
                                <input
                                    type="text"
                                    name="oldcourseName"
                                    value={editData.oldcourseName}
                                    onChange={handleEditChange} // ✅ missing handler
                                    required
                                />
                                <label>New Course Name:</label>
                                <input
                                    type="text"
                                    name="newcourseName"
                                    value={editData.newcourseName}
                                    onChange={handleEditChange} // ✅ missing handler
                                    required
                                />
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={editData.description}
                                    onChange={handleEditChange} // ✅ missing handler
                                    required
                                />
                                <label>Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={editData.price}
                                    onChange={handleEditChange} // ✅ missing handler
                                    required
                                />

                                <div className="modal-buttons">
                                    <button type="submit" className="btn">Update</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditModal(false)}>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


            </div>

        </div>
    );
};

const styles = {
    cursor: {
        transition: "transform 0.18s ease",
        height: '60px',
        width: '60px',
        borderRadius: '50px',
        position: 'fixed',
        border: "1px solid white",
        pointerEvents: "none",
        left: -30,
        top: -30,
        zIndex: 9999,
        opacity: '0.9',
    },
}

export default HackathonDashboard;