import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  console.log("appHost", process.env.REACT_APP_API_BASE_URL);
  const apiEndPoint = process.env.REACT_APP_API_BASE_URL || "/api";

  useEffect(() => {
    // Fetch users from the backend API
    axios
      .get(`${apiEndPoint}/users`)
      .then((response) => {
        console.log("response:", response);
        setUsers(response.data); // Update state with fetched users
      })
      .catch((error) => {
        console.error("There was an error fetching the users:", error);
      });
  }, []);

  const handleAddUser = (event) => {
    event.preventDefault();
    // Send a POST request to create a new user
    axios
      .post(`${apiEndPoint}/users`, { name })
      .then((response) => {
        setUsers([...users, response.data]); // Update users list
        setName(""); // Reset the input field
      })
      .catch((error) => {
        console.error("There was an error adding the user:", error);
      });
  };

  return (
    <div className="App container my-5">
      <div className="text-center mb-4">
        <h1 className="display-4 text-primary">Three-Tier App</h1>
        <h3>
          React + Node + Postgres - Deployed to EKS Cluster Successfully
        </h3>
      </div>

      <div className="card shadow-sm p-4 mb-5 bg-white rounded">
        <h2 className="text-center text-secondary">Add a New User</h2>
        <form onSubmit={handleAddUser} className="d-flex justify-content-center mt-4">
          <div className="input-group w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Enter user name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Add User
            </button>
          </div>
        </form>
      </div>

      <div className="card">
      <p style={{marginTop:'14px', marginBottom:'0px'}}>Users List</p>
        {users.length > 0 ? (
          <ul className="list-group mt-3">
            {users.map((user, index) => (
              <li key={index} className="list-group-item">
                {user.name}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted mt-3">
            <p>Loading users...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
