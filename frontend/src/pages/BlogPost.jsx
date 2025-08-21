import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

import background from "../assets/images/bg/01.jpg";
import blogFallbackImage from "../assets/images/blog/blog.jpg";

import { Parallax } from "react-parallax";
import { blogData } from "../data/data";

import Navbar from "../componants/Navbar";
import FooterFour from "../componants/SmallFooter";

import {
  AiOutlineCalendar,
  MdArrowForward,
} from "../assets/icons/vander";

export default function BlogPost() {
  const { id } = useParams();
  const data = blogData.find((blog) => blog.id === parseInt(id));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  return (
    <>
      <Navbar navClass="defaultscroll sticky" manuClass="navigation-menu nav-right nav-light" logoLight={true} />

      <section className="position-relative overflow-hidden w-100">
        <Parallax
          blur={0}
          bgImage={background}
          strength={500}
          style={{ height: "100%", position: "absolute", top: 0, width: "100%" }}
        />
        <div className="bg-overlay bg-gradient-overlay-2"></div>

        <div className="bg-half-170 w-100">
          <div className="container">
            <div className="row mt-5 justify-content-center text-center">
              <div className="col-lg-10">
                <span className="badge bg-primary">{data?.tag || "Blog"}</span>
                <h5 className="heading fw-semibold text-white title-dark mt-4">
                  {data?.title || "Blog post not found."}
                </h5>

                <ul className="list-inline mb-0 mt-3">
                  <li className="list-inline-item mx-3">
                    <span className="text-white-50 d-block">Author</span>
                    <Link to="#" className="text-white title-dark">Christina Gonzalez</Link>
                  </li>
                  <li className="list-inline-item mx-3">
                    <span className="text-white-50 d-block">Date</span>
                    <span className="text-white title-dark">{data?.date || "Unknown"}</span>
                  </li>
                  <li className="list-inline-item mx-3">
                    <span className="text-white-50 d-block">Read Time</span>
                    <span className="text-white title-dark">8 min read</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center position-absolute bottom-0 start-50 translate-middle-x mb-4">
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                  <li className="breadcrumb-item"><Link to="/">Fronter</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Blog</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              {data ? (
                <>
                  <div className="card border-0 shadow rounded overflow-hidden">
                    <img src={data.image || blogFallbackImage} className="img-fluid" alt="Blog" />
                    <div className="card-body">
                      <p className="text-muted mt-4">{data.desc}</p>
                      <p className="text-muted">
                        This post shares insights and tips related to {data.tag?.toLowerCase()} from our expert contributors.
                      </p>

                      <blockquote className="text-center mx-auto blockquote">
                        <i className="mdi mdi-format-quote-open mdi-48px text-muted opacity-2 d-block"></i>
                        The man who comes back through the door in the wall will never be quite the same as the man who went out.
                        <small className="d-block text-muted mt-2">- Fronter Template</small>
                      </blockquote>

                      <p className="text-muted">We hope you found this article helpful. Keep exploring more!</p>

                      <div>
                        <Link to="#" className="badge badge-link bg-primary ms-1">#Health</Link>
                        <Link to="#" className="badge badge-link bg-primary ms-1">#Medical</Link>
                        <Link to="#" className="badge badge-link bg-primary ms-1">#Appointment</Link>
                      </div>
                    </div>
                  </div>

                  {/* Related News */}
                  <div className="card shadow rounded mt-4">
                    <div className="card-body">
                      <h5 className="card-title mb-0">Related Posts :</h5>
                      <div className="row mt-2">
                        {blogData
                          .filter((item) => item.id !== data.id)
                          .slice(0, 2)
                          .map((item, index) => (
                            <div className="col-lg-6 mt-4 pt-2" key={index}>
                              <div className="card blog blog-primary shadow rounded overflow-hidden border-0">
                                <div className="card-img image position-relative overflow-hidden">
                                  <img src={item.image} className="img-fluid" alt="Blog" />
                                  <div className="card-overlay"></div>
                                  <div className="blog-tag">
                                    <Link to={`/blogpost/${item.id}`} className="badge bg-light text-dark">{item.tag}</Link>
                                  </div>
                                  <div className="read-more">
                                    <Link to={`/blogpost/${item.id}`} className="text-white title-dark-50">
                                      Read More <MdArrowForward className="align-middle ms-1" />
                                    </Link>
                                  </div>
                                </div>

                                <div className="card-body content p-0">
                                  <div className="p-4">
                                    <Link to={`/blogpost/${item.id}`} className="h5 title text-dark d-block mb-0">
                                      {item.title}
                                    </Link>
                                    <p className="text-muted mt-2 mb-0">{item.desc}</p>
                                  </div>
                                  <div className="post-meta d-flex justify-content-between p-4 border-top">
                                    <span className="text-muted readmore">
                                      <AiOutlineCalendar className="me-1 align-middle" /> {item.date}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <h4 className="mb-3">Blog Post Not Found</h4>
                  <p className="text-muted">The blog you're looking for doesn't exist or may have been removed.</p>
                  <Link to="/blogs" className="btn btn-primary mt-3">Go to Blog List</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <FooterFour />
    </>
  );
}
