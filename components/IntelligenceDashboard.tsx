import React from 'react';
import type { IntelligenceReport, StrategicInsight } from '../types';
import { XCircleIcon, DocumentMagnifyingGlassIcon, BoltIcon } from './IconComponents';

interface IntelligenceDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    reports: IntelligenceReport[];
    insights: StrategicInsight[];
    onActOnIntelligence: (reportId: string) => void;
    competitors: { id: string, name: string }[];
}

const WEAKNESS_INFO: { [key in IntelligenceReport['revealedWeakness']]: { text: string, color: string } } = {
    'POOR_SEO': { text: 'SEO Ruim', color: 'text-amber-400' },
    'POOR_SENTIMENT': { text: 'Sentimento Baixo', color: 'text-rose-400' },
};

const IntelligenceDashboard: React.FC<IntelligenceDashboardProps> = ({ isOpen, onClose, reports, insights, onActOnIntelligence, competitors }) => {
    if (!isOpen) return null;

    const getCompetitorName = (id: string) => competitors.find(c => c.id === id)?.name || id;

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-fade-in-fast backdrop-blur-sm">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <DocumentMagnifyingGlassIcon className="w-7 h-7 text-sky-400"/>
                        Centro de Inteligência
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <XCircleIcon className="w-8 h-8"/>
                    </button>
                </header>
                
                <div className="p-6 flex-grow overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Intelligence Reports Column */}
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4">Relatórios de Inteligência</h3>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                            {reports.length > 0 ? reports.map(report => (
                                <div key={report.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                                    <p className="font-bold text-slate-200">Alvo: {getCompetitorName(report.competitorId)}</p>
                                    <p className="text-sm text-slate-300 my-2">{report.summary}</p>
                                    <div className="flex justify-between items-center text-xs mt-3">
                                        <div>
                                            <span className="font-semibold text-slate-400">Fraqueza: </span>
                                            <span className={`font-bold ${WEAKNESS_INFO[report.revealedWeakness]?.color || 'text-white'}`}>{WEAKNESS_INFO[report.revealedWeakness]?.text || report.revealedWeakness}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-400">Confiança: </span>
                                            <span className="font-bold text-white">{(report.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                                        <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${report.confidence * 100}%` }}></div>
                                    </div>
                                    <button
                                        onClick={() => onActOnIntelligence(report.id)}
                                        className="w-full mt-4 bg-amber-600 text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-700"
                                    >
                                        <BoltIcon className="w-5 h-5" />
                                        Agir Sobre Isso
                                    </button>
                                </div>
                            )) : <p className="text-slate-500 text-center py-8">Nenhum relatório de inteligência disponível. Designe um Agente de Inteligência Competitiva para uma tarefa.</p>}
                        </div>
                    </section>

                    {/* Strategic Insights Column */}
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4">Insights Estratégicos</h3>
                        <div className="space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                             {insights.length > 0 ? insights.map(insight => (
                                <div key={insight.id} className="bg-slate-700/50 p-3 rounded-lg border-l-4 border-fuchsia-500">
                                    <p className="text-sm text-slate-300">{insight.text}</p>
                                    <p className="text-xs text-slate-500 text-right mt-1">{new Date(insight.timestamp).toLocaleDateString()}</p>
                                </div>
                            )) : <p className="text-slate-500 text-center py-8">Nenhum insight estratégico gerado. Designe um Economista de Mercado para uma tarefa de previsão.</p>}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default IntelligenceDashboard;
