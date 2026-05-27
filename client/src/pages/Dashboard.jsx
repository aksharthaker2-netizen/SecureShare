import { useState } from "react";

function Dashboard() {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

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

    } catch (error) {

      console.log(error);

      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <h1>Secure Dashboard</h1>

      <input
        type="file"
        onChange={handleFileChange}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload File
      </button>

    </div>
  );
}

export default Dashboard;