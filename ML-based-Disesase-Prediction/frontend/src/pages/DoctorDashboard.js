import {
  useEffect,
  useState
} from "react";

import {

  getPendingReviewsAPI,

  approveReviewAPI,

  rejectReviewAPI,

  editReviewAPI

} from "../api/doctor.api";


const DoctorDashboard = () => {

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [editingId, setEditingId] =
    useState(null);

  const [doctorResponse,
    setDoctorResponse] =
      useState("");

  const [doctorNotes,
    setDoctorNotes] =
      useState("");



  /* =========================
     FETCH REVIEWS
  ========================= */

  const fetchReviews =
    async () => {

      try {

        const data =
          await getPendingReviewsAPI();

        setReviews(data);

      } catch (error) {

        console.log(error);
      }

      setLoading(false);
    };


  useEffect(() => {

    fetchReviews();

  }, []);




  /* =========================
     APPROVE
  ========================= */

  const handleApprove =
    async (id) => {

      try {

        await approveReviewAPI(id);

        fetchReviews();

      } catch (error) {

        console.log(error);
      }
    };



  /* =========================
     REJECT
  ========================= */

  const handleReject =
    async (id) => {

      try {

        await rejectReviewAPI(id);

        fetchReviews();

      } catch (error) {

        console.log(error);
      }
    };



  /* =========================
     EDIT
  ========================= */

  const handleEdit =
    async (id) => {

      try {

        await editReviewAPI(
          id,
          {
            doctorResponse,
            doctorNotes
          }
        );

        setEditingId(null);

        setDoctorResponse("");

        setDoctorNotes("");

        fetchReviews();

      } catch (error) {

        console.log(error);
      }
    };



  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px"
      }}
    >

      {/* HEADER */}

      <div
        className="d-flex justify-content-between align-items-center mb-4"
      >

        <div>

          <h2
            style={{
              fontWeight: "700"
            }}
          >
            Doctor Dashboard
          </h2>

          <p
            style={{
              color: "#6b7280"
            }}
          >
            Review AI generated responses
          </p>

        </div>


        {/* LOGOUT */}

        <button
          className="btn btn-danger"

          onClick={() => {

            localStorage.removeItem(
              "token"
            );

            localStorage.removeItem(
              "role"
            );

            window.location.href =
              "/login";
          }}
        >
          Logout
        </button>

      </div>



      {/* LOADING */}

      {
        loading && (
          <h5>
            Loading...
          </h5>
        )
      }



      {/* EMPTY */}

      {
        !loading &&
        reviews.length === 0 && (

          <div
            style={{
              background: "#fff",
              padding: "40px",
              borderRadius: "16px",
              border:
                "1px solid #e5e7eb",

              textAlign: "center"
            }}
          >

            <h4>
              No Pending Reviews
            </h4>

          </div>
        )
      }



      {/* REVIEWS */}

      <div className="row g-3">

        {
          reviews.map((review) => (

            <div
              key={review._id}

              className="col-12"
            >

              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "25px",
                  border:
                    "1px solid #e5e7eb"
                }}
              >

                {/* SYMPTOMS */}

                <h5
                  style={{
                    fontWeight: "700"
                  }}
                >
                  Symptoms
                </h5>

                <p>
                  {review.symptoms}
                </p>



                {/* AI RESPONSE */}

                <h5
                  style={{
                    fontWeight: "700"
                  }}
                >
                  AI Response
                </h5>

                <div
                  style={{
                    background: "#f9fafb",
                    padding: "15px",
                    borderRadius: "12px",
                    whiteSpace:
                      "pre-wrap",

                    border:
                      "1px solid #e5e7eb"
                  }}
                >
                  {
                    review.aiResponse
                  }
                </div>



                {/* EDIT AREA */}

                {
                  editingId ===
                  review._id && (

                    <div className="mt-4">

                      <textarea
                        className="form-control mb-3"

                        rows="6"

                        placeholder="Edited response"

                        value={doctorResponse}

                        onChange={(e) =>
                          setDoctorResponse(
                            e.target.value
                          )
                        }
                      />


                      <textarea
                        className="form-control mb-3"

                        rows="3"

                        placeholder="Doctor notes"

                        value={doctorNotes}

                        onChange={(e) =>
                          setDoctorNotes(
                            e.target.value
                          )
                        }
                      />


                      <button
                        className="btn btn-primary"

                        onClick={() =>
                          handleEdit(
                            review._id
                          )
                        }
                      >
                        Save Edit
                      </button>

                    </div>
                  )
                }



                {/* BUTTONS */}

                <div
                  className="d-flex gap-2 mt-4"
                >

                  <button
                    className="btn btn-success"

                    onClick={() =>
                      handleApprove(
                        review._id
                      )
                    }
                  >
                    Approve
                  </button>


                  <button
                    className="btn btn-warning"

                    onClick={() => {

                      setEditingId(
                        review._id
                      );

                      setDoctorResponse(
                        review.aiResponse
                      );
                    }}
                  >
                    Edit
                  </button>


                  <button
                    className="btn btn-danger"

                    onClick={() =>
                      handleReject(
                        review._id
                      )
                    }
                  >
                    Reject
                  </button>

                </div>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
};

export default DoctorDashboard;