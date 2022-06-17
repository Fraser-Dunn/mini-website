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
      <div className="body-base">
        <div className="container shadow-xl">
          <div className="card-container bg-orange-400 py-36 px-7 ">
            <div className="text-center text-3xl text-white font-bold mb-8">
              <h2>Login</h2>
            </div>
            <form className="flex flex-col" onSubmit={onSubmit}>
              <label className="text-white pt-4 text-lg font-semibold">
                Email:
              </label>
              <input
                className="input-w p-[2px] rounded-sm outline-none"
                type="email"
                placeholder=""
                id="email"
                value={email}
                onChange={onChange}
              />

              <label className="text-white pt-4 text-lg font-semibold">
                Password:
              </label>
              <input
                className="input-w p-[2px] rounded-sm outline-none"
                type={showPassword ? "text" : "password"}
                placeholder=""
                id="password"
                value={password}
                onChange={onChange}
              />
              <img
                src={visibilityIconWhite}
                alt="show password"
                className="w-5 pt-1"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />

              <div className="self-center flex">
                <p className="items-center text-white text-xl justify-center mr-2">
                  Sign In
                </p>
                <button>
                  <img className="w-5" src={ArrowRightIcon} alt="arrow" />
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
