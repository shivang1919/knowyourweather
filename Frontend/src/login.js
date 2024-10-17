import { GoogleLogin } from 'react-google-login';
import './Login.css'; // Ensure to create a separate CSS file for this component

const oAuthKey = "1069910303420-2tfbmtu5ju3ol1cponbc6ih8ajfvn9df.apps.googleusercontent.com";

const Login = () => {
  const onSuccess = (res) => {
    console.log("LOGIN SUCCESS! Current user: ", res.profileObj);
    localStorage.setItem("userid", res.profileObj.googleId);
    localStorage.setItem("fullname", res.profileObj.name);
    window.location.href = "http://localhost:3000/#/";
    window.location.reload();
  };

  const onFailure = (res) => {
    alert("Login failed! Try again...");
  };

  return (
    <section className="login-section">
      

      <div className="container login-container">
        <div className="row justify-content-center">
          <div className="col-lg-6 mt-5 text-center">
            <h1 className='title'>Weather</h1>
            <p className='subtitle'>Check if it's raining cats and dogs or is it bright and shine.</p>
          </div>

          <div className="col-lg-6 mt-4">
            <div className="login-box">
              <h2 className="text-center">Login with Google</h2>
              <hr />
              <div className='mb-3'>
                <GoogleLogin
                  clientId={oAuthKey}
                  buttonText="Login with Google"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={'single_host_origin'}
                  className="google-login-button"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
