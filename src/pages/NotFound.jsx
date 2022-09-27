import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
  return (
    <div className='notFound-container'>
      <div className="notFound-body">
        <h1>Oops!</h1>
        <p>404 - Page Not Found!</p>
        <Link className="notFound-button" to="/">
          <FontAwesomeIcon className='notFound-icon' icon={faHome}/>
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound