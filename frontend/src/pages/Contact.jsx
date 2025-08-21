import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import background from "../assets/images/bg/03.jpg";
import { Parallax } from "react-parallax";
import Navbar from "../componants/Navbar";
import { BsTelephone, FiMail, FiMapPin } from "../assets/icons/vander";
import FooterFour from "../componants/SmallFooter";
import { sendContactMessage } from "../states/ContactStates"; // <-- Import function

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!form.name || !form.email || !form.comments) {
      setError("Name, Email, and Message are required.");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Invalid email format.");
      return;
    }

    setLoading(true);
    const { data, error } = await sendContactMessage({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.comments,
    });
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", comments: "" });
    }
  };

  return (
    <>
      <Navbar
        navClass="defaultscroll sticky"
        manuClass="navigation-menu nav-right nav-light"
        logoLight={true}
      />
      <section className="position-relative overflow-hidden">
        <Parallax
          blur={{ min: 0, max: 0 }}
          bgImage={background}
          bgImageAlt="the dog"
          strength={500}
          bgStyle={{ width: "auto", height: "100%" }}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        ></Parallax>
        <div className="bg-overlay bg-gradient-overlay-2"></div>
        <div className="bg-half-170 d-table w-100">
          <div className="container">
            <div className="row mt-5 justify-content-center">
              <div className="col-12">
                <div className="title-heading text-center">
                  <p className="text-white-50 para-desc mx-auto mb-0">
                    Get in touch !
                  </p>
                  <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                    Contact us
                  </h5>
                </div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <nav aria-label="breadcrumb" className="d-block">
                <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/">Fronter</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Contact us
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <section className="section pb-0">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="p-4 rounded shadow">
                {/* Show Error or Success */}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Your Name <span className="text-danger">*</span>
                        </label>
                        <input
                          name="name"
                          id="name"
                          type="text"
                          className="form-control"
                          placeholder="Name :"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Your Email <span className="text-danger">*</span>
                        </label>
                        <input
                          name="email"
                          id="email"
                          type="email"
                          className="form-control"
                          placeholder="Email :"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label">Subject</label>
                        <input
                          name="subject"
                          id="subject"
                          className="form-control"
                          placeholder="Subject :"
                          value={form.subject}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Comments <span className="text-danger">*</span>
                        </label>
                        <textarea
                          name="comments"
                          id="comments"
                          rows="4"
                          className="form-control"
                          placeholder="Message :"
                          value={form.comments}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="d-grid">
                        <button
                          type="submit"
                          id="submit"
                          name="send"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Sending..." : "Send Message"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Cards and Map remain unchanged */}
        <div className="container mt-100">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12">
              <div className="card border-0 text-center features feature-primary feature-clean">
                <div className="icons bg-lg text-center rounded-lg  mx-auto">
                  <BsTelephone className="icon d-block h3 mb-0" />
                </div>
                <div className="content mt-4 pt-2 px-4">
                  <h5 className="mb-3">Phone</h5>
                  <p className="text-muted">
                    Start working with Fronter that can provide everything
                  </p>
                  <Link to="tel:+152534-468-854" className="link">
                    +152 534-468-854
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12 mt-5 mt-sm-0">
              <div className="card border-0 text-center features feature-primary feature-clean">
                <div className="icons bg-lg text-center rounded-lg  mx-auto">
                  <FiMail className="icon d-block h3 mb-0" />
                </div>
                <div className="content mt-4 pt-2 px-4">
                  <h5 className="mb-3">Email</h5>
                  <p className="text-muted">
                    Start working with Fronter that can provide everything
                  </p>
                  <Link to="mailto:contact@example.com" className="link">
                    contact@example.com
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12 mt-5 mt-lg-0">
              <div className="card border-0 text-center features feature-primary feature-clean">
                <div className="icons bg-lg text-center mx-auto rounded-lg ">
                  <FiMapPin className="icon d-block h3 mb-0" />
                </div>
                <div className="content mt-4 pt-2 px-4">
                  <h5 className="mb-3">Location</h5>
                  <p className="text-muted">
                    C/54 Northwest Freeway, Suite 558, <br />
                    Houston, USA 485
                  </p>
                  <Link
                    to="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39206.002432144705!2d-95.4973981212445!3d29.709510002925988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c16de81f3ca5%3A0xf43e0b60ae539ac9!2sGerald+D.+Hines+Waterwall+Park!5e0!3m2!1sen!2sin!4v1566305861440!5m2!1sen!2sin"
                    className="lightbox text-primary"
                    data-type="iframe"
                    data-group="iframe"
                    data-width="1024px"
                    data-height="576px"
                  >
                    View on Google map
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid mt-100">
          <div className="row">
            <div className="col-12 p-0">
              <div className="card map border-0">
                <div className="card-body p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39206.002432144705!2d-95.4973981212445!3d29.709510002925988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c16de81f3ca5%3A0xf43e0b60ae539ac9!2sGerald+D.+Hines+Waterwall+Park!5e0!3m2!1sen!2sin!4v1566305861440!5m2!1sen!2sin"
                    title="myfram"
                    style={{ border: "0" }}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterFour />
    </>
  );
}
