import { NavLink } from "react-router-dom";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-2 font-mono text-xs uppercase tracking-[0.1em] transition-colors ${
    isActive
      ? "border-primary text-foreground"
      : "border-transparent text-muted-foreground hover:text-foreground"
  }`;

const AdminNav = () => (
  <div className="mb-8 flex gap-6 border-b border-primary/15">
    <NavLink to="/admin" end className={tabClass}>
      Minis
    </NavLink>
    <NavLink to="/admin/paints" className={tabClass}>
      Paints
    </NavLink>
  </div>
);

export default AdminNav;
