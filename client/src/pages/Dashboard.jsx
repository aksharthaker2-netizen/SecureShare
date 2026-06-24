import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FileCard from "../components/FileCard";
import "./Dashboard.css";

function Dashboard() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] =useState(null);

  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const fetchStats = async () => {

  const token =
  localStorage.getItem("token");

  const response =
  await fetch(
    "http://localhost:5000/api/files/stats",
    {
      headers: {
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  const data =
  await response.json();

  setStats(data);
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

      

      if (Array.isArray(data)) {
        setFiles(data);
      } else {
        setFiles([]);
      }
      setLoading(false);

    } catch (error) {

      
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchStats();
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

      ;

      alert(data.message);
      setSelectedFile(null);

      if (fileInputRef.current) {
       fileInputRef.current.value = "";
      }

      fetchFiles();
      fetchStats();

    } catch (error) {

      ;

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
    fetchStats();

  } catch (error) {

    ;
  }
  };
 
 
  const handleShare = async (id) => {



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

    

    const data = await response.json();

   

    await navigator.clipboard.writeText(
    data.shareUrl
    );

    alert(
      "Share link copied!"
    );

  } catch (error) {

    ;
  }
};
  return (
  <>
    <Navbar />
    <div className="dashboard-container">

      <div className="dashboard-header">
  <h1>Secure Dashboard</h1>
  <p>Upload, manage and share your files securely</p>
</div> 
<div className="upload-section">

  <label
    htmlFor="file-upload"
    className="choose-file-btn"
  >
    Choose File
  </label>

  <input
    id="file-upload"
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    style={{ display: "none" }}
  />

  <span className="file-name">
    {
      selectedFile
        ? selectedFile.name
        : ""
    }
  </span>

  <button
    className="upload-btn"
    onClick={handleUpload}
  >
    Upload File
  </button>

</div>

      <hr />
  {
  stats && (
    <div className="stats-container">

      <div className="stat-card">
        <h3>Files</h3>
        <p>{stats.total_files}</p>
      </div>

      <div className="stat-card">
        <h3>Views</h3>
        <p>{stats.total_views}</p>
      </div>

      <div className="stat-card">
        <h3>Downloads</h3>
        <p>{stats.total_downloads}</p>
      </div>

    </div>
  )
}
      <h2>My Files</h2>

{
  loading ? (

    <p>Loading files...</p>

  ) : files.length === 0 ? (

    <div className="empty-state">
  <h2>📁</h2>
  <p>No files uploaded yet.</p>
  <p>Upload your first file.</p>
</div>

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