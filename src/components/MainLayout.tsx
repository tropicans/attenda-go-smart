import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16"> {/* pt-16 untuk memberi ruang di bawah header fixed */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
