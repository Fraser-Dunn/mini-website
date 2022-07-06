import React from "react";

const About = () => {
  return (
    <div className="about-page-container">
      <div className="about-page-header-container">
        <div className="about-page-header">
          <h1>Welcome To My Miniature Collection Website</h1>
        </div>
      </div>
      <div className="about-info-container">
        <div className="about-info-div">
          <div className="about-info-item">
            <h1>Hey There!</h1>
            <p>
              I have created this website to assist in keeping track of my
              growing mini collection.
            </p>
            <p>
              The goal for this website was to blend the aspects of both an
              image gallery and a refrencing tool for table-top gaming.
            </p>
          </div>
        </div>
      </div>
      <div className="about-footer-container">
        <div className="about-footer-body">
          <div className="about-footer-div">
            <div className="about-footer-info">
              <h1>Gallery</h1>
              <p>
                The gallery aspect refers to information about the physical
                miniature and highlights:
              </p>
              <div className="about-footer-info-ul">
                <ul>
                  <li>Brand</li>
                  <li>Image</li>
                  <li>Maker</li>
                  <li>Set</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="about-footer-div">
            <div className="about-footer-info">
              <h1>Table-top</h1>
              <p>
                The table-top aspect refers to information about the table-top
                ruleset and highlights:
              </p>
              <div className="about-footer-info-ul">
                <ul>
                  <li>Race</li>
                  <li>Size</li>
                  <li>Statblock</li>
                  <li>Type</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
