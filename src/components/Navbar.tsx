import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import type { Mini } from "../types/mini";

interface NavbarProps {
  isAuthed: boolean;
  data: Mini[];
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/paints", label: "Paints" },
  { to: "/about", label: "About" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-1 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
    isActive
      ? "border-primary text-foreground"
      : "border-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
  }`;

const Navbar = ({ isAuthed, data }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/90 backdrop-blur">
      <div className="container flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="font-display text-2xl font-bold uppercase tracking-wide text-foreground"
          >
            My<span className="text-primary">Minis</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <SearchBar data={data} />
          <Button asChild size="sm">
            <Link to={isAuthed ? "/admin" : "/login"}>Admin</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l border-primary/20">
              <SheetHeader>
                <SheetTitle className="font-display uppercase tracking-wide">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className="font-mono text-sm uppercase tracking-[0.1em] text-foreground"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    to={isAuthed ? "/admin" : "/login"}
                    className="font-mono text-sm uppercase tracking-[0.1em] text-primary"
                  >
                    Admin
                  </Link>
                </SheetClose>
                <div className="pt-2">
                  <SearchBar data={data} className="w-full focus-within:w-full" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
