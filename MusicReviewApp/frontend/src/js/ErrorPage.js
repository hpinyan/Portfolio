import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ErrorPage.css';

const ErrorPage = ({ location }) => {
  return (
    <div className="error-page">
      <h1>Oops! Something went wrong.</h1>
      {location.state ? (
        location.state.err ? (
          <p>Error Received: {location.state.err}</p>
        ): (
          <p>Error Received: {location.state}</p>
        )
      ): (
        <p>Error!</p>
      )}
      <Link to="/" className="btn-error btn-primary">Go back to the login page</Link>
    </div>
  );
};

export default ErrorPage;
