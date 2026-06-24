import { useNavigate } from "react-router-dom";
function FileCard({ file, onDelete,onShare }) {
  const navigate = useNavigate();
  return (
   <div
  style={{
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  }}
>
      <h3>{file.filename}</h3>
      <p>Total Views: {file.total_views}</p>
      <p>
        Uploaded:
        {" "}
        {new Date(file.created_at)
          .toLocaleString()}
      </p>

      <a
  href={`http://localhost:5000/${file.filepath}`}
  target="_blank"
  rel="noreferrer"
  style={{
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    textDecoration: "none"
  }}
>
  Open File
</a>
     <button
  style={{
    backgroundColor: "#ef4444",
    color: "white"
  }}
  onClick={() => onDelete(file.id)}
>
  Delete
</button>

    <button
  style={{
    backgroundColor: "#22c55e",
    color: "white"
  }}
  onClick={() => onShare(file.id)}
>
  Share
</button>
  <button
 onClick={() => {
  console.log("Manage clicked");
  navigate(`/shares/${file.id}`);
}}
>
  Manage Links
</button>
    </div>
  );
}

export default FileCard;