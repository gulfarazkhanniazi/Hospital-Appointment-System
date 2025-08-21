import { Link } from "react-router-dom";
import { FiPhoneCall, FiMail, FiMapPin } from '../assets/icons/vander';

export default function GetInTuchFour() {
    return (
        <section className="section" id="contact">
            <div className="container">
                <div className="row">
                    {/* Contact Info */}
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="section-title mb-4">
                            <h4 className="title mb-4">Get in Touch</h4>
                            <p className="text-muted para-desc mb-0">
                                Need medical assistance or want to book an appointment? Reach out to our care team—we're here to help.
                            </p>
                        </div>

                        <div className="row">
                            <div className="col-12 mt-4">
                                <div className="d-flex features feature-primary">
                                    <div className="feature-icon rounded text-center">
                                        <FiPhoneCall className="d-block h3 mb-0 icon" />
                                    </div>
                                    <div className="flex-1 ms-4">
                                        <h6 className="mb-1">Phone</h6>
                                        <Link to="tel:+18001234567" className="link">+1 800 123 4567</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <div className="d-flex features feature-primary">
                                    <div className="feature-icon rounded text-center">
                                        <FiMail className="d-block mb-0 icon" />
                                    </div>
                                    <div className="flex-1 ms-4">
                                        <h6 className="mb-1">Email</h6>
                                        <Link to="mailto:appointments@medicareclinic.com" className="link">appointments@medicareclinic.com</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <div className="d-flex features feature-primary">
                                    <div className="feature-icon rounded text-center">
                                        <FiMapPin className="d-block h3 mb-0 icon" />
                                    </div>
                                    <div className="flex-1 ms-4">
                                        <h6 className="mb-1">Clinic Location</h6>
                                        <Link
                                            to="https://maps.google.com/?q=123+Health+St,+Medical+City"
                                            className="lightbox text-primary"
                                            data-type="iframe"
                                            data-group="iframe"
                                            data-width="1024px"
                                            data-height="576px"
                                        >
                                            View on Google Map
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="col-lg-8 col-md-6 col-12 mt-4 pt-2 mt-sm-0 pt-sm-0">
                        <div className="p-4 rounded shadow">
                            <form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Full Name <span className="text-danger">*</span>
                                            </label>
                                            <input name="name" id="name" type="text" className="form-control" placeholder="Your Name" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Email Address <span className="text-danger">*</span>
                                            </label>
                                            <input name="email" id="email" type="email" className="form-control" placeholder="Your Email" />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">Subject</label>
                                            <input name="subject" id="subject" className="form-control" placeholder="e.g. Appointment Request" />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Message <span className="text-danger">*</span>
                                            </label>
                                            <textarea name="comments" id="comments" rows="4" className="form-control" placeholder="How can we help you?"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-grid">
                                            <button type="submit" id="submit" name="send" className="btn btn-primary">
                                                Send Inquiry
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
