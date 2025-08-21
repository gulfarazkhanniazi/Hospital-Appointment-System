import { Link } from "react-router-dom";
import {useEffect} from 'react'
import { Parallax } from 'react-parallax';

import { blogData } from "../data/data";

import background from "../assets/images/bg/01.jpg"

import Navbar from "../componants/Navbar";
import FooterFour from "../componants/SmallFooter";

import {AiOutlineCalendar,MdArrowForward,MdOutlineArrowBack} from "../assets/icons/vander"

export default function BlogPage(){
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, []);

    return(
        <>
        <Navbar navClass="defaultscroll sticky" manuClass="navigation-menu nav-right nav-light" logoLight={true}/>
        <section className="position-relative overflow-hidden w-100 " >
            <Parallax
                blur={{ min: 0, max: 0}}
                bgImage={background}
                bgImageAlt="the dog"
                strength={500}
                bgportfolioImgize="100%"
                bgStyle={{with:"auto", height:"100%" }}
                style={{position:"absolute", width:"100%" , height:"100%"}}
            />
            <div className="bg-overlay bg-gradient-overlay-2"></div>
            <div className="bg-half-170 w-100">
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark mt-4">Health Insights & News</h5>
                                <p className="text-white-50 para-desc mx-auto mb-0">Explore tips, health guides, and news to keep you informed and healthy.</p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
              }}>
                        <nav aria-label="breadcrumb" className="d-block">
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
                <div className="row">
                    {blogData.map((item,index)=>{
                        return(
                            <div className="col-lg-4 col-md-6" key={index}>
                                <div className="card blog blog-primary shadow rounded overflow-hidden border-0">
                                    <div className="card-img image position-relative overflow-hidden">
                                        <div className="position-relative overflow-hidden">
                                            <img src={item.image} className="img-fluid" alt=""/>
                                            <div className="card-overlay"></div>
                                        </div>

                                        <div className="blog-tag">
                                            <Link to={`/blogpost/${item.id}`} className="badge bg-light text-dark">{item.tag}</Link>
                                        </div>

                                        <div className="read-more">
                                            <Link to={`/blogpost/${item.id}`} className="text-white title-dark-50">Read More <MdArrowForward className="align-middle ms-1"/></Link>
                                        </div>
                                    </div>

                                    <div className="card-body content p-0">
                                        <div className="p-4">
                                            <Link to={`/blogpost/${item.id}`} className="h5 title text-dark d-block mb-0">{item.title}</Link>
                                            <p className="text-muted mt-2 mb-0">{item.desc}</p>
                                        </div>

                                        <div className="post-meta d-flex justify-content-between p-4 border-top">
                                            <Link to="#" className="text-muted readmore"><AiOutlineCalendar className="me-1 align-middle"/>{item.date}</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="row">
                    <div className="col-12 mt-4 pt-2">
                        <ul className="pagination justify-content-center mb-0">
                            <li className="page-item">
                                <Link className="page-link" to="#" aria-label="Previous">
                                    <span aria-hidden="true"><MdOutlineArrowBack className="fs-5"/></span>
                                </Link>
                            </li>
                            <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                            <li className="page-item active"><Link className="page-link" to="#">2</Link></li>
                            <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                            <li className="page-item">
                                <Link className="page-link" to="#" aria-label="Next">
                                    <span aria-hidden="true"><MdArrowForward className="fs-5"/></span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <FooterFour/>
        </>
    )
}