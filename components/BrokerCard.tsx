import React, { useState } from 'react';
import type { Agent, Task } from '../types';
import { UsersIcon, RectangleGroupIcon, ClipboardListIcon, ChevronDownIcon, BanknotesIcon, LockClosedIcon, BoltIcon, ScaleIcon, ArrowTrendingUpIcon, FlagIcon } from './IconComponents';

interface BrokerCardProps {
  agent: Agent; // This is the Broker agent itself
  managedTasks: Task[];
  getTaskStatusStyles: (status: any) => string;
  onInjectFunds: (id: string) => void;
}

const getStrategyInfo = (strategy?: 'AGGRESSIVE' | 'BALANCED' | 'FRUGAL') => {
    switch (strategy) {
        case 'AGGRESSIVE':
            return { icon: BoltIcon, text: 'Agressiva', color: 'text-red-400' };
        case 'BALANCED':
            return { icon: ScaleIcon, text: 'Equilibrada', color: 'text-sky-400' };
        case 'FRUGAL':
            return { icon: ArrowTrendingUpIcon, text: 'Econômica', color: 'text-amber-400' };
        default:
            return { icon: ScaleIcon, text: 'N/A', color: 'text-slate-400' };
    }
}

const BrokerCard: React.FC<BrokerCardProps> = ({ agent, managedTasks, getTaskStatusStyles, onInjectFunds }) => {
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const pendingOrInProgressTasks = managedTasks.filter(t => t.status !== 'Concluído');
  const strategyInfo = getStrategyInfo(agent.biddingStrategy);
  const StrategyIcon = strategyInfo.icon;

  return (
    <div className={`bg-slate-800 border rounded-lg p-4 w-full flex flex-col text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${agent.isFrozen ? 'border-red-500/50 hover:shadow-red-500/20' : 'border-indigo-500/50 hover:shadow-indigo-500/20'}`}>
      <div className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-indigo-500/20 ring-2 ring-indigo-500 mb-3">
          <UsersIcon className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="font-semibold text-slate-100 truncate" title={agent.specialty}>{agent.specialty}</h3>
      <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Broker</p>
      
      <div title={`Estratégia: ${strategyInfo.text}`} className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full bg-slate-700/80 my-3 ${strategyInfo.color}`}>
          <StrategyIcon className="w-4 h-4" />
          {strategyInfo.text}
      </div>

      <div className="w-full flex justify-around items-center gap-2 my-2 border-y border-slate-700/50 py-3">
          <div className="flex items-center gap-2 text-sm text-indigo-300" title="Tesouraria">
              {agent.isFrozen 
                ? <LockClosedIcon className="w-5 h-5 text-red-400" />
                : <BanknotesIcon className="w-5 h-5 text-green-400" />
              }
              <strong className={`font-bold ${agent.isFrozen ? 'text-red-400' : 'text-white'}`}>${agent.treasury?.toLocaleString() || 0}</strong>
          </div>
          <div className="flex items-center gap-2 text-sm text-indigo-300" title="Contratos Ativos">
              <RectangleGroupIcon className="w-5 h-5" />
              <strong className="text-white">{managedTasks.length}</strong>
          </div>
          <div className="flex items-center gap-2 text-sm text-indigo-300" title="Capital Político">
              <FlagIcon className="w-5 h-5 text-fuchsia-400" />
              <strong className="text-white">{agent.politicalCapital || 0}</strong>
          </div>
      </div>

      {managedTasks.length > 0 && (
        <div className="w-full">
            <button 
                onClick={() => setIsTaskListOpen(!isTaskListOpen)}
                className="w-full flex justify-between items-center text-sm font-semibold text-indigo-300 hover:text-indigo-200"
            >
                <div className="flex items-center gap-2">
                    <ClipboardListIcon className="w-5 h-5"/>
                    <span>Fila de Contratos</span>
                     {pendingOrInProgressTasks.length > 0 && <span className="grid place-items-center bg-indigo-500 text-white text-xs font-bold rounded-full w-5 h-5">{pendingOrInProgressTasks.length}</span>}
                </div>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isTaskListOpen ? 'rotate-180' : ''}`} />
            </button>
            {isTaskListOpen && (
                <div className="mt-2 text-left space-y-2 max-h-40 overflow-y-auto pr-1">
                    {managedTasks.map(task => (
                        <div key={task.id} className="bg-slate-700/50 p-2 rounded-md border border-slate-600/50">
                            <div className="flex justify-between items-start gap-2">
                                <p className="text-xs text-slate-300 flex-1">{task.description}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTaskStatusStyles(task.status)}`}>{task.status}</span>
                            </div>
                        </div>
                    ))}
                    {managedTasks.length === 0 && <p className="text-xs text-slate-500 text-center py-2">Nenhuma tarefa atribuída.</p>}
                </div>
            )}
        </div>
      )}
      <div className="border-t border-slate-700/50 mt-4 pt-3 flex justify-end">
        <button
            onClick={() => onInjectFunds(agent.id)}
            className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs"
            disabled={agent.isFrozen}
            title={agent.isFrozen ? "Tesouraria congelada" : "Injetar fundos na tesouraria do Broker"}
        >
            <BanknotesIcon className="w-4 h-4" />
            Injetar Fundos
        </button>
    </div>
    </div>
  );
};

export default BrokerCard;