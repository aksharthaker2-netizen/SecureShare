function FileCard({ file, onDelete,onShare }) {

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <h3>{file.filename}</h3>

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
      >
        Open File
      </a>

      <br /><br />

      <button
        onClick={() => onDelete(file.id)}
      >
        Delete
      </button>
      <br /><br />

    <button
    onClick={() => onShare(file.id)}
    >
    Share
    </button>
    </div>
  );
}

export default FileCard;