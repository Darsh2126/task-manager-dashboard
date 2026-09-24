import LogoutButton from "@/components/layout/logout-button";

const Header = () =>
(
  <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
    <h1 className="text-xl font-semibold md:hidden">
      Task Manager
    </h1>
    <div className="md:hidden">
      <LogoutButton />
    </div>
  </header>
);

export default Header;