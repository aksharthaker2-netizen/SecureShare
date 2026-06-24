import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ShareLinks() {

  const { fileId } = useParams();

  const [links, setLinks] = useState([]);

  const fetchLinks = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/files/shares/${fileId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      setLinks(data);

    } catch (error) {

      ;
    }
  };

  useEffect(() => {

    fetchLinks();

  }, []);

  const handleRevoke = async (shareId) => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/files/shares/${shareId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      alert(data.message);

      fetchLinks();

    } catch (error) {

      ;
    }
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Share Links</h1>

      {
        links.length === 0
          ? (
            <p>No share links found.</p>
          )
          : (
            links.map((link) => (

              <div
                key={link.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                }}
              >

                <p>
                  <strong>Token:</strong>
                  {" "}
                  {link.share_token}
                </p>

                <p>
                  Views:
                  {" "}
                  {link.view_count}
                </p>

                <p>
                  Downloads:
                  {" "}
                  {link.download_count}
                </p>

                <p>
                  Expires:
                  {" "}
                  {
                    link.expires_at
                      ? new Date(
                          link.expires_at
                        ).toLocaleDateString()
                      : "Never"
                  }
                </p>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `http://localhost:5173/share/${link.share_token}`
                    )
                  }
                >
                  Copy Link
                </button>

                {" "}

                <button
                  onClick={() =>
                    handleRevoke(link.id)
                  }
                >
                  Revoke
                </button>

              </div>

            ))
          )
      }

    </div>

  );
}

export default ShareLinks;