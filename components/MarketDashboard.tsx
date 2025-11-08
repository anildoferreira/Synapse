

import React, { useState } from 'react';
import type { DigitalTwinState, Competitor, MarketEvent, StrategicInsight } from '../types';
import { ChartPieIcon, EyeIcon, SignalIcon, SparklesIcon, GlobeAltIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CrosshairsIcon, BoltIcon, MegaphoneIcon } from './IconComponents';

interface MarketDashboardProps {
  digitalTwin: DigitalTwinState;
  competitors: Competitor[];
  marketEvent: MarketEvent | null;
  strategicInsights: StrategicInsight[];
  onLaunchWarfare: (competitorId: string, attackType: 'SEO_ATTACK' | 'SENTIMENT_ATTACK') => void;
}

// Fix for line 17: Explicitly provide the generic type for props to React.cloneElement to ensure `className` is recognized as a valid property.
const StatCard: React.FC<{ icon: React.ReactElement, label: string, value: string, colorClass: string }> = ({ icon, label, value, colorClass }) => (
    <div className="bg-slate-800 p-3 rounded-lg flex items-center gap-3">
        <div className={`grid place-items-center w-10 h-10 rounded-full bg-${colorClass}-500/10`}>
            {React.cloneElement<{ className?: string }>(icon, { className: `w-6 h-6 text-${colorClass}-400` })}
        </div>
        <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-lg font-bold text-white">{value}</p>
        </div>
    </div>
);

const MarketDashboard: React.FC<MarketDashboardProps> = ({ digitalTwin, competitors, marketEvent, strategicInsights, onLaunchWarfare }) => {
    const [targetId, setTargetId] = useState<string | null>(null);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <GlobeAltIcon className="w-6 h-6 text-slate-400" />
                    Inteligência de Mercado
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <StatCard icon={<ChartPieIcon />} label="Fatia de Mercado" value={`${digitalTwin.marketShare.toFixed(1)}%`} colorClass="sky" />
                    <StatCard icon={<EyeIcon />} label="Tráfego" value={digitalTwin.traffic.toLocaleString()} colorClass="teal" />
                    <StatCard icon={<ArrowTrendingUpIcon />} label="Ranking SEO" value={`${digitalTwin.seoRanking.toFixed(0)}`} colorClass="amber" />
                    <StatCard icon={<SignalIcon />} label="Sentimento" value={`${digitalTwin.brandSentiment.toFixed(0)}`} colorClass="rose" />
                </div>
            </div>

            {marketEvent && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <p className="text-sm font-bold text-amber-300 mb-1">{marketEvent.title}</p>
                    <p className="text-xs text-slate-300">{marketEvent.description}</p>
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold text-white mb-3">Competidores</h3>
                <div className="space-y-3">
                    {competitors.map(c => (
                        <div key={c.id} className="bg-slate-800 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-slate-200">{c.name}</p>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    c.strategy === 'AGGRESSIVE' ? 'bg-red-500/20 text-red-400' : 
                                    c.strategy === 'BALANCED' ? 'bg-sky-500/20 text-sky-400' : 
                                    'bg-green-500/20 text-green-400'
                                }`}>{c.strategy}</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-2 flex justify-between">
                                <span>SEO: {c.digitalTwin.seoRanking.toFixed(0)}</span>
                                <span>Sentimento: {c.digitalTwin.brandSentiment.toFixed(0)}</span>
                                <span>Mercado: {c.digitalTwin.marketShare.toFixed(1)}%</span>
                            </div>
                             <div className="mt-3 border-t border-slate-700 pt-2 flex justify-end gap-2">
                                <button 
                                    onClick={() => onLaunchWarfare(c.id, 'SEO_ATTACK')}
                                    className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md hover:bg-amber-500/20 flex items-center gap-1"
                                    title="Lançar ataque de SEO"
                                >
                                    <BoltIcon className="w-3 h-3" /> SEO
                                </button>
                                <button 
                                    onClick={() => onLaunchWarfare(c.id, 'SENTIMENT_ATTACK')}
                                    className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md hover:bg-rose-500/20 flex items-center gap-1"
                                    title="Lançar campanha de sentimento negativo"
                                >
                                    <MegaphoneIcon className="w-3 h-3" /> Sentimento
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {strategicInsights.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-fuchsia-400"/>
                        Insights Estratégicos
                    </h3>
                    <div className="space-y-2">
                        {strategicInsights.map(insight => (
                            <p key={insight.id} className="text-xs bg-slate-800 p-2 rounded-md border-l-2 border-fuchsia-500 text-slate-300">
                                {insight.text}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketDashboard;