import CurrencyConverter from '../components/CurrencyConverter';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <CurrencyConverter />
      </div>
    </div>
  );
}