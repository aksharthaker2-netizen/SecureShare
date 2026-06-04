import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FileCard from "../components/FileCard";

function Dashboard() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const fetchFiles = async () => {

    try {
      setLoading(true);
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
      setLoading(false);

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
      setSelectedFile(null);

      if (fileInputRef.current) {
       fileInputRef.current.value = "";
      }

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
 
 
  const handleShare = async (id) => {

  console.log("Share clicked", id);

  try {

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/files/share/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Status:", response.status);

    const data = await response.json();

    console.log("Data:", data);

    alert(data.shareUrl);

  } catch (error) {

    console.log(error);
  }
};
  return (
  <>
    <Navbar />
    <div style={{ padding: "40px" }}>

      <h1>Secure Dashboard</h1>      
      <button onClick={handleLogout}>
       Logout
      </button>

     <input
      type="file"
      ref={fileInputRef}
       onChange={handleFileChange}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload File
      </button>

      <hr />

      <h2>My Files</h2>

{
  loading ? (

    <p>Loading files...</p>

  ) : files.length === 0 ? (

    <p>No files uploaded yet.</p>

  ) : (

    files.map((file) => (

      <FileCard
      key={file.id}
      file={file}
      onDelete={handleDelete}
       onShare={handleShare}
      />

    ))

  )
}
    </div>
    </>
  );
}

export default Dashboard;