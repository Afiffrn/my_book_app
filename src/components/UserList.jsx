import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// eslint-disable-next-line react/prop-types
const UserList = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [editedUser , setEditedUser ] = useState({});
  const [newUser , setNewUser ] = useState({
    username: "",
    password: "",
    fullname: "",
    status: "",
    level_id: null,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch users from API
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        Swal.fire("Error", "Failed to fetch users. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred during fetching users.", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle add user
  const handleAddUser  = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser ),
      });

      if (response.ok) {
        Swal.fire("Success", "User  has been added successfully", "success");
        fetchUsers();
        setNewUser ({
          username: "",
          password: "",
          fullname: "",
          status: "",
          level_id: null,
        });
      } else {
        Swal.fire("Error", "Failed to add user. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle edit user
  const handleEditUser  = (user) => {
    setSelectedUser (user);
    setEditedUser (user);
  };

  // Handle save user
  const handleSave = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${selectedUser .id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser ),
      });

      if (response.ok) {
        Swal.fire("Success", "User  has been updated successfully", "success");
        fetchUsers();
        setSelectedUser (null);
      } else {
        Swal.fire("Error", "Failed to update user. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle delete user
  const handleDeleteUser  = async (userId) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            Swal.fire("Deleted!", "User  has been deleted successfully", "success");
            fetchUsers();
          } else {
            Swal.fire("Error", "Failed to delete user. Please try again later.", "error");
          }
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  return (
    <div className="container mx-auto my-4">
      {/* Add User Form */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-6">Add User</h3>
        <form className="bg-white p-6 rounded shadow-md" onSubmit={handleAddUser }>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={newUser .username}
                onChange={(e) => setNewUser ({ ...newUser , username: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={newUser .password}
                onChange={(e) => setNewUser ({ ...newUser , password: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Full Name"
                value={newUser .fullname}
                onChange={(e) => setNewUser ({ ...newUser , fullname: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <input
                type="text"
                id="status"
                name="status"
                placeholder="Status"
                value={newUser .status}
                onChange={(e) => setNewUser ({ ...newUser , status: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
            <div>
              <label htmlFor="level_id" className="block text-sm font-medium text-gray-700">Level ID</label>
              <input
                type="number"
                id="level_id"
                name="level_id"
                placeholder="Level ID"
                value={newUser .level_id}
                onChange={(e) => setNewUser ({ ...newUser , level_id: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
            <button
              type="submit"
              className="col-span-2 mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add User
            </button>
          </div>
        </form>
      </div>

      {/* User List */}
      <h2 className="text-3xl font-bold mb-4">UserList</h2>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded shadow-md border hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">{user.username}</h3>
              <p>Full Name: {user.fullname}</p>
              <p>Status: {user.status}</p>
              <p>Level ID: {user.level_name}</p>
              <div className="flex justify-between items-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleEditUser (user)}
                >
                  Edit
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDeleteUser  (user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No users available.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-4 py-2 mx-2 rounded ${
              pageNumber === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Edit User Modal */}
      {selectedUser  && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md border">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label htmlFor="username" className="block font-bold mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={editedUser .username}
                  onChange={(e) => setEditedUser ({ ...editedUser , username: e.target.value })}
                  className="border p-2 mb-4 w-full"
                />
                <label htmlFor="fullname" className="block font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={editedUser .fullname}
                  onChange={(e) => setEditedUser ({ ...editedUser , fullname: e.target.value })}
                  className="border p-2 mb-4 w-full"
                />
                <label htmlFor="status" className="block font-bold mb-2">Status</label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={editedUser .status}
                  onChange={(e) => setEditedUser ({ ...editedUser , status: e.target.value })}
                  className="border p-2 mb-4 w-full"
                />
                <label htmlFor="level_id" className="block font-bold mb-2">Level ID</label>
                <input
                  type="number"
                  id="level_id"
                  name="level_id"
                  value={editedUser .level_id}
                  onChange={(e) => setEditedUser ({ ...editedUser , level_id: e.target.value })}
                  className="border p-2 mb-4 w-full"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => setSelectedUser (null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;