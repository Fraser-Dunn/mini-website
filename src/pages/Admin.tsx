import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import AdminNav from "../components/AdminNav";
import { createMini, getUploadUrl, uploadImageToS3 } from "../services/minisApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Mini, Size } from "../types/mini";

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

const sizes: Size[] = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];

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
      const { uploadUrl, publicUrl } = await getUploadUrl(image.name, image.type);
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

  const onMutate = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (target.files) {
      setFormData((prevState) => ({ ...prevState, images: target.files }));
      return;
    }

    setFormData(
      (prevState) => ({ ...prevState, [target.id]: target.value }) as AdminFormState
    );
  };

  const onSizeChange = (value: string) => {
    setFormData((prevState) => ({ ...prevState, size: value as Size }));
  };

  const onDamagedChange = (value: string) => {
    if (value) {
      setFormData((prevState) => ({ ...prevState, damaged: value === "yes" }));
    }
  };

  return (
    <div className="container max-w-3xl py-14">
      <AdminNav />
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">New entry</p>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide">
        Catalogue a Miniature
      </h1>
      <div className="mt-8 rounded-sm border border-primary/15 bg-card p-6">
        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter name here..."
                value={name}
                onChange={onMutate}
                maxLength={40}
                minLength={3}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="size">Size</Label>
              <Select value={size} onValueChange={onSizeChange}>
                <SelectTrigger id="size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type">Creature Type</Label>
              <Input
                id="type"
                placeholder="Enter creature type here..."
                value={type}
                onChange={onMutate}
                maxLength={30}
                minLength={3}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="race">Race</Label>
              <Input
                id="race"
                placeholder="Enter race here..."
                value={race}
                onChange={onMutate}
                maxLength={30}
                minLength={3}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                placeholder="Enter gender here..."
                value={gender}
                onChange={onMutate}
                maxLength={30}
                minLength={3}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="number">Number</Label>
              <Input
                id="number"
                type="number"
                placeholder="Enter set number here..."
                value={number}
                onChange={onMutate}
                min="1"
                max="70"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="set">Set</Label>
              <Input
                id="set"
                placeholder="Enter set here..."
                value={set}
                onChange={onMutate}
                maxLength={60}
                minLength={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rarity">Rarity</Label>
              <Input
                id="rarity"
                placeholder="Enter rarity here..."
                value={rarity}
                onChange={onMutate}
                maxLength={30}
                minLength={3}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity here..."
                value={quantity}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="maker">Maker</Label>
              <Input
                id="maker"
                placeholder="Enter maker here..."
                value={maker}
                onChange={onMutate}
                maxLength={30}
                minLength={3}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="Enter brand here..."
                value={brand}
                onChange={onMutate}
                maxLength={30}
                minLength={3}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Damaged</Label>
              <ToggleGroup
                type="single"
                variant="outline"
                value={damaged ? "yes" : "no"}
                onValueChange={onDamagedChange}
                className="justify-start"
              >
                <ToggleGroupItem value="yes">Yes</ToggleGroupItem>
                <ToggleGroupItem value="no">No</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="statblock">Statblock</Label>
              <Input
                id="statblock"
                placeholder="Enter statblock link here..."
                value={statblock}
                onChange={onMutate}
                maxLength={100}
                minLength={3}
                required
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="images">Image</Label>
              <Input
                id="images"
                type="file"
                ref={inputImage}
                onChange={onMutate}
                accept=".jpg,.png,.jpeg"
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="sm:col-span-2">
              {submitting ? "Uploading..." : "Upload Mini"}
            </Button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
