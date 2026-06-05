import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SharedFile() {

  const { token } = useParams();

  const [file, setFile] = useState(null);

  useEffect(() => {

    fetchSharedFile();

  }, []);

  const fetchSharedFile = async () => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/share/${token}`
      );

      const data = await response.json();

      setFile(data);

    } catch (error) {

      console.log(error);
    }
  };

  if (!file) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>

      <h1>Shared File</h1>

      <h3>{file.filename}</h3>

      <a
        href={`http://localhost:5000/${file.filepath}`}
        target="_blank"
        rel="noreferrer"
      >
        Open File
      </a>

    </div>
  );
}

export default SharedFile;