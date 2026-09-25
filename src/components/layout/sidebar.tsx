import LogoutButton from "@/components/layout/logout-button";

const Sidebar = () => (
  <aside className="hidden w-64 flex-col border-r md:flex">
    <div className="flex h-16 items-center border-b px-6">
      <h1 className="text-xl font-semibold">Task Manager</h1>
    </div>
  </aside>
);

export default Sidebar;