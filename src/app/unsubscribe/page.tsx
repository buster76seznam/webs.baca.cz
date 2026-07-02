import { Suspense } from "react";
import UnsubscribeContent from "./UnsubscribeContent";

export const metadata = {
  title: "Odhlášení z odběru",
  description: "Odhlášení z e-mailového odběru",
};

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-zinc-500">Načítání...</div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
