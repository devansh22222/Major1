const ResultCard = ({ item }) => {
  return (
    <div className="mb-4">
      <h5 className="fw-bold mb-3">🦠 {item.disease}</h5>

      <div className="row g-3">
        {item.medicines.map((med, i) => (
          <div key={i} className="col-md-6">
            <div
              className="p-3 h-100 d-flex flex-column"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                background: "#fff"
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <strong>{med.name}</strong>
                <span className="badge bg-success ms-2">
                  {med.group}
                </span>
              </div>

              <div className="mt-2">
                Price: <strong>₹{med.price}</strong>
              </div>

              <div
                className="mt-2 text-muted small"
                style={{ whiteSpace: "pre-line" }}
              >
                {med.details?.replace(/\*\*/g, "")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultCard;