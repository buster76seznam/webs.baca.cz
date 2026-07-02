import { Suspense } from "react";
import UnsubscribeContent from "./UnsubscribeContent";

export const metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from email notifications",
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
