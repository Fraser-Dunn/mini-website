import React from "react";
import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    damaged: false,
    gender: "",
    images: {},
    maker: "",
    name: "",
    number: 0,
    quantity: 1,
    race: "",
    rarity: "",
    set: "",
    size: "",
    statblock: "",
    type: "",
  });

  const {
    brand,
    damaged,
    gender,
    images,
    maker,
    name,
    number,
    quantity,
    race,
    rarity,
    set,
    size,
    statblock,
    type,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/login");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onMutate = (e) => {};

  return (
    <div className="body-base-form ">
      <div className="form-container bg-orange-400 shadow-lg rounded-md">
        <header className="form-header ">
          <h1>Upload a Mini</h1>
        </header>

        <main className="form-main bg-white">
          <form className="form-actual" onSubmit={onSubmit}>
            <div className="form-content">
              {/* name */}
              <div className="name-div">
                <div className="form-name-label-div bg-orange-400 rounded-md">
                  <label className="form-name-label">Name:</label>
                  <input className="form-name-input rounded-md" type="text" />
                </div>
              </div>

              {/* size */}
              <div className="name-div">
                <div className="form-name-label-div bg-orange-400 rounded-md">
                  <label className="form-name-label">Size:</label>
                  <input className="form-name-input rounded-md" type="text" />
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Admin;
