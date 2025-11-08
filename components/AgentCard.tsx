import React from 'react';
import type { Agent, Task, Project, AgentTrait, Faction } from '../types';
import { AgentStatus, AgentMentalState } from '../types';
import { XCircleIcon, ArrowUpCircleIcon, AcademicCapIcon, SnowflakeIcon, ArrowUpRightIcon, TrophyIcon, ArrowTrendingUpIcon, ShieldIcon, HandThumbUpIcon, BoltIcon, HeartIcon, Battery50Icon, PauseCircleIcon, LightBulbIcon, ScaleIcon, FlagIcon, FaceSmileIcon, FaceFrownIcon, GiftIcon, HeartPulseIcon, BanknotesIcon, LinkIcon, ExclamationCircleIcon, HandRaisedIcon, CubeTransparentIcon, SunIcon, ArrowUpOnSquareIcon } from './IconComponents';

interface AgentCardProps {
  agent: Agent;
  task?: Task;
  project?: Project;
  allBrokers: Agent[];
  allAgents: Agent[];
  onDelete: (id: string) => void;
  onPromote: (id: string) => void;
  onPromoteCareer: (id: string) => void;
  onSabbatical: (id: string) => void;
  isCouncilMember: boolean;
  onProposeGovernance: (id: string) => void;
  onReward: (id: string) => void;
  faction?: Faction;
}

const getStatusStyles = (status: AgentStatus) => {
  switch (status) {
    case AgentStatus.WORKING:
      return { bg: 'bg-green-500/20', text: 'text-green-400', ring: 'ring-green-500' };
    case AgentStatus.PROMOTION_CANDIDATE:
      return { bg: 'bg-amber-500/20', text: 'text-amber-400', ring: 'ring-amber-500' };
    case AgentStatus.IN_TRAINING:
      return { bg: 'bg-purple-500/20', text: 'text-purple-400', ring: 'ring-purple-500' };
    case AgentStatus.COMPROMISED:
      return { bg: 'bg-red-500/20', text: 'text-red-400', ring: 'ring-red-500' };
    case AgentStatus.IN_GUILD:
        return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', ring: 'ring-cyan-500' };
    case AgentStatus.MENTORING:
        return { bg: 'bg-violet-500/20', text: 'text-violet-400', ring: 'ring-violet-500' };
    case AgentStatus.UNDER_MENTORSHIP:
        return { bg: 'bg-pink-500/20', text: 'text-pink-400', ring: 'ring-pink-500' };
    case AgentStatus.HIBERNATING:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', ring: 'ring-gray-500' };
    case AgentStatus.ON_LOAN:
        return { bg: 'bg-lime-500/20', text: 'text-lime-400', ring: 'ring-lime-500' };
    case AgentStatus.AWAITING_PROMOTION:
        return { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400', ring: 'ring-fuchsia-500' };
    case AgentStatus.FREELANCER:
        return { bg: 'bg-sky-500/20', text: 'text-sky-300', ring: 'ring-sky-400' };
    case AgentStatus.ON_SABBATICAL:
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500' };
    case AgentStatus.BURNOUT:
        return { bg: 'bg-orange-600/20', text: 'text-orange-400', ring: 'ring-orange-500' };
    case AgentStatus.CO_PILOT_AGI:
        return { bg: 'bg-yellow-400/20', text: 'text-yellow-300', ring: 'ring-yellow-400' };
    default:
      return { bg: 'bg-slate-500/20', text: 'text-slate-400', ring: 'ring-slate-500' };
  }
};

const getMentalStateStyles = (state: AgentMentalState) => {
    switch (state) {
        case AgentMentalState.FOCUSED:
            return { icon: FaceSmileIcon, text: 'text-green-400', bg: 'bg-green-500' };
        case AgentMentalState.STRESSED:
            return { icon: FaceFrownIcon, text: 'text-amber-400', bg: 'bg-amber-500' };
        case AgentMentalState.FATIGUED:
            return { icon: FaceFrownIcon, text: 'text-orange-400', bg: 'bg-orange-500' };
        case AgentMentalState.BURNOUT:
            return { icon: FaceFrownIcon, text: 'text-red-400', bg: 'bg-red-500' };
        default:
            return { icon: FaceSmileIcon, text: 'text-slate-400', bg: 'bg-slate-500' };
    }
};

const TRAIT_INFO: { [key in AgentTrait]: { icon: React.FC<{className?: string}>, description: string, color: string } } = {
    "Ambicioso": { icon: ArrowTrendingUpIcon, description: "Ambicioso: Ganha mais XP, mas pode assumir riscos.", color: "text-amber-400" },
    "Cauteloso": { icon: ShieldIcon, description: "Cauteloso: Menor chance de ser comprometido, mas pode ser mais lento.", color: "text-sky-400" },
    "Colaborativo": { icon: HandThumbUpIcon, description: "Colaborativo: Aumenta a performance da equipe.", color: "text-green-400" },
    "Individualista": { icon: BoltIcon, description: "Individualista: Excelente sozinho, mas pode prejudicar a coesão da equipe.", color: "text-fuchsia-400" },
    "Ético": { icon: HeartIcon, description: "Ético: Menos propenso a causar violações éticas.", color: "text-rose-400" },
};

const LEGACY_INFO: { [key: string]: { icon: React.FC<{className?: string}>, text: string, color: string } } = {
    MATRIOSHKA: { icon: CubeTransparentIcon, text: "Foco: Cérebro Matrioska", color: "text-purple-400" },
    BENEVOLENT: { icon: SunIcon, text: "Foco: Supervisão Benevolente", color: "text-amber-400" },
    GALACTIC: { icon: ArrowUpOnSquareIcon, text: "Foco: Expansão Galáctica", color: "text-sky-400" },
};

const XP_THRESHOLDS: { [key: number]: number } = { 1: 100, 2: 500 };

const AgentCard: React.FC<AgentCardProps> = ({ agent, task, project, allBrokers, allAgents, onDelete, onPromote, onPromoteCareer, onSabbatical, isCouncilMember, onProposeGovernance, onReward, faction }) => {
  const statusStyles = getStatusStyles(agent.status);
  const isCompromised = agent.status === AgentStatus.COMPROMISED;
  const isBurnout = agent.status === AgentStatus.BURNOUT;
  const loanedToBroker = agent.loanedToBrokerId ? allBrokers.find(b => b.id === agent.loanedToBrokerId) : null;
  const xpForNextTier = XP_THRESHOLDS[agent.tier] || Infinity;
  const xpProgress = Math.min(100, ((agent.experience || 0) / xpForNextTier) * 100);
  
  const mentalStateStyles = getMentalStateStyles(agent.mentalState);
  const MentalStateIcon = mentalStateStyles.icon;

  const legacyInfo = agent.legacyFocus ? LEGACY_INFO[agent.legacyFocus] : null;

  const FACTION_COLORS: { [key: string]: string } = {
    sky: 'text-sky-400',
    red: 'text-red-400',
    teal: 'text-teal-400',
    amber: 'text-amber-400',
  };

  const relationships = Object.entries(agent.relationships || {})
    .map(([id, score]) => ({ id, score, agent: allAgents.find(a => a.id === id) }))
    .filter(r => r.agent && r.agent.id !== agent.id)
    .sort((a, b) => b.score - a.score);

  const ally = relationships.find(r => r.score > 20);
  const rival = relationships.slice().reverse().find(r => r.score < -20);


  return (
    <div className={`relative bg-slate-800 border rounded-lg p-4 w-full flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/50 ${isCompromised || isBurnout ? 'border-red-500/50' : 'border-slate-700'} ${isBurnout ? 'animate-pulse' : ''}`}>
      <button 
        onClick={() => onDelete(agent.id)}
        className="absolute top-2 right-2 text-slate-600 hover:text-red-500 transition-colors"
        aria-label={`Excluir agente ${agent.specialty}`}
      >
        <XCircleIcon className="w-5 h-5" />
      </button>

      <div className="flex-grow pr-4">
          <div className="flex items-center gap-2">
            {faction && (
              <div title={`Facção: ${faction.name}`} className={FACTION_COLORS[faction.color]}>
                  <FlagIcon className="w-4 h-4" />
              </div>
            )}
            <h3 className="font-semibold text-slate-200 truncate" title={agent.specialty}>{agent.specialty}</h3>
            <div className="flex text-amber-400" title={`Nível ${agent.tier}`}>
                {Array.from({ length: agent.tier }).map((_, i) => <span key={i} className="text-xs">★</span>)}
                {Array.from({ length: 3 - agent.tier }).map((_, i) => <span key={i} className="text-xs text-slate-600">★</span>)}
            </div>
             {isCouncilMember && (
                <div title="Membro do Conselho" className="text-cyan-400">
                    <ScaleIcon className="w-4 h-4" />
                </div>
            )}
          </div>
           {agent.status === AgentStatus.IN_GUILD && project && (
              <div className="text-[10px] text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full inline-block mt-1.5 font-semibold" title={project.description}>
                Guilda: {project.description.substring(0, 20)}...
              </div>
           )}
          <div className={`inline-flex items-center gap-2 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
              {agent.status !== AgentStatus.CO_PILOT_AGI && <span className={`h-2 w-2 rounded-full ${statusStyles.ring} ring-1 ring-offset-2 ring-offset-slate-800`}></span>}
              {agent.status === AgentStatus.CO_PILOT_AGI && <HandRaisedIcon className="w-4 h-4" />}
              {agent.status}
          </div>
          {legacyInfo && (
            <div className={`inline-flex items-center gap-2 mt-2 ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 ${legacyInfo.color}`}>
              <legacyInfo.icon className="w-4 h-4" />
              {legacyInfo.text}
            </div>
          )}
          {agent.status === AgentStatus.HIBERNATING && (
            <div className="text-[10px] text-gray-300 bg-gray-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5 font-semibold">
                <SnowflakeIcon className="w-3 h-3"/>
                 hibernando
             </div>
          )}
          {agent.status === AgentStatus.ON_LOAN && loanedToBroker && (
            <div className="text-[10px] text-lime-300 bg-lime-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5 font-semibold">
                <ArrowUpRightIcon className="w-3 h-3"/>
                Emprestado para {loanedToBroker.specialty.split(' ')[0]}
             </div>
          )}
          {(agent.status === AgentStatus.MENTORING || agent.status === AgentStatus.UNDER_MENTORSHIP) && (
             <div className="text-[10px] text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5 font-semibold">
                <AcademicCapIcon className="w-3 h-3"/>
                {agent.status === AgentStatus.MENTORING ? 'Mentor' : 'Aprendiz'}
             </div>
          )}
          {(agent.status === AgentStatus.WORKING || agent.status === AgentStatus.ON_LOAN) && task && (
            <p className="text-xs text-slate-400 mt-2 p-2 bg-slate-700/50 rounded-md border border-slate-600/50">
              <span className="font-bold text-slate-300">Tarefa:</span> {task.description}
            </p>
          )}
      </div>

       <div className="flex items-center gap-2 mt-4 border-t border-slate-700/50 pt-3">
          {(agent.traits || []).map(trait => {
            const info = TRAIT_INFO[trait];
            if (!info) return null;
            const Icon = info.icon;
            return (
              <div key={trait} title={info.description} className={`${info.color} hover:opacity-100 opacity-80 transition-opacity`}>
                <Icon className="w-5 h-5" />
              </div>
            );
          })}
        </div>

        {(ally || rival) && (
            <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-1.5 text-xs">
                {ally && (
                    <div className="flex justify-between items-center" title={`Aliança (Pontuação: ${ally.score.toFixed(0)})`}>
                        <span className="font-medium text-slate-400 flex items-center gap-1.5"><LinkIcon className="w-4 h-4 text-green-400"/>Aliado</span>
                        <span className="font-semibold text-slate-200 truncate">{ally.agent!.specialty}</span>
                    </div>
                )}
                {rival && (
                    <div className="flex justify-between items-center" title={`Rivalidade (Pontuação: ${rival.score.toFixed(0)})`}>
                        <span className="font-medium text-slate-400 flex items-center gap-1.5"><ExclamationCircleIcon className="w-4 h-4 text-red-400"/>Rival</span>
                        <span className="font-semibold text-slate-200 truncate">{rival.agent!.specialty}</span>
                    </div>
                )}
            </div>
        )}

      <div className="mt-2 space-y-3">
          {agent.tier < 3 && (
             <div>
              <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-400">XP</span>
                  <span className="text-xs font-bold text-slate-200">{agent.experience || 0} / {xpForNextTier}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-fuchsia-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
              </div>
          </div>
          )}
          <div>
              <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-400">Performance</span>
                  <span className={`text-xs font-bold ${isCompromised || isBurnout ? 'text-red-400' : 'text-slate-200'}`}>{isBurnout ? 0 : agent.performance}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${isCompromised || isBurnout ? 'bg-red-500' : (agent.performance > 85 ? 'bg-teal-400' : 'bg-indigo-500')}`} 
                      style={{ width: `${isBurnout ? 0 : agent.performance}%` }}
                  ></div>
              </div>
          </div>
          <div>
              <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><HeartPulseIcon className="w-4 h-4" />Moral</span>
                  <span className={`text-xs font-bold text-rose-400`}>{agent.morale}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div 
                      className={`h-1.5 rounded-full transition-all duration-500 bg-rose-500`} 
                      style={{ width: `${agent.morale}%` }}
                  ></div>
              </div>
          </div>
           <div>
              <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Battery50Icon className="w-4 h-4" />Estresse</span>
                  <span className={`text-xs font-bold ${mentalStateStyles.text}`}>{agent.stress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${mentalStateStyles.bg}`} 
                      style={{ width: `${agent.stress}%` }}
                  ></div>
              </div>
          </div>
          <div className="flex justify-between items-center text-xs pt-1">
              <span className="font-medium text-slate-400 flex items-center gap-1.5">
                <MentalStateIcon className={`w-4 h-4 ${mentalStateStyles.text}`} />
                Estado Mental
              </span>
              <span className={`font-bold ${mentalStateStyles.text}`}>{agent.mentalState}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1">
              <span className="font-medium text-slate-400 flex items-center gap-1.5">
                <BanknotesIcon className="w-4 h-4 text-green-400" />
                Salário
              </span>
              <span className="font-bold text-slate-200">${agent.salary}</span>
          </div>
      </div>
       <div className="mt-4 pt-3 border-t border-slate-700 space-y-2">
        {agent.status !== AgentStatus.ON_SABBATICAL && agent.status !== AgentStatus.BURNOUT && (
            <button
                onClick={() => onReward(agent.id)}
                className="w-full inline-flex items-center justify-center gap-2 bg-green-600/80 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-xs"
            >
                <GiftIcon className="w-5 h-5" />
                Recompensar
            </button>
        )}
        {agent.status === AgentStatus.PROMOTION_CANDIDATE && (
          <button
            onClick={() => onPromote(agent.id)}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-xs"
          >
            <ArrowUpCircleIcon className="w-5 h-5" />
            Promover a Broker
          </button>
        )}
        {agent.status === AgentStatus.AWAITING_PROMOTION && (
          <button
            onClick={() => onPromoteCareer(agent.id)}
            className="w-full inline-flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-xs"
          >
            <TrophyIcon className="w-5 h-5" />
            Promover Carreira
          </button>
        )}
        {isCouncilMember && (agent.status === AgentStatus.FREELANCER || agent.status === AgentStatus.WORKING) && (
           <button
              onClick={() => onProposeGovernance(agent.id)}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-600/80 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-xs"
            >
              <LightBulbIcon className="w-5 h-5" />
              Propor Governança
            </button>
        )}
        {agent.status === AgentStatus.FREELANCER && agent.stress > 70 && (
          <button
            onClick={() => onSabbatical(agent.id)}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600/80 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-xs"
          >
            <PauseCircleIcon className="w-5 h-5" />
            Colocar em Sabbatical
          </button>
        )}
      </div>
    </div>
  );
};

export default AgentCard;