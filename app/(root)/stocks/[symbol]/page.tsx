import StockDetailsClient from "./StockDetailsClient";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 py-10 sm:px-6 lg:px-10">
      <StockDetailsClient symbol={symbol} />
    </div>
  );
}
