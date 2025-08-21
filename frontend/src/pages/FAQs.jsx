import {useState, useEffect} from "react";

import { Link } from "react-router-dom";

import Navbar from "../componants/Navbar";
import background from "../assets/images/bg/02.jpg"

import { Parallax } from 'react-parallax';

import {accordionData} from "../data/data"

import {AiOutlineQuestionCircle,BiCog,FiFileText} from "../assets/icons/vander"
import FooterFour from "../componants/SmallFooter";

export default function FAQs(){
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, []);

    const faqData = [
  {
    icon: AiOutlineQuestionCircle,
    title: "General Questions",
    desc: "Find answers to common questions about booking appointments, doctor availability, and more.",
  },
  {
    icon: FiFileText,
    title: "Appointment Guide",
    desc: "Learn how to search for doctors, book, reschedule, or cancel appointments step-by-step.",
  },
  {
    icon: BiCog,
    title: "Support Requests",
    desc: "Need help? Submit a support request and our team will assist you as soon as possible.",
  },
];

    return(
        <>
        <Navbar navClass="defaultscroll sticky" manuClass="navigation-menu nav-right nav-light" logoLight={true}/>
        <section className="position-relative overflow-hidden">
            <Parallax
                blur={{ min: 0, max: 0}}
                bgImage={background}
                bgImageAlt="the dog"
                strength={500}
                bgportfolioImageize="100%"
                bgStyle={{with:"auto", height:"100%" }}
                style={{position:"absolute", width:"100%" , height:"100%"}}
            >
            </Parallax>
            <div className="bg-overlay bg-gradient-overlay-2"></div>
            <div className="bg-half-170 d-table w-100">
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-12">
                            <div className="title-heading text-center">
                                <p className="text-white-50 para-desc mx-auto mb-0">FAQs</p>
                                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Frequently Asked Questions</h5>
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
                                <li className="breadcrumb-item active" aria-current="page">FAQs</li>
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
                    <div className="col-12">
                        <div className="section-title text-center mb-4 pb-2">
                            <h4 className="mb-4">Find the help you need</h4>
                            <p className="para-desc mx-auto text-muted">Need help managing your appointments or understanding how the platform works? We’ve got answers.</p>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    {faqData.map((item,index)=>{
                        const Icon = item.icon
                        return(
                            <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2" key={index}>
                                <div className="card border-0 text-center features feature-primary feature-clean mx-md-5 mx-4">
                                    <div className="icons text-center rounded mx-auto">
                                        <Icon className="icon d-block h4 mb-0"/>
                                    </div>
                                    <div className="content mt-4">
                                        <Link to="/page-faqs" className="title h5 text-dark">{item.title}</Link>
                                        <p className="text-muted mt-3 mb-0">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="container mt-100">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title text-center mb-4 pb-2">
                            <h4 className="mb-4">Get Started</h4>
                            <p className="para-desc mx-auto text-muted">Learn how to use our doctor appointment system to find specialists, manage bookings, and more.</p>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-9 mt-4 pt-2">
                        <div className="accordion" id="accordionExample">
                            {accordionData.map((item,index)=>{
                                return(
                                    <div className="accordion-item rounded shadow mt-2" key={index}>
                                        <h2 className="accordion-header" id="headingOne">
                                            <button className={`${activeIndex === item.id ? "active accordion-button fw-normal border-0 bg-light rounded shadow" : "accordion-button fw-normal border-0 bg-light rounded shadow collapsed"} `} onClick={() => setActiveIndex(item.id)}>
                                                {item.title}
                                            </button>
                                        </h2>
                                        {activeIndex === item.id ? 
                                            <div id="collapseOne" className="accordion-collapse border-0 collapse show" >
                                                <div className="accordion-body text-muted bg-transparent">
                                                {item.desc}
                                                </div>
                                            </div>:""
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="section bg-soft-primary">
            <div className="container">
                <div className="row align-items-end">
                    <div className="col-lg-9 col-md-6 col-12">
                        <div className="section-title text-md-start text-center">
                            <h4 className="title text-dark mb-4">Caring for your health made simple. <br /> Join our platform today.</h4>
                            <p className="text-muted para-desc mb-0">Start using our healthcare system to connect with qualified doctors and manage your appointments with ease.</p>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 col-12">
                        <div className="text-md-end text-center">
                            <Link to="/contactus" className="btn btn-primary">Get In Touch!</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <FooterFour/>
        </>
    )
}