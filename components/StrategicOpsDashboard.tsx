import React from 'react';
import type { StrategicGoal, Campaign } from '../types';
import { XCircleIcon, FlagIcon, LightBulbIcon, BoltIcon, CheckCircleIcon, NoSymbolIcon, SparklesIcon, BanknotesIcon } from './IconComponents';

interface StrategicOpsDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    strategicGoals: StrategicGoal[];
    campaigns: Campaign[];
    onApproveStrategy: (goalId: string) => void;
    onProposeCampaigns: (goalId: string) => Promise<void>;
    onLaunchCampaign: (campaignId: string) => void;
    systemTreasury: number;
}

const getCampaignStatusStyles = (status: Campaign['status']) => {
    switch (status) {
        case 'PROPOSED': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/50' };
        case 'ACTIVE': return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/50' };
        case 'COMPLETED': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/50' };
        case 'FAILED': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/50' };
        default: return { bg: 'bg-slate-700', text: 'text-slate-400', border: 'border-slate-600' };
    }
};

const StrategicOpsDashboard: React.FC<StrategicOpsDashboardProps> = ({
    isOpen,
    onClose,
    strategicGoals,
    campaigns,
    onApproveStrategy,
    onProposeCampaigns,
    onLaunchCampaign,
    systemTreasury
}) => {
    if (!isOpen) return null;

    const proposedGoals = strategicGoals.filter(g => g.status === 'PROPOSED');
    const activeStrategy = strategicGoals.find(g => g.status === 'ACTIVE');
    const relatedCampaigns = activeStrategy ? campaigns.filter(c => c.strategicGoalId === activeStrategy.id) : [];
    const proposedCampaigns = relatedCampaigns.filter(c => c.status === 'PROPOSED');
    const otherCampaigns = relatedCampaigns.filter(c => c.status !== 'PROPOSED');

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-fade-in-fast backdrop-blur-sm">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BoltIcon className="w-7 h-7 text-indigo-400"/>
                        Operações Estratégicas
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <XCircleIcon className="w-8 h-8"/>
                    </button>
                </header>

                <div className="p-6 flex-grow overflow-y-auto custom-scrollbar space-y-8">
                    {/* Active Strategy Section */}
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><FlagIcon className="w-6 h-6 text-green-400" /> Estratégia Ativa</h3>
                        {activeStrategy ? (
                            <div className="bg-slate-700/50 border border-green-500/50 rounded-lg p-5">
                                <h4 className="text-lg font-bold text-green-300">{activeStrategy.title}</h4>
                                <p className="text-slate-300 my-2">{activeStrategy.description}</p>
                                <ul className="flex flex-wrap gap-2 mt-3">
                                    {activeStrategy.successMetrics.map((metric, i) => (
                                        <li key={i} className="text-xs bg-green-500/10 text-green-300 px-2 py-1 rounded-full">{metric}</li>
                                    ))}
                                </ul>
                                <div className="mt-5 text-center">
                                    <button
                                        onClick={() => onProposeCampaigns(activeStrategy.id)}
                                        className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed mx-auto"
                                    >
                                        <SparklesIcon className="w-5 h-5" />
                                        Planejar Campanhas com IA
                                    </button>
                                </div>
                            </div>
                        ) : (
                             <div className="text-center py-5 px-4 bg-slate-700/40 rounded-lg">
                                <p className="text-slate-400">Nenhuma estratégia ativa. Aprove uma das propostas abaixo para começar.</p>
                            </div>
                        )}
                    </section>
                    
                    {/* Campaigns Section */}
                    {activeStrategy && (
                        <section>
                             <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><LightBulbIcon className="w-6 h-6 text-amber-400" /> Campanhas Propostas</h3>
                             {proposedCampaigns.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 {proposedCampaigns.map(campaign => (
                                    <div key={campaign.id} className={`p-4 rounded-lg border ${getCampaignStatusStyles(campaign.status).border} ${getCampaignStatusStyles(campaign.status).bg} flex flex-col`}>
                                        <h5 className="font-bold text-white">{campaign.name}</h5>
                                        <p className="text-xs font-semibold uppercase tracking-wider my-1" style={{ color: getCampaignStatusStyles(campaign.status).text }}>{campaign.type}</p>
                                        <p className="text-sm text-slate-300 flex-grow mt-2 mb-4">{campaign.description}</p>
                                        <div className="flex justify-between items-center mt-auto">
                                             <div className="flex items-center gap-2 text-sm font-bold text-green-400">
                                                <BanknotesIcon className="w-5 h-5"/>
                                                <span>${campaign.cost.toLocaleString()}</span>
                                            </div>
                                            <button 
                                                onClick={() => onLaunchCampaign(campaign.id)}
                                                disabled={systemTreasury < campaign.cost}
                                                className="bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
                                            >Lançar</button>
                                        </div>
                                    </div>
                                 ))}
                                 </div>
                             ) : (
                                <div className="text-center py-5 px-4 bg-slate-700/40 rounded-lg">
                                    <p className="text-slate-400">Nenhuma campanha proposta. Clique em "Planejar Campanhas" para gerar opções.</p>
                                </div>
                             )}
                        </section>
                    )}

                    {/* Other Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Proposed Goals Section */}
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-4">Metas Propostas</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {proposedGoals.length > 0 ? proposedGoals.map(goal => (
                                    <div key={goal.id} className="bg-slate-700/50 p-3 rounded-lg">
                                        <p className="font-bold text-slate-200">{goal.title}</p>
                                        <p className="text-sm text-slate-400 mt-1">{goal.description}</p>
                                        <button 
                                            onClick={() => onApproveStrategy(goal.id)}
                                            disabled={!!activeStrategy}
                                            className="text-xs font-semibold text-white bg-green-600 px-3 py-1 rounded-md mt-3 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
                                        >
                                            Aprovar Estratégia
                                        </button>
                                    </div>
                                )) : <p className="text-sm text-slate-500">Nenhuma nova meta estratégica proposta.</p>}
                            </div>
                        </section>
                        
                        {/* Active/Completed Campaigns Section */}
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-4">Histórico de Campanhas</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                               {otherCampaigns.length > 0 ? otherCampaigns.map(campaign => (
                                    <div key={campaign.id} className={`p-2 rounded-md border-l-4 ${getCampaignStatusStyles(campaign.status).border} ${getCampaignStatusStyles(campaign.status).bg}`}>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-semibold text-slate-200">{campaign.name}</p>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getCampaignStatusStyles(campaign.status).bg} ${getCampaignStatusStyles(campaign.status).text}`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                    </div>
                               )) : <p className="text-sm text-slate-500">Nenhuma campanha ativa ou concluída para esta estratégia.</p>}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrategicOpsDashboard;
