import Instructions from "./components/Instructions";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-between">
      {/* Instructions in the center */}
      <div className="flex flex-col items-center justify-center w-full px-4 flex-1">
        <Instructions />
      </div>

      {/* Footer - always at bottom */}
      <Footer />
    </div>
  );
}
