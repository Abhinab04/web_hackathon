import React from "react"
import Register from "./Components/Register/Register"
import Login from "./Components/Login/Login"
import HackathonDashboard from "./Pages/Admin_Dashboard/Admin_Dashboard"
import JudgingDashboard from "./Pages/Faculty_Dashboard/Faculty_dashboard"
import UserDashboard from "./Pages/Student_Dashboard/Student_Dashboard"
import './App.css'

function App() {

  return (
    <div>
      {/* <Register /> */}
      {/* <Login /> */}
      <HackathonDashboard />
      {/* <JudgingDashboard /> */}
      {/* <UserDashboard /> */}
    </div>
  )
}

export default App
