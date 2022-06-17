import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getSorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

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

    setLoading(true);

    if (images.length > 1) {
      setLoading(false);
      toast.error("Max 1 image");
      return;
    }
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

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
                    id="name"
                    value={name}
                    onChange={onMutate}
                    maxLength="30"
                    minLength="3"
                    required
                  />
                </div>
              </div>

              {/* size */}
              <div className="name-div">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Size</label>
                  <select
                    className="form-size-select"
                    defaultValue="medium"
                    name="sizes"
                    id="size"
                    value={size}
                    onChange={onMutate}
                  >
                    <option value="tiny">Tiny</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="huge">Huge</option>
                    <option value="gargantuan">Gargantuan</option>
                  </select>
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
                    id="type"
                    value={type}
                    onChange={onMutate}
                    maxLength="30"
                    minLength="3"
                    required
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
                    id="race"
                    value={race}
                    onChange={onMutate}
                    maxLength="30"
                    minLength="3"
                    required
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
                    id="gender"
                    value={gender}
                    onChange={onMutate}
                    maxLength="30"
                    minLength="3"
                    required
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
                    id="number"
                    value={number}
                    onChange={onMutate}
                    min="1"
                    max="50"
                    required
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
                    id="set"
                    value={set}
                    onChange={onMutate}
                    maxLength="30"
                    minLength="3"
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
                    id="rarity"
                    value={rarity}
                    onChange={onMutate}
                    maxLength="30"
                    minLength="3"
                    required
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
                    id="quantity"
                    value={quantity}
                    onChange={onMutate}
                    min="1"
                    max="50"
                    required
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
                    id="maker"
                    value={maker}
                    onChange={onMutate}
                    maxLength="30"
                    minLength="3"
                    required
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
                    id="brand"
                    value={brand}
                    onChange={onMutate}
                    maxLength="30"
                    minLength="3"
                    required
                  />
                </div>
              </div>

              {/* damaged */}
              <div className="name-div-damaged">
                <div className="form-name-label-div rounded-md">
                  <label className="form-name-label">Damaged</label>
                  <div className="form-button-div">
                    {/* yes */}
                    <button
                      className={
                        damaged ? "form-button" : "form-button-inactive"
                      }
                      type="button"
                      id="damaged"
                      value={true}
                      onClick={onMutate}
                      min="1"
                      max="50"
                    >
                      Yes
                    </button>
                    {/* no */}
                    <button
                      className={
                        !damaged && damaged !== null
                          ? "form-button"
                          : "form-button-inactive"
                      }
                      type="button"
                      id="damaged"
                      value={false}
                      onClick={onMutate}
                      min="1"
                      max="50"
                    >
                      No
                    </button>
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
                    id="statblock"
                    value={statblock}
                    onChange={onMutate}
                    maxLength="30"
                    minLength="3"
                    required
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
                    id="images"
                    onChange={onMutate}
                    max="1"
                    accept=".jpg,.png,.jpeg"
                    multiple
                    required
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
