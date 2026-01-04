import { Outlet } from "react-router";

export default function About() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">關於我們</h1>
      <Outlet />
    </div>
  );
}
