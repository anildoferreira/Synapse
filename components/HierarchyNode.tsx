
import React from 'react';

interface HierarchyNodeProps {
  level: number;
  title: string;
  subtitle: string;
  description: string;
  principles: string[];
  icon: React.ReactNode;
  children?: React.ReactNode;
  color: string;
}

const HierarchyNode: React.FC<HierarchyNodeProps> = ({ level, title, subtitle, description, principles, icon, children, color }) => {
  const colorClasses: { [key: string]: { border: string, text: string, ring: string, bg: string, shadow: string } } = {
    slate: { border: 'border-slate-500', text: 'text-slate-400', ring: 'ring-slate-500', bg: 'bg-slate-500/10', shadow: 'hover:shadow-slate-500/20' },
    red: { border: 'border-red-500', text: 'text-red-400', ring: 'ring-red-500', bg: 'bg-red-500/10', shadow: 'hover:shadow-red-500/20' },
    amber: { border: 'border-amber-500', text: 'text-amber-400', ring: 'ring-amber-500', bg: 'bg-amber-500/10', shadow: 'hover:shadow-amber-500/20' },
    indigo: { border: 'border-indigo-500', text: 'text-indigo-400', ring: 'ring-indigo-500', bg: 'bg-indigo-500/10', shadow: 'hover:shadow-indigo-500/20' },
    cyan: { border: 'border-cyan-500', text: 'text-cyan-400', ring: 'ring-cyan-500', bg: 'bg-cyan-500/10', shadow: 'hover:shadow-cyan-500/20' },
    teal: { border: 'border-teal-500', text: 'text-teal-400', ring: 'ring-teal-500', bg: 'bg-teal-500/10', shadow: 'hover:shadow-teal-500/20' },
    purple: { border: 'border-purple-500', text: 'text-purple-400', ring: 'ring-purple-500', bg: 'bg-purple-500/10', shadow: 'hover:shadow-purple-500/20' },
  };
  const classes = colorClasses[color] || colorClasses.slate;


  return (
    <div className="flex flex-col items-center w-full">
      <div className={`relative bg-slate-800 border ${classes.border} rounded-xl shadow-lg w-full max-w-4xl p-6 transition-all duration-300 hover:shadow-2xl ${classes.shadow}`}>
        <div className={`absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-700 border ${classes.border} px-4 py-1 rounded-full text-sm font-semibold text-slate-200`}>
          Nível {level}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className={`flex-shrink-0 grid place-items-center w-16 h-16 rounded-full ${classes.bg} ${classes.ring} ring-2`}>
            <div className={`${classes.text} w-8 h-8`}>{icon}</div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className={`${classes.text} font-semibold mb-3`}>{subtitle}</p>
            <p className="text-slate-400 mb-4">{description}</p>
            <div className="border-t border-slate-700 pt-3">
              <h4 className="font-semibold text-slate-200 mb-2">Princípios:</h4>
              <ul className="flex flex-wrap gap-2">
                {principles.map((p, i) => (
                  <li key={i} className="bg-slate-700/80 text-slate-300 text-xs font-medium px-3 py-1 rounded-full">{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {children && (
        <div className="flex flex-col items-center w-full mt-4">
            {children}
        </div>
      )}
    </div>
  );
};

export default HierarchyNode;