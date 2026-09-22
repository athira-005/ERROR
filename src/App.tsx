import { useRouter } from './hooks/useRouter';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LibraryPage } from './pages/LibraryPage';
import { DeviceDetailPage } from './pages/DeviceDetailPage';
import { VirtualLabPage } from './pages/VirtualLabPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { CareerPage } from './pages/CareerPage';
import { getDeviceById } from './data';

function App() {
  const { route } = useRouter();

  const renderPage = () => {
    switch (route.name) {
      case 'home':
        return <LandingPage />;
      case 'library':
        return <LibraryPage initialCategory={route.categoryId} />;
      case 'device': {
        const device = getDeviceById(route.deviceId);
        if (!device) return <NotFoundPage message="Device not found" />;
        return <DeviceDetailPage device={device} />;
      }
      case 'lab': {
        const device = getDeviceById(route.deviceId);
        if (!device) return <NotFoundPage message="Virtual lab not found" />;
        return <VirtualLabPage device={device} />;
      }
      case 'dashboard':
        return <DashboardPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'careers':
        return <CareerPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}

function NotFoundPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">{message}</h1>
        <p className="text-slate-500">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}

export default App;
