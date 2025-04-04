import React, { useEffect, useState } from "react";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Home.css";
import head from "../Home/assets/trip bizz-04.png";
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  var [mounted, setMounted] = useState(true);
  useEffect(() => {
    if (mounted) {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 50) {
          setScrolled(true);
        } else if (window.pageYOffset < 50) {
          setScrolled(false);
        }
      });
    }
    return () => {
      setMounted(false);
      window.removeEventListener("scroll", () => {
        if (window.pageYOffset > 50) {
          setScrolled(true);
        } else if (window.pageYOffset < 50) {
          setScrolled(false);
        }
      });
    };
  }, []);
  return (
    <div
      className={
        scrolled
          ? "homepage-nav-block homepage-nav-block-scrolled shadow"
          : "homepage-nav-block"
      }
    >
      <div className="homepage-nav-section">
        <div className="homepage-nav-logo">
          <Link to="/">
            <img
              src={head}
              alt=""
              className="object-cover h-[60px] w-[240px]"
            />
          </Link>
        </div>
        <div className="homepage-nav-mobile-menu">
          {!showMobileMenu ? (
            <FontAwesomeIcon
              icon={faBars}
              className="homepage-nav-menu-icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            />
          ) : (
            <FontAwesomeIcon
              icon={faXmark}
              className="homepage-nav-menu-icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            />
          )}
          <div
            className={
              !showMobileMenu
                ? "homepage-nav-mobile"
                : "homepage-nav-mobile show"
            }
          >
            <div className="homepage-nav-mobile-menuItem">
              <Link to="/login">Log In</Link>
            </div>
          </div>
        </div>
        <div className="homepage-nav-desktop-menu">
          <div className="homepage-nav-desktop-menuItem">
            <Link to="/login">
              <button>Log In</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
