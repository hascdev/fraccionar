import CalculatorContent from "~/components/CalculatorContent";
import MonthTableContent from "~/components/MonthTableContent";

export default function PagesChallenge() {

  return (
    <main className="pt-10 sm:pt-24 pb-32 min-h-screen antialiased">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-0">
        <header>
          <h1 className="sm:text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Valores de UF (CLF)</h1>
        </header>
        <CalculatorContent />
        <MonthTableContent />        
      </div>
    </main>
  );
}
