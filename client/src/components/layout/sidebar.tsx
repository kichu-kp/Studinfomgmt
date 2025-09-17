import { Link, useLocation } from "wouter";
import { 
  Home, 
  GraduationCap, 
  Book, 
  ClipboardList, 
  BarChart3, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Students", href: "/students", icon: GraduationCap },
  { name: "Courses", href: "/courses", icon: Book },
  { name: "Enrollments", href: "/enrollments", icon: ClipboardList },
  { name: "Grades", href: "/grades", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside 
      className={cn(
        "bg-sidebar border-r border-sidebar-border w-64 fixed lg:relative h-full transition-transform duration-200 ease-in-out z-30",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      data-testid="sidebar"
    >
      <nav className="p-4 pt-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href === "/" && location === "/dashboard");
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  data-testid={`link-${item.name.toLowerCase()}`}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
