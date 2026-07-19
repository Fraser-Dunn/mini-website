import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { createMini, getUploadUrl, uploadImageToS3 } from "../services/minisApi";
import type { Mini } from "../types/mini";

type AdminFormState = Omit<
  Mini,
  "id" | "imageUrls" | "timestamp" | "userRef"
> & {
  images: FileList | null;
};

const initialState: AdminFormState = {
  brand: "",
  damaged: false,
  gender: "",
  images: null,
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
  const [formData, setFormData] = useState<AdminFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);

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

  const inputImage = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!images || images.length < 1) {
      toast.error("Please select an image");
      return;
    }

    if (images.length > 1) {
      toast.error("Max 1 image");
      return;
    }

    const image = images[0];
    setSubmitting(true);

    try {
      const { uploadUrl, publicUrl } = await getUploadUrl(
        image.name,
        image.type
      );
      await uploadImageToS3(uploadUrl, image);

      await createMini({
        name,
        brand,
        maker,
        set,
        number: Number(number),
        quantity: Number(quantity),
        race,
        gender,
        type,
        size,
        rarity,
        damaged,
        statblock,
        imageUrls: [publicUrl],
      });

      toast.success("Mini saved");
      setFormData(initialState);
      if (inputImage.current) {
        inputImage.current.value = "";
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to save mini: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const onMutate = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;

    // Files
    if (target instanceof HTMLInputElement && target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: target.files,
      }));
      return;
    }

    // Text/Numbers/Select
    setFormData(
      (prevState) =>
        ({
          ...prevState,
          [target.id]: target.value,
        }) as AdminFormState
    );
  };

  const onDamagedChange = (value: boolean) => {
    setFormData((prevState) => ({ ...prevState, damaged: value }));
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
                    maxLength={40}
                    minLength={3}
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
                    maxLength={30}
                    minLength={3}
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
                    maxLength={30}
                    minLength={3}
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
                    maxLength={30}
                    minLength={3}
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
                    maxLength={60}
                    minLength={3}
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
                    maxLength={30}
                    minLength={3}
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
                    maxLength={30}
                    minLength={3}
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
                    maxLength={30}
                    minLength={3}
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
                      onClick={() => onDamagedChange(true)}
                    >
                      Yes
                    </button>
                    {/* no */}
                    <button
                      className={
                        !damaged ? "form-button" : "form-button-inactive"
                      }
                      type="button"
                      id="damaged"
                      onClick={() => onDamagedChange(false)}
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
                    maxLength={100}
                    minLength={3}
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
                    accept=".jpg,.png,.jpeg"
                    required
                  />
                </div>
              </div>
              {/* submit form button */}
              <button
                className="form-submit-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Uploading..." : "Upload Mini"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Admin;
