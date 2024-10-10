import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="hidden lg:block lg:w-64 lg:h-screen bg-gray-800 text-white fixed top-0 left-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/">
                <span className="block p-2 hover:bg-gray-700 rounded">Home</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/Order">
                <span className="block p-2 hover:bg-gray-700 rounded">My Orders</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/Cart">
                <span className="block p-2 hover:bg-gray-700 rounded">My Cart</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/returns">
                <span className="block p-2 hover:bg-gray-700 rounded">Returns</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/contact">
                <span className="block p-2 hover:bg-gray-700 rounded">Contact Us</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
