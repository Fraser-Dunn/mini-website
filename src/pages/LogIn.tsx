import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import visibilityIconWhite from "../assets/svg/visibilityIconWhite.svg";
import riseOfTiamat from "../assets/img/riseOfTiamat.jpg";

interface LogInProps {
  setIsAuthed: (isAuthed: boolean) => void;
}

function LogIn({ setIsAuthed }: LogInProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(email, password);
      setIsAuthed(true);
      navigate("/admin");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Bad User Credentials: ${message} `);
    }
  };

  return (
    <>
      <div className="logIn-body">
        <div className="logIn-container">
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
                className="logIn-input-img"
                src={visibilityIconWhite}
                alt="show password"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />

              <div className="logIn-button-div">
                <button className="logIn-button">
                  <p>Sign In</p>
                </button>
              </div>
            </form>
          </div>
          <div className="logIn-img-div">
            <img src={riseOfTiamat} alt="/" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;
