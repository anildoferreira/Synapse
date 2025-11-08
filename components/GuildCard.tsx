import React from 'react';
import type { Agent, Guild, Project } from '../types';
import { UserGroupIcon, BeakerIcon } from './IconComponents';

interface GuildCardProps {
  guild: Guild;
  project: Project;
  masterAgent: Agent;
  memberAgents: Agent[];
}

const GuildCard: React.FC<GuildCardProps> = ({ guild, project, masterAgent, memberAgents }) => {
  return (
    <div className="bg-slate-800/70 border border-cyan-500/50 rounded-lg p-4 w-full flex flex-col text-left">
      <div className="flex items-center gap-3 mb-3">
        <div className="grid place-items-center w-12 h-12 rounded-full bg-cyan-500/20 ring-2 ring-cyan-500">
          <UserGroupIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">Guilda Ativa</h3>
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Líder: {masterAgent.specialty}</p>
        </div>
      </div>
      
      <div className="bg-slate-900/50 border border-slate-700 rounded-md p-3 mb-3">
        <p className="text-xs text-slate-400 mb-1 flex items-center gap-2"><BeakerIcon className="w-4 h-4 text-cyan-300"/>Projeto Alvo:</p>
        <p className="font-semibold text-slate-200">{project.description}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Membros Especialistas:</h4>
        <div className="flex flex-wrap gap-2">
            {memberAgents.map(member => (
                <span key={member.id} className="text-xs text-slate-300 bg-slate-700 px-2 py-1 rounded-full">{member.specialty}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GuildCard;
