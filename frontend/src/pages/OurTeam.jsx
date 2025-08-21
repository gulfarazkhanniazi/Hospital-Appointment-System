import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import background from "../assets/images/bg/06.jpg";
import cta from "../assets/images/digital/cta.jpg";

import { Parallax } from "react-parallax";
import ModalVideo from "react-modal-video";
import "../../node_modules/react-modal-video/scss/modal-video.scss";

import Navbar from "../componants/Navbar";
import { teamTwoData } from "../data/data";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  MdKeyboardArrowRight,
} from "../assets/icons/vander";
import FooterFour from "../componants/SmallFooter";

export default function OurTeam() {
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
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
          bgportfolioImageize="100%"
          bgStyle={{ with: "auto", height: "100%" }}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        ></Parallax>
        <div className="bg-overlay bg-gradient-overlay-2"></div>
        <div className="bg-half-170 d-table w-100">
          <div className="container">
            <div className="row mt-5 justify-content-center">
              <div className="col-12">
                <div className="title-heading text-center">
                  <p className="text-white-50 para-desc mx-auto mb-0">
                    Our Dedicated Medical Professionals
                  </p>
                  <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                    Meet Our Doctors
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
                    Our Doctors
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
      <section className="section">
        <div className="container">
          <div className="row">
  {teamTwoData.map((item, index) => (
    <div className="col-lg-3 col-md-4 col-12 mt-5" key={index}>
      <div className="card team team-primary text-center">
        <Link to={`/doctor/${item.id}`}>
          <div className="card-img team-image d-inline-block mx-auto rounded-pill avatar avatar-ex-large overflow-hidden">
            <img src={item.image} className="img-fluid" alt={item.name} />
            <div className="card-overlay avatar avatar-ex-large rounded-pill"></div>
            {/* <ul className="list-unstyled team-social mb-0">
              <li className="list-inline-item ms-1">
                <Link to="" className="btn btn-sm btn-pills btn-icon">
                  <FiFacebook className="fea icon-sm fea-social" />
                </Link>
              </li>
              <li className="list-inline-item ms-1">
                <Link to="" className="btn btn-sm btn-pills btn-icon">
                  <FiInstagram className="fea icon-sm fea-social" />
                </Link>
              </li>
              <li className="list-inline-item ms-1">
                <Link to="" className="btn btn-sm btn-pills btn-icon">
                  <FiTwitter className="fea icon-sm fea-social" />
                </Link>
              </li>
            </ul> */}
          </div>
        </Link>

        <div className="content mt-3">
          <Link to={`/doctor/${item.id}`} className="text-dark h5 mb-0 title">
            {item.name}
          </Link>
          <h6 className="text-muted mb-0 fw-normal">{item.title}</h6>
        </div>
      </div>
    </div>
  ))}
</div>

        </div>

        <div className="container mt-100">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="section-title text-center">
                <h6 className="text-primary fw-normal mb-3">
                  Ready to care for you
                </h6>
                <h1 className="title mb-4">
                  Need to consult a doctor? <br /> Book an appointment today.
                </h1>
                <div className="mt-4">
                  <Link to="/bookappointment" className="btn btn-primary">
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section pt-0">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <div className="video-solution-cta position-relative z-index-1">
                <div className="position-relative">
                  <img
                    src={cta}
                    className="img-fluid rounded-md shadow-lg"
                    alt=""
                  />
                  <div className="play-icon">
                    <Link
                      to="#!"
                      onClick={() => setOpen(true)}
                      className="play-btn lightbox"
                    >
                      <i className="mdi mdi-play text-primary rounded-circle bg-white shadow-lg"></i>
                    </Link>
                  </div>
                  <ModalVideo
                    channel="youtube"
                    youtube={{ mute: 0, autoplay: 0 }}
                    isOpen={isOpen}
                    videoId="yba7hPeTSjk"
                    onClose={() => setOpen(false)}
                  />
                </div>
                <div className="content mt-md-4 pt-md-2">
                  <div className="row justify-content-center">
                    <div className="col-lg-12 text-center">
                      <div className="row align-items-center">
                        <div className="col-md-6 mt-4 pt-2">
                          <div className="section-title text-md-start">
                            <h6 className="text-white-50 fw-normal">
                              About Our Clinic
                            </h6>
                            <h4 className="title text-white title-dark mb-0">
                              Compassionate Healthcare <br /> for You & Your Family
                            </h4>
                          </div>
                        </div>

                        <div className="col-md-6 col-12 mt-4 pt-md-2">
                          <div className="section-title text-md-start">
                            <p className="text-white-50 para-desc">
                              We offer advanced medical care with a personal touch. Our doctors are here to help you stay healthy and informed.
                            </p>
                            <Link to="/aboutus" className="text-white title-dark">
                              Learn More <MdKeyboardArrowRight />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="feature-posts-placeholder bg-primary"></div>
        </div>
      </section>
      <FooterFour />
    </>
  );
}
