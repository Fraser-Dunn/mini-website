import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
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

const initialState = {
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
  size: "Medium",
  statblock: "",
  type: "",
};

const Admin = () => {
  const [formData, setFormData] = useState(initialState);

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
  const inputImage = useRef(null);

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

  const onSubmit = async (e) => {
    e.preventDefault();

    if (images.length > 1) {
      toast.error("Max 1 image");
      return;
    }

    // Store Images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    formDataCopy.number = Number(formDataCopy.number);
    formDataCopy.quantity = Number(formDataCopy.quantity);
    console.log(formDataCopy);

    await addDoc(collection(db, "minis"), formDataCopy);

    toast.success("Mini saved");

    setFormData(initialState);
    inputImage.current.value = null;
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
      <div className="form-container shadow-lg">
        <header className="form-header ">
          <h1>Upload a Mini</h1>
        </header>

        <main className="form-main">
          <form className="form-actual" onSubmit={onSubmit}>
            <div className="form-content-grid">
              {/* name */}
              <div className="name-div">
                <div className="form-name-label-div">
                  <label className="form-name-label">Name</label>
                  <input
                    placeholder="Enter name here..."
                    className="form-name-input"
                    type="text"
                    id="name"
                    value={name}
                    onChange={onMutate}
                    maxLength="40"
                    minLength="3"
                    required
                  />
                </div>
              </div>

              {/* size */}
              <div className="name-div">
                <div className="form-name-label-div">
                  <label className="form-name-label">Size</label>
                  <select
                    className="form-size-select"
                    name="sizes"
                    id="size"
                    value={size}
                    onChange={onMutate}
                  >
                    <option value="Tiny">Tiny</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Huge">Huge</option>
                    <option value="Gargantuan">Gargantuan</option>
                  </select>
                </div>
              </div>

              {/* type */}
              <div className="name-div">
                <div className="form-name-label-div">
                  <label className="form-name-label">Creature Type</label>
                  <input
                    placeholder="Enter creature type here..."
                    className="form-name-input"
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
                <div className="form-name-label-div">
                  <label className="form-name-label">Race</label>
                  <input
                    placeholder="Enter race here..."
                    className="form-name-input"
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
                <div className="form-name-label-div">
                  <label className="form-name-label">Gender</label>
                  <input
                    placeholder="Enter gender here..."
                    className="form-name-input"
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
                <div className="form-name-label-div">
                  <label className="form-name-label">Number</label>
                  <input
                    placeholder="Enter set number here..."
                    className="form-name-input"
                    type="number"
                    id="number"
                    value={number}
                    onChange={onMutate}
                    min="1"
                    max="70"
                    required
                  />
                </div>
              </div>

              {/* set */}
              <div className="name-div">
                <div className="form-name-label-div">
                  <label className="form-name-label">Set</label>
                  <input
                    placeholder="Enter set here..."
                    className="form-name-input"
                    type="text"
                    id="set"
                    value={set}
                    onChange={onMutate}
                    maxLength="60"
                    minLength="3"
                  />
                </div>
              </div>

              {/* rarity */}
              <div className="name-div">
                <div className="form-name-label-div">
                  <label className="form-name-label">Rarity</label>
                  <input
                    placeholder="Enter rarity here..."
                    className="form-name-input"
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
                <div className="form-name-label-div">
                  <label className="form-name-label">Quantity</label>
                  <input
                    placeholder="Enter quantity here..."
                    className="form-name-input"
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
                <div className="form-name-label-div">
                  <label className="form-name-label">Maker</label>
                  <input
                    placeholder="Enter maker here..."
                    className="form-name-input"
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
                <div className="form-name-label-div">
                  <label className="form-name-label">Brand</label>
                  <input
                    placeholder="Enter brand here..."
                    className="form-name-input"
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
                <div className="form-name-label-div">
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
                <div className="form-name-label-div">
                  <label className="form-name-label">Statblock</label>
                  <input
                    placeholder="Enter statblock link here..."
                    className="form-name-input"
                    type="text"
                    id="statblock"
                    value={statblock}
                    onChange={onMutate}
                    maxLength="100"
                    minLength="3"
                    required
                  />
                </div>
              </div>

              {/* image */}
              <div className="name-div">
                <div className="form-name-label-div">
                  <label className="form-name-label">Image</label>
                  <input
                    className="form-name-input-image "
                    type="file"
                    id="images"
                    ref={inputImage}
                    onChange={onMutate}
                    max="1"
                    accept=".jpg,.png,.jpeg"
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
