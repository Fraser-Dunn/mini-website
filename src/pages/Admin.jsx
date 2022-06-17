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

        <main className="form-main bg-[#f2f4f8]">
          <form className="form-actual" onSubmit={onSubmit}>
            <div className="form-content-grid bg-[#f2f4f8] rounded-md ">
              {/* name */}
              <div className="name-div">
                <div className="form-name-label-div bg-[#f2f4f8] rounded-md">
                  <label className="form-name-label">Name</label>
                  <input
                    placeholder="Enter name here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* size */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Size</label>
                  <input
                    placeholder="Enter size here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* type */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Creature Type</label>
                  <input
                    placeholder="Enter creature type here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* race */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Race</label>
                  <input
                    placeholder="Enter race here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* gender */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Gender</label>
                  <input
                    placeholder="Enter gender here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* number */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Number</label>
                  <input
                    placeholder="Enter set number here..."
                    className="form-name-input rounded-md"
                    type="number"
                  />
                </div>
              </div>

              {/* set */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Set</label>
                  <input
                    placeholder="Enter set here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* rarity */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Rarity</label>
                  <input
                    placeholder="Enter rarity here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* quantity */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Quantity</label>
                  <input
                    placeholder="Enter quantity here..."
                    className="form-name-input rounded-md"
                    type="number"
                  />
                </div>
              </div>

              {/* maker */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Maker</label>
                  <input
                    placeholder="Enter maker here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* brand */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Brand</label>
                  <input
                    placeholder="Enter brand here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* damaged */}
              <div className="name-div-damaged">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Damaged</label>
                  <div className="form-button-div">
                    {/* yes */}
                    <button className="form-button">Yes</button>
                    {/* no */}
                    <button className="form-button">No</button>
                  </div>
                </div>
              </div>

              {/* statblock */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Statblock</label>
                  <input
                    placeholder="Enter statblock link here..."
                    className="form-name-input rounded-md"
                    type="text"
                  />
                </div>
              </div>

              {/* image */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Image</label>
                  <input
                    className="form-name-input-image "
                    type="file"
                    max="1"
                    accept=".jpg,.png,.jpeg"
                  />
                </div>
              </div>
              {/* submit form button */}
              <button className="form-submit-button" type="submit">
                Upload Mini
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Admin;
