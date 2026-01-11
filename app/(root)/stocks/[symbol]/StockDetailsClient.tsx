"use client";
import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

interface Props {
  symbol: string;
}

export default function StockDetailsClient({ symbol }: Props) {
  const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-2 shadow-md">
            <TradingViewWidget
              title=""
              scriptUrl={`${scriptUrl}symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
              height={170}
            />
          </div>
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-2 shadow-md">
            <TradingViewWidget
              title=""
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
              height={600}
            />
          </div>
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-2 shadow-md">
            <TradingViewWidget
              title=""
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={BASELINE_WIDGET_CONFIG(symbol)}
              height={600}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-3 shadow-md">
            <WatchlistButton symbol={symbol} />
          </div>

          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-2 shadow-md">
            <TradingViewWidget
              title=""
              scriptUrl={`${scriptUrl}technical-analysis.js`}
              config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
              height={400}
            />
          </div>
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-2 shadow-md">
            <TradingViewWidget
              title=""
              scriptUrl={`${scriptUrl}symbol-profile.js`}
              config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
              height={440}
            />
          </div>
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-2 shadow-md">
            <TradingViewWidget
              title=""
              scriptUrl={`${scriptUrl}financials.js`}
              config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
              height={464}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
