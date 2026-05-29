import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [selectedFile, setSelectedFile] = useState(null);

  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const fetchFiles = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/files/myfiles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(data);

      if (Array.isArray(data)) {
        setFiles(data);
      } else {
        setFiles([]);
      }

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {

    if (!selectedFile) {
      alert("Select a file");
      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      console.log(data);

      alert(data.message);

      fetchFiles();

    } catch (error) {

      console.log(error);

      alert("Upload failed");
    }
  };
  const handleLogout = () => {

  localStorage.removeItem("token");

  navigate("/login");
  };
  
  const handleDelete = async (id) => {

  try {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/files/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    alert(data.message);

    fetchFiles();

  } catch (error) {

    console.log(error);
  }
  };
  return (

    <div style={{ padding: "40px" }}>

      <h1>Secure Dashboard</h1>      
      <button onClick={handleLogout}>
       Logout
      </button>

      <input
        type="file"
        onChange={handleFileChange}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload File
      </button>

      <hr />

      <h2>My Files</h2>

      {
        Array.isArray(files) &&
        files.map((file) => (

          <div
            key={file.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >

            <p>{file.filename}</p>
             <button
              onClick={() => handleDelete(file.id)}
              >
              Delete
              </button>
            <a
              href={`http://localhost:5000/${file.filepath}`}
              target="_blank"
              rel="noreferrer"
            >
              Open File
            </a>

          </div>
        ))
      }

    </div>
  );
}

export default Dashboard;