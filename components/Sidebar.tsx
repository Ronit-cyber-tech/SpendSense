// "use client";
// import Link from "next/link";
// import React from "react";
// import { usePathname } from "next/navigation";

// const nav = [
//   { href: "/", label: "Dashboard" },
//   { href: "/transactions", label: "Transactions" },
//   { href: "/income", label: "Income" },
//   { href: "/budget", label: "Budget" },
//   { href: "/goals", label: "Goals" },
//   { href: "/insights", label: "Insights" },
//   { href: "/learn", label: "Learn" },
//   { href: "/calculators/compound", label: "Calculator" },
//   { href: "/assistant", label: "AI Assistant" },
//   { href: "/settings", label: "Settings" }
// ];

// export const Sidebar: React.FC = () => {
//   const path = usePathname();
//   return (
//     <aside className="hidden md:block md:w-64 bg-white border-r h-screen p-4">
//       <div className="text-2xl font-bold text-primary mb-6">SpendSense</div>
//       <nav className="space-y-2">
//         {nav.map((n) => {
//           const active = path === n.href;
//           return (
//             <Link key={n.href} href={n.href} className={`block px-3 py-2 rounded ${active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
//               {n.label}
//             </Link>
//           );
//         })}
//       </nav>
//       <div className="mt-6 text-xs text-gray-500">
//         Built for students & young earners. Data stored locally.
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/income", label: "Income" },
  { href: "/budget", label: "Budget" },
  { href: "/goals", label: "Goals" },
  { href: "/insights", label: "Insights" },
  { href: "/learn", label: "Learn" },
  { href: "/calculators/compound", label: "Calculator" },
  { href: "/assistant", label: "AI Assistant" },
  { href: "/settings", label: "Settings" },
  { href: "/profile", label: "Profile" },
];

const isActive = (path: string, href: string) => {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
};

export const Sidebar: React.FC = () => {
  const path = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryItems = nav.filter((item) =>
    ["/", "/transactions", "/budget", "/profile"].includes(item.href)
  );

  const moreItems = nav.filter(
    (item) =>
      !["/", "/transactions", "/budget", "/profile"].includes(item.href)
  );

  const linkClass = (href: string) =>
    `block rounded-lg px-3 py-2.5 text-sm transition-colors ${
      isActive(path, href)
        ? "bg-primary text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:border-r md:border-gray-200 md:bg-white md:p-4">
        <Link
          href="/"
          className="mb-6 text-2xl font-bold text-primary"
        >
          SpendSense
        </Link>

        <nav className="flex-1 space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(path, item.href) ? "page" : undefined}
              className={linkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 text-xs text-gray-500">
          Built for students and young earners.
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="md:hidden">
        {/* More menu */}
        {moreOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setMoreOpen(false)}
            />

            <nav
              aria-label="More navigation options"
              className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 max-h-[65dvh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-3 shadow-xl"
            >
              <div className="mb-2 px-3 py-2 font-semibold text-gray-900">
                More options
              </div>

              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    isActive(path, item.href) ? "page" : undefined
                  }
                  onClick={() => setMoreOpen(false)}
                  className={`mb-1 ${linkClass(item.href)}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </>
        )}

        {/* Fixed bottom navigation bar */}
        <nav
          aria-label="Main mobile navigation"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 shadow-lg backdrop-blur"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <div className="mx-auto grid max-w-lg grid-cols-5">
            {primaryItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isActive(path, item.href) ? "page" : undefined
                }
                className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-xs ${
                  isActive(path, item.href)
                    ? "font-semibold text-primary"
                    : "text-gray-600"
                }`}
              >
                <span>
                  {item.href === "/"
                    ? "⌂"
                    : item.href === "/transactions"
                      ? "⇄"
                      : "₹"}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              type="button"
              aria-expanded={moreOpen}
              aria-label="More navigation options"
              onClick={() => setMoreOpen((open) => !open)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-xs ${
                moreOpen ||
                moreItems.some((item) => isActive(path, item.href))
                  ? "font-semibold text-primary"
                  : "text-gray-600"
              }`}
            >
              <span>•••</span>
              <span>More</span>
            </button>

            <Link
              href="/profile"
              aria-current={
                isActive(path, "/profile") ? "page" : undefined
              }
              className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-xs ${
                isActive(path, "/profile")
                  ? "font-semibold text-primary"
                  : "text-gray-600"
              }`}
            >
              <span>●</span>
              <span>Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;