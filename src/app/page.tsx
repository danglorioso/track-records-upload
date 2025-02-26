import Instructions from "./components/Instructions";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="bg-gray-900 h-screen flex flex-col items-center pt-8">
      {/* Instructions in the center */}
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-4-xl px-4 max-h-[calc(100vh-100px)]">
        <Instructions />
      </div>

      {/* Footer - always at bottom */}
      <Footer />
    </div>
  );
}
