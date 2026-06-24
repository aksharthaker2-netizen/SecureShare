import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SharedFile() {

  const { token } = useParams();
  const [error, setError] =
  useState("");

  const [file, setFile] = useState(null);

  useEffect(() => {

    fetchSharedFile();

  }, []);

  const fetchSharedFile = async () => {

  try {

    const response = await fetch(
      `http://localhost:5000/api/share/${token}`
    );

    if (!response.ok) {

      const data =
        await response.json();

      setError(data.message);

      return;
    }

    const data = await response.json();

    setFile(data);

  } catch (error) {

    ;
  }
};
if (error) {

  return (
    <h2>
      {error}
    </h2>
  );
}
  
  if (!file) {
    return <h2>Loading...</h2>;
  }

  return (
  <div
    style={{
      padding: "40px",
      maxWidth: "600px",
      margin: "auto",
    }}
  >

    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
      }}
    >

      <h1>Shared File</h1>

      <hr />

      <h3>{file.filename}</h3>
      <p>
         Views: {file.view_count}
        </p>
      <p>
        This file was shared with you.
      </p>

      <a
        href={`http://localhost:5000/${file.filepath}`}
        target="_blank"
        rel="noreferrer"
      >
        <a
        href={`http://localhost:5000/api/download/${token}`}
      >
        Download File
      </a>
      </a>

    </div>

  </div>
);
}

export default SharedFile;