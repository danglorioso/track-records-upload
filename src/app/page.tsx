import Instructions from "./components/Instructions";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-gray-900 h-screen flex flex-col">
      {/* Centered Instructions */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="transform scale-90 w-full max-w-4xl py-4">
          <Instructions />
        </div>
      </div>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );
}
