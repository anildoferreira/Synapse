import React from 'react';
import type { TechTreeNode, TechTreeState, Project } from '../types';
import { XCircleIcon, BeakerIcon, LockClosedIcon, CheckCircleIcon } from './IconComponents';

interface TechTreeDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    techTreeData: TechTreeNode[];
    techTreeState: TechTreeState;
    systemTreasury: number;
    onStartResearch: (nodeId: string) => void;
    projects: Project[];
}

const TechTreeDashboard: React.FC<TechTreeDashboardProps> = ({
    isOpen,
    onClose,
    techTreeData,
    techTreeState,
    systemTreasury,
    onStartResearch,
    projects
}) => {
    if (!isOpen) return null;

    const tiers = [1, 2, 3, 4];

    const getStatus = (node: TechTreeNode) => {
        if (techTreeState.unlockedNodeIds.includes(node.id)) return 'unlocked';
        if ((node.requiredNodeIds || []).every(reqId => techTreeState.unlockedNodeIds.includes(reqId))) return 'researchable';
        return 'locked';
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-fade-in-fast backdrop-blur-sm">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BeakerIcon className="w-7 h-7 text-cyan-400"/>
                        Pesquisa & Desenvolvimento
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <XCircleIcon className="w-8 h-8"/>
                    </button>
                </header>

                <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                    <div className="flex justify-around items-start gap-4">
                        {tiers.map(tier => (
                            <div key={tier} className="flex flex-col items-center gap-8 w-1/4">
                                <h3 className="text-lg font-bold text-slate-300 bg-slate-700 px-4 py-1 rounded-full">Nível {tier}</h3>
                                {techTreeData.filter(node => node.tier === tier).map(node => {
                                    const status = getStatus(node);
                                    const researchProgress = techTreeState.researchProgress[node.id] || 0;
                                    const isResearching = projects.some(p => p.projectType === 'RESEARCH' && p.researchUnlockId === node.id && p.status !== 'Concluído');
                                    const progressPercent = Math.min(100, (researchProgress / node.researchTime) * 100);

                                    let borderColor = 'border-slate-600';
                                    if (status === 'unlocked') borderColor = 'border-green-500';
                                    if (status === 'researchable') borderColor = 'border-sky-500';

                                    const Icon = node.icon;

                                    return (
                                        <div key={node.id} className={`relative bg-slate-700/50 border-2 ${borderColor} rounded-lg p-4 w-full text-center transition-all ${status === 'locked' ? 'opacity-50' : ''}`}>
                                            {status === 'unlocked' && <CheckCircleIcon className="absolute -top-3 -right-3 w-7 h-7 text-green-400 bg-slate-800 rounded-full" />}
                                            <div className={`mx-auto grid place-items-center w-12 h-12 rounded-full mb-3 ${status === 'locked' ? 'bg-slate-600' : 'bg-cyan-500/20'}`}>
                                                <Icon className={`w-7 h-7 ${status === 'locked' ? 'text-slate-400' : 'text-cyan-400'}`} />
                                            </div>
                                            <h4 className="font-bold text-white">{node.name}</h4>
                                            <p className="text-xs text-slate-400 mt-1 h-16">{node.description}</p>
                                            
                                            {isResearching || progressPercent > 0 ? (
                                                <div className="mt-3">
                                                    <p className="text-xs font-semibold text-sky-300 mb-1">Em Pesquisa...</p>
                                                    <div className="w-full bg-slate-600 rounded-full h-2.5">
                                                        <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                                    </div>
                                                </div>
                                            ) : status === 'researchable' ? (
                                                <button 
                                                    onClick={() => onStartResearch(node.id)}
                                                    disabled={systemTreasury < node.cost || isResearching}
                                                    className="w-full mt-3 bg-sky-600 text-white text-sm font-semibold py-2 px-3 rounded-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
                                                >
                                                    Pesquisar (${node.cost.toLocaleString()})
                                                </button>
                                            ) : status === 'locked' ? (
                                                 <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
                                                    <LockClosedIcon className="w-4 h-4"/>
                                                    <span>Bloqueado</span>
                                                 </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechTreeDashboard;
