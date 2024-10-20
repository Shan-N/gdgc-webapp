'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Home, Info, Menu, PersonStanding, Smartphone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function NavigationBurger() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  interface NavItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    color: string;
  }

  const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href, color }) => (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-4 ${color}`}
      onClick={() => handleLinkClick(href)}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-800 mb-6">GDGC PCCoE</SheetTitle>
        </SheetHeader>
            <nav className="grid gap-2 py-4">
              <NavItem icon={Home} label="Home" href="/" color="text-gray-600" />
              <NavItem icon={Info} label="Discord" href="/" color="text-blue-600" />
              <NavItem icon={CreditCard} label="RFID" href="/" color="text-red-600" />
              <NavItem icon={PersonStanding} label="Our Team" href="/" color="text-green-600" />
              <NavItem icon={Smartphone} label="Team behind the Webapp" href="/" color="text-yellow-600" />
            </nav>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm text-gray-600">Google Developer Student Clubs, Pimpri Chinchwad College of Engineering, Pune</p>
            </div>
      </SheetContent>
    </Sheet>
  );
}