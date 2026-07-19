import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
      toast.error(`Bad User Credentials: ${message}`);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="grid w-full max-w-3xl grid-cols-1 overflow-hidden md:grid-cols-2">
        <div className="flex flex-col justify-center gap-4 bg-primary p-8 text-primary-foreground">
          <h2 className="text-2xl font-bold">Login</h2>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-primary-foreground">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={onChange}
                className="bg-background text-foreground"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-primary-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={onChange}
                  className="bg-background pr-10 text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="secondary" className="mt-2">
              Sign In
            </Button>
          </form>
        </div>
        <div className="hidden md:block">
          <img src={riseOfTiamat} alt="" className="h-full w-full object-cover" />
        </div>
      </Card>
    </div>
  );
}

export default LogIn;
