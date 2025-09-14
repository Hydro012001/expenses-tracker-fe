import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuthStore } from "@/store/authStore";
interface NavbarProps {
  children?: ReactNode;
}
export default function Navbar({ children }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const navLinkClasses =
    "group inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-gray-900  dark:hover:text-gray-50  focus:outline-none disabled:pointer-events-none disabled:opacity-50 ";
  return (
    <>
      <header className="flex h-15 w-full shrink-0 items-center px-4 md:px-6 shadow">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pl-2">
            <NavLink to="#" className="mr-6 hidden lg:flex">
              <MountainIcon className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </NavLink>
            <div className="grid gap-2 py-6">
              <NavLink
                to="/"
                className="flex w-full items-center py-2 text-lg font-semibold"
              >
                Dashboard
              </NavLink>

              {/* <NavLink
                to="/expenses"
                className="flex w-full items-center py-2 text-lg font-semibold"
              >
                Expenses
              </NavLink> */}
              <NavLink
                to="/profile"
                className="flex w-full items-center py-2 text-lg font-semibold"
              >
                Profile
              </NavLink>
              {/* <NavLink
              to="#"
              className="flex w-full items-center py-2 text-lg font-semibold"
            >
              Contact
            </NavLink> */}
            </div>
          </SheetContent>
        </Sheet>
        <NavLink to="#" className="mr-6 hidden lg:flex lg:items-center gap-2 ">
          <MountainIcon className="h-9 w-9" />
          <span className="font-bold text-primary">ExpTrack</span>
        </NavLink>
        <nav className="ml-auto hidden lg:flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? "bg-primary text-white " : ""}`
            }
          >
            Dashboard
          </NavLink>

          {/* <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `${navLinkClasses} ${
                isActive ? "bg-primary text-white dark:bg-gray-800/50" : ""
              }`
            }
          >
            Expenses
          </NavLink> */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? "bg-primary text-white " : ""}`
            }
          >
            Profile
          </NavLink>
          <button
            onClick={logout}
            className={`${navLinkClasses} text-left w-full cursor-pointer`}
          >
            Logout
          </button>
          <div className="py-1.5 cursor-pointer">
            {theme == "light" ? (
              <Moon onClick={() => setTheme("dark")} />
            ) : (
              <Sun onClick={() => setTheme("light")} />
            )}
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
type MenuIconProps = React.SVGProps<SVGSVGElement>;
function MenuIcon(props: MenuIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: MenuIconProps) {
  return (
    <svg
      width={200}
      height={200}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <circle
        cx={100}
        cy={100}
        r={80}
        stroke="#6464FF"
        strokeWidth={10}
        fill="none"
        strokeDasharray={251.2}
        strokeDashoffset={50}
      />
      <text
        x="50%"
        y="50%"
        fontSize={60}
        fontWeight="bold"
        fill="#6464FF"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {"$"}
      </text>
    </svg>
  );
}
