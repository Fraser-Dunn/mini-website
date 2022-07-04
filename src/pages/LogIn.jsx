import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIconWhite from "../assets/svg/visibilityIconWhite.svg";
import riseOfTiamat from "../assets/img/riseOfTiamat.jpg";

function LogIn(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        props.setIsAuthed(true);
        navigate("/admin");
      }
    } catch (error) {
      toast.error("Bad User Credentials");
    }
  };

  return (
    <>
      <div className="logIn-body">
        <div className="logIn-container shadow-xl">
          <div className="logIn-card-container">
            <div className="logIn-title">
              <h2>Login</h2>
            </div>
            <form className="logIn-form" onSubmit={onSubmit}>
              <label>Email:</label>
              <input
                type="email"
                placeholder=""
                id="email"
                value={email}
                onChange={onChange}
              />

              <label>Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                id="password"
                value={password}
                onChange={onChange}
              />
              <img
                src={visibilityIconWhite}
                alt="show password"
                className="logIn-input-img"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />

              <div className="logIn-button-div">
                <button className="logIn-button">
                  <p>Sign In</p>
                </button>
              </div>
            </form>
          </div>
          {/* div needs to be invisible at 270px width*/}
          <div className="hidden md3:flex">
            <img
              className="w-full h-full object-cover"
              src={riseOfTiamat}
              alt="/"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;
