import Instructions from "./Instructions";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      {/* Instructions in the center */}
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <Instructions />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
