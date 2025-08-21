import {useState, useEffect} from "react";
import { Link } from "react-router-dom";

import logo36 from "../assets/images/logo-icon-36.png"
import squareDanger from "../assets/images/square/square-danger.png"
import squareSuccess from "../assets/images/square/square-success.png"
import squarePrimary from "../assets/images/square/square-primary.png";
import bgImg from "../assets/images/startup/01.png"
import BgImg02 from "../assets/images/digital/bg01.jpg"
import about01 from "../assets/images/business/about01.jpg"
import about02 from "../assets/images/business/about02.jpg"

import StartupNavbar from "../componants/Navbar";
import Clients from "../componants/Clients";
import Blog from "../componants/Blogs";
import GetInTuchFour from "../componants/GetInTouchFour";
import SmallFooter from "../componants/SmallFooter";

import { Parallax } from 'react-parallax';
import { featuresData, partnersImg,teamData } from "../data/data";

import {FiVideo,BiWater,TfiDropbox,MdOutlineCenterFocusWeak,MdArrowForward, FiPlay,FiFacebook,FiInstagram, FiTwitter} from "../assets/icons/vander"

import ModalVideo from 'react-modal-video';
import "../../node_modules/react-modal-video/scss/modal-video.scss"

export default function IndexStartup(){
    const [isOpen, setOpen] = useState(false);

    const aboutData = [
    {
      icon: BiWater,
      title: "24/7 Emergency Care",
      desc: "We offer round-the-clock medical support for all urgent care needs.",
    },
    {
      icon: TfiDropbox,
      title: "Expert Doctors",
      desc: "Our certified specialists are dedicated to providing quality healthcare.",
    },
    {
      icon: MdOutlineCenterFocusWeak,
      title: "Patient-Centered",
      desc: "Every decision we make revolves around your health and satisfaction.",
    },
  ];

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return(
        <>
        <StartupNavbar/>
        <section className="bg-home startup-wrapper d-flex align-items-center overflow-hidden" id="home">
            <div className="bg-overlay bg-transparent" id="overlay" style={{backgroundImage:`url(${bgImg})`}}></div>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="title-heading">
                            <img src={logo36} alt=""/>
                            <h4 className="display-5 fw-bold my-4">Trusted Medical Care <br /> For Your Family</h4>
                            <p className="text-muted para-desc mb-0">Our clinic offers professional medical services designed to care for your well-being at every stage.</p>

                            <div className="mt-4">
                                <Link to="/bookappointment" className="btn btn-primary">Book Appointment</Link>
                                <Link to="#" onClick={() => setOpen(true)} className="btn btn-icon btn-pills btn-primary lightbox ms-2"><FiVideo className="fea icon-sm"/></Link><span className="fw-normal align-middle ms-2">Watch Intro  </span>
                            </div>
                            <ModalVideo
                            channel="youtube"
                            youtube={{ mute: 0, autoplay: 0 }}
                            isOpen={isOpen}
                            videoId="yba7hPeTSjk"
                            onClose={() => setOpen(false)} 
                            />
                        </div>
                        
                        <img src={squareDanger} className="img-fluid rounded-pill bg-image-position avatar avatar-md-md mover-2 z-index-0" alt=""/>
                        <img src={squareSuccess} className="img-fluid rounded-md avatar avatar-md-md bg-image-position-2 spin-anything z-index-0" alt=""/>
                    </div>
                </div>
                <img src={squarePrimary} className="img-fluid rounded-pill position-absolute top-0 start-50 translate-middle-x avatar avatar-md-md zoom-in-out z-index-0" alt=""/>
            </div>
        </section>
        <section className="section-two bg-light">
            <div className="container">
                <div className="row">
                    {aboutData.map((item,index) =>{
                        const Icon = item.icon 
                        return(
                        <div className="col-lg-4 col-md-6 mt-4 pt-2" key={index}>
                            <div className="d-flex features feature-primary">
                                <div className="feature-icon text-center rounded">
                                    <Icon className="icon"/>
                                </div>
                                <div className="flex-1 ms-4">
                                    <h5 className="mt-0">{item.title}</h5>
                                    <p className="text-muted mb-0">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
        </section>
        <section className="section" id="about">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="about-image position-relative">
                            <img src={about01} className="img-fluid rounded shadow" alt=""/>

                            <div className="about-image-position">
                                <img src={about02} className="img-fluid rounded shadow-lg" alt=""/>
                                <div className="play-icon">
                                    <Link to="#!" onClick={() => setOpen(true)}  className="play-btn lightbox">
                                        <i className="mdi mdi-play text-primary rounded-circle bg-white shadow-lg"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mt-4 pt-2 mt-sm-0 pt-sm-0">
                        <div className="section-title ms-lg-5">
                            <h6 className="text-primary fw-normal">About Our Clinic</h6>
                            <h4 className="title mb-4">Providing Quality Healthcare</h4>
                            <p className="text-muted">Our medical team is committed to offering compassionate and personalized care to every patient.</p>
                            <p className="text-muted mb-0">We bring together cutting-edge technology and a team of dedicated specialists to ensure the best outcomes.</p>
                        
                            <div className="mt-4 pt-2">
                                <Link to="/about" className="btn btn-primary">Learn More <MdArrowForward/></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="section  py-0 mt-5" id="cta">
        <Parallax
                blur={{ min: 0, max: 0}}
                bgImage={BgImg02}
                bgImageAlt="the dog"
                strength={500}
                bgportfolioImageize="100%"
                bgStyle={{with:"auto", height:"100%" }}
                style={{position:"absolute", width:"100%" , height:"100%"}}
            >
            </Parallax>
            <div className="bg-overlay"></div>
            <div className="container section">
                <div className="row justify-content-center">
                    <div className="col-12 text-center">
                        <div className="section-title">
                            <h4 className="title title-dark text-white mb-4">Your Health, Our Mission</h4>
                            <p className="text-light para-dark para-desc mx-auto">Book your appointment online and meet our doctors for fast, reliable medical care.</p>
                            <Link to="#!" onClick={() => setOpen(true)} className="play-btn border border-light mt-4 lightbox">
                                <FiPlay className="fea icon-ex-md text-white title-dark"/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="section bg-soft-primary" id="features">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title text-center mb-4 pb-2">
                            <h4 className="title text-dark mb-3">Our Medical Services</h4>
                            <p className="text-muted para-dark para-desc mx-auto">We offer a wide range of healthcare services tailored to your needs.</p>
                        </div>
                    </div>
                </div>

                <div className="row">
  {featuresData.map((item, index) => {
    const Icon = item.icon;
    return (
      <div className="col-lg-4 col-sm-6 d-flex align-items-stretch mt-4 pt-2" key={index}>
        <div className="card features feature-primary feature-clean feature-transition p-4 border-0 shadow rounded overflow-hidden w-100">
          <div className="icons text-center rounded">
            <Icon className="icon mb-0" />
          </div>
          <div className="content mt-4">
            <Link to={`/page-service-detail/${item.id}`} className="h5 text-dark title">
              {item.title}
            </Link>
            <p className="text-muted mt-3">{item.desc}</p>
          </div>
        </div>
      </div>
    );
  })}
</div>

            </div>
        </section>
        <section className="section" id="testimonial">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="section-title text-center mb-4 pb-2">
                            <h6 className="text-primary fw-normal mb-2">Patient Stories</h6>
                            <h4 className="title mb-4">What our Clients <br/> say about us</h4>
                            <p className="text-muted para-desc mb-0 mx-auto">We’re proud of the trust our patients place in our care.</p>
                        </div>
                    </div>
                </div>

                <Clients/>
            </div>

            <div className="container mt-5">
                <div className="row justify-content-center">
                    {partnersImg.map((item,index)=>{
                        return(
                        <div className="col-lg-2 col-md-2 col-6 py-2" key={index}>
                            <div className="text-center">
                                <img src={item} className="avatar avatar-md-md w-auto" alt=""/>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>

            <div className="container mt-100">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="section-title text-center mb-4 pb-2">
                            <h6 className="text-primary fw-normal mb-2">Our Doctors</h6>
                            <h4 className="title mb-4">Meet The Medical Team</h4>
                            <p className="text-muted para-desc mb-0 mx-auto">Experienced, compassionate professionals who care deeply about your health.</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {teamData.map((item,index)=>{
                        return(
                        <div className="col-lg-3 col-md-4 col-12 mt-4 pt-2" key={index}>
                            <Link to={`/doctor/${index+1}`}>
                            <div className="card team team-primary text-center">
                                <div className="card-img team-image d-inline-block mx-auto rounded-pill avatar avatar-ex-large overflow-hidden">
                                    <img src={item.image} className="img-fluid" alt=""/>
                                    <div className="card-overlay avatar avatar-ex-large rounded-pill"></div>
                                </div>
    
                                <div className="content mt-3">
                                    <h5 to="/page-team-detail" className="text-dark h5 mb-0 title">{item.name}</h5>
                                    <h6 className="text-muted mb-0 fw-normal">{item.title}</h6>
                                </div>
                            </div></Link>
                        </div>
                        )
                    })}
                </div>
            </div>
        </section>
        <section className="section bg-light" id="news">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="section-title text-center mb-4 pb-2">
                            <h4 className="title mb-4">Health Articles & Tips</h4>
                            <p className="text-muted para-desc mb-0 mx-auto">Stay informed with the latest health news, tips, and updates.</p>
                        </div>
                    </div>
                </div>
               <Blog/>
            </div>
        </section>
        <GetInTuchFour/>
        <SmallFooter/>
        </>
    )
}