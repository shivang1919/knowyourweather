import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import './Header.css'; // Ensure this points to your CSS file

const clientId = "1069910303420-2tfbmtu5ju3ol1cponbc6ih8ajfvn9df.apps.googleusercontent.com";

const Header = () => {
  const logout = () => {
    window.localStorage.clear();
    window.location.href = "http://localhost:3000/#/"; // Redirect to dashboard
    window.location.reload(); // Reload the app
  }

  return (
    <nav className="navbar bg-dark text-white p-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span className=" text-gold font-2xl">Know Your Weather</span>
        <div className="btn-group">
          <GoogleLogout
            clientId={clientId}
            buttonText="Logout"
            onLogoutSuccess={logout}
            className="btn btn-gold fw-bold"
          />
        </div>
      </div>
    </nav>
  );
}

export default Header;
