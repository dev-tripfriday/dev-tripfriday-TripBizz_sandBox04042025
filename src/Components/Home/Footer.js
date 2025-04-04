import { faCopyright, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './Home.css'
import { Link, useNavigate } from 'react-router-dom'

const Footer = () => {
    var navigate = useNavigate();
    return (
        <div className="homepage-footer-block">
            {/* <div className="homepage-footer-section"> */}
            <div className="homepage-footer-body" >
                <div className="homepage-footer-box">
                    <div className="homepage-footer-logo" >
                        <img src="/logo/tripbizz-logo.png" width="150" alt="Goitinerary logo" />
                    </div>
                    <div className="homepage-footer-description">
                        TripBizz is a one-stop Travel and Expense Management application for SMEs and Corporates to book & manage business trips for their employees. The app provides an easy-to-use interface to book travel components such flights, hotels, cabs, buses etc. at B2B rates while providing workflows for internal approvals. Further, other expenses incurred on the trip such as meals, cabs and other miscellaneous expenses can be captured in real time & can be reported to the accounts team for reimbursements in a quick and hassle-free manner. Our mission is to provide good B2B rates to SME & corporates while also reducing the time spent on managing the whole travel booking, expense recording and reimbursements process.
                    </div>
                    <div className="homepage-footer-btn-section" >
                        <button className="homepage-footer-btn-login" onClick={() => { navigate('/login') }}>Log In</button>
                    </div>
                </div>
                <div className="homepage-footer-contact">
                    <div className="homepage-footer-contact-title">Contact us</div>
                    <div className="homepage-footer-contact-email"><FontAwesomeIcon icon={faEnvelope} className="mr-2" />&nbsp;travel@tripfriday.com</div>
                    {/* <div className="homepage-footer-contact-social"><FontAwesomeIcon icon={faFacebookSquare} className="homepage-footer-contact-social-fb" /><FontAwesomeIcon icon={faInstagram} className="homepage-footer-contact-social-insta" /></div> */}
                </div>
            </div>
            <div className="homepage-footer-links" >
                <div className="homepage-footer-links-copyright"><FontAwesomeIcon icon={faCopyright} className="mr-1" />Quikprocess pvt ltd | ALL RIGHTS RESERVED</div>
                <div className="homepage-footer-terms">
                    <div className='homepage-footer-terms-link'><Link to='privacy'>Privacy</Link></div>
                    <div className="homepage-footer-terms-link"><Link to='terms'>Terms</Link></div>
                    <div className="homepage-footer-terms-link"><Link to='cancellation'>Cancellation</Link></div>
                </div>
            </div>
            {/* </div> */}
        </div>
    )
}

export default Footer
