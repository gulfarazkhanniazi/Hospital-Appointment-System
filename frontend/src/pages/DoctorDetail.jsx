import { Link, useParams } from "react-router-dom";
import { useEffect } from 'react'
import Navbar from "../componants/Navbar";
import background from "../assets/images/bg/06.jpg";
import clientImg from "../assets/images/client/10.jpg";

import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiMail,
} from "../assets/icons/vander";
import {
  AiOutlineShoppingCart,
  AiOutlineDribbble,
  AiOutlineBehance,
  AiFillLinkedin,
  AiOutlineTwitter,
  AiOutlineFile,
} from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";

import { teamTwoData } from "../data/data";

import { Parallax } from "react-parallax";
import FooterFour from "../componants/SmallFooter";

export default function DoctorDetail() {
  const { id } = useParams();
  const data = teamTwoData.find((item) => item.id === parseInt(id));

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
          strength={500}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
        <div className="bg-overlay bg-gradient-overlay-2"></div>
        <div className="bg-half-170 d-table w-100">
          <div className="container">
            <div className="row mt-5 justify-content-center">
              <div className="col-12">
                <div className="title-heading text-center">
                  <p className="text-white-50 para-desc mx-auto mb-0">Doctor Name</p>
                  <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                    {data?.name || "Doctor Not Found"}
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
                    Doctor Detail
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {!data ? (
            <div className="text-center py-5">
              <h4 className="mb-3">Doctor Not Found</h4>
              <p className="text-muted">
                The doctor you're looking for doesn't exist or may have been removed.
              </p>
              <Link to="/team" className="btn btn-primary mt-3">
                Go to Doctor List
              </Link>
            </div>
          ) : (
            <div className="row align-items-center">
              <div className="col-lg-5 col-md-6 col-12">
                <div className="card team team-primary team-two text-center">
                  <div className="card-img team-image d-inline-block mx-auto rounded overflow-hidden">
                    <img
                      src={data.image || clientImg}
                      className="img-fluid"
                      alt={data.name}
                    />
                    <div className="card-overlay rounded"></div>
                    <div className="content">
                      <h5 className="text-white title-dark mb-0">{data.name}</h5>
                      <h6 className="text-white-50 mb-0 fw-normal mt-1 designation">
                        {data.title}
                      </h6>
                      <ul className="list-unstyled team-social mb-0 mt-3">
                        <li className="list-inline-item ms-1">
                          <Link to="#" className="btn btn-sm btn-pills btn-icon">
                            <FiFacebook />
                          </Link>
                        </li>
                        <li className="list-inline-item ms-1">
                          <Link to="#" className="btn btn-sm btn-pills btn-icon">
                            <FiInstagram />
                          </Link>
                        </li>
                        <li className="list-inline-item ms-1">
                          <Link to="#" className="btn btn-sm btn-pills btn-icon">
                            <FiTwitter />
                          </Link>
                        </li>
                        <li className="list-inline-item ms-1">
                          <Link to="#" className="btn btn-sm btn-pills btn-icon">
                            <FiLinkedin />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7 col-md-6 col-12 mt-4 pt-2 mt-sm-0 pt-sm-0">
                <div className="section-title ms-lg-5">
                  <h4 className="title">{data.name}</h4>
                  <h6 className="text-primary fw-normal">{data.title}</h6>
                  <p className="text-muted mt-4">
                    Launch your campaign and benefit from our expertise on designing and
                    managing conversion centered bootstrap html page.
                  </p>
                  <p className="text-muted mb-0">
                    It seems that only fragments of the original text remain in the Lorem
                    Ipsum texts used today. One may speculate that over the course of
                    time certain letters were added or deleted at various positions
                    within the text.
                  </p>

                  <ul className="list-unstyled social-icon social mb-0 mt-4">
                    <li className="list-inline-item me-1">
                      <Link to="#" className="rounded">
                        <AiOutlineShoppingCart />
                      </Link>
                    </li>
                    <li className="list-inline-item me-1">
                      <Link to="#" className="rounded">
                        <AiOutlineDribbble />
                      </Link>
                    </li>
                    <li className="list-inline-item me-1">
                      <Link to="#" className="rounded">
                        <AiOutlineBehance />
                      </Link>
                    </li>
                    <li className="list-inline-item me-1">
                      <Link to="#" className="rounded">
                        <AiFillLinkedin />
                      </Link>
                    </li>
                    <li className="list-inline-item me-1">
                      <Link to="#" className="rounded">
                        <BiLogoFacebook />
                      </Link>
                    </li>
                    <li className="list-inline-item me-1">
                      <Link to="#" className="rounded">
                        <FiInstagram />
                      </Link>
                    </li>
                    <li className="list-inline-item me-1">
                      <Link to="#" className="rounded">
                        <AiOutlineTwitter />
                      </Link>
                    </li>
                    <li className="list-inline-item me-1">
                      <Link to="#" className="rounded">
                        <FiMail />
                      </Link>
                    </li>
                    <li className="list-inline-item me-1">
                      <Link to="#" className="rounded">
                        <AiOutlineFile />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {data && (
          <div className="container mt-100">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="section-title text-center">
                  <h6 className="text-primary fw-normal mb-3">
                    Available for Appointments
                  </h6>
                  <h1 className="title mb-4">
                    Do you have a digital project? <br /> Let's talk.
                  </h1>
                  <div className="mt-4">
                    <Link to="/contactus" className="btn btn-primary">
                      Contact us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <FooterFour />
    </>
  );
}
