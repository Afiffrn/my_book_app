import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// eslint-disable-next-line react/prop-types
const BookList = ({ handleLogout }) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editedBook, setEditedBook] = useState({});
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    year: "",
    description: "",
    category_id: null,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch books from API
  const fetchBooks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBooks(data.data.books);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        Swal.fire("Error", "Failed to fetch books. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred during fetching books.", "error");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      Swal.fire("Error", "An error occurred during fetching categories.", "error");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const totalPages = Math.ceil(books.length / itemsPerPage);
  const paginatedBooks = books.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle add book
  const handleAddBook = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        Swal.fire("Success", "Book has been added successfully", "success");
        fetchBooks();
        setNewBook({
          title: "",
          author: "",
          year: "",
          description: "",
          category_id: null,
        });
      } else {
        Swal.fire("Error", "Failed to add book. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle edit book
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setEditedBook(book);
  };

  // Handle save book
  const handleSave = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/books/${selectedBook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedBook),
      });

      if (response.ok) {
        Swal.fire("Success", "Book has been updated successfully", "success");
        fetchBooks();
        setSelectedBook(null);
      } else {
        Swal.fire("Error", "Failed to update book. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Handle delete book
  const handleDeleteBook = async (bookId) => {
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
          const response = await fetch(`http://127.0.0.1:5000/api/books/${bookId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            Swal.fire("Deleted!", "Book has been deleted successfully", "success");
            fetchBooks();
          } else {
            Swal.fire("Error", "Failed to delete book. Please try again later.", "error");
          }
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  return (
    <div className="container mx-auto my-4">
      {/* Add Book Form */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-6">Add Book</h3>
        <form className="bg-white p-6 rounded shadow-md" onSubmit={handleAddBook}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                placeholder="Year"
                value={newBook.year}
                onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>
            <select
              value={newBook.category_id}
              onChange={(e) => setNewBook({ ...newBook, category_id: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option> ))}
            </select>
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              ></textarea>
            </div>
            <button
              type="submit"
              className="col-span-2 mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>

      {/* Book List */}
      <h2 className="text-3xl font-bold mb-4">BookList</h2>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paginatedBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white p-4 rounded shadow-md border hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Year: {book.year}</p>
              <p>Category: {book.category_name}</p>
              <p>Description: {book.description}</p>
              <div className="flex justify-between items-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleEditBook(book)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No books available.</p>
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

      {/* Edit Book Modal */}
      {selectedBook && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md border">
            <h3 className="text-xl font-bold mb-4">Edit Book</h3>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label htmlFor="title" className="block font-bold mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editedBook.title}
                  onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
                  className="border p-2 mb-4 w-full"
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={editedBook.author}
                  onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
                  className="border p-2 mb-4 w-full"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={editedBook.year}
                  onChange={(e) => setEditedBook({ ...editedBook, year: e.target.value })}
                  className="border p-2 mb-4 w-full"
                />
                <select
                  value={editedBook.category_id}
                  onChange={(e) => setEditedBook({ ...editedBook, category_id: e.target.value })}
                  className="border p-2 mb-4 w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <textarea id="description"
                  placeholder="Description"
                  value={editedBook.description}
                  onChange={(e) => setEditedBook({ ...editedBook, description: e.target.value })}
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
                    onClick={() => setSelectedBook(null)}
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

export default BookList;
