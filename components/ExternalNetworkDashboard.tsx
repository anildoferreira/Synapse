import React, { useState } from 'react';
import type { FinancialMarketState, PortfolioAsset } from '../types';
import { XCircleIcon, BanknotesIcon, ChartBarIcon, MegaphoneIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, LockClosedIcon } from './IconComponents';

interface ExternalNetworkDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    apiAccess: { financial: boolean, social: boolean };
    financialMarket: FinancialMarketState;
    portfolio: PortfolioAsset[];
    systemTreasury: number;
    onBuyStock: (symbol: string, shares: number) => void;
    onSellStock: (symbol: string, shares: number) => void;
    onLaunchSocialCampaign: () => void;
}

const ExternalNetworkDashboard: React.FC<ExternalNetworkDashboardProps> = ({
    isOpen,
    onClose,
    apiAccess,
    financialMarket,
    portfolio,
    systemTreasury,
    onBuyStock,
    onSellStock,
    onLaunchSocialCampaign,
}) => {
    if (!isOpen) return null;

    const [tradeAmounts, setTradeAmounts] = useState<{ [symbol: string]: string }>({});

    const handleAmountChange = (symbol: string, value: string) => {
        const amount = parseInt(value, 10);
        if (value === '' || (amount > 0 && !isNaN(amount))) {
            setTradeAmounts(prev => ({ ...prev, [symbol]: value }));
        }
    };

    const getPortfolioValue = () => {
        return portfolio.reduce((total, asset) => {
            const currentPrice = financialMarket[asset.symbol]?.currentPrice || 0;
            return total + (asset.shares * currentPrice);
        }, 0);
    };
    
    const SOCIAL_CAMPAIGN_COST = 500;

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-fade-in-fast backdrop-blur-sm">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BanknotesIcon className="w-7 h-7 text-green-400"/>
                        Rede Externa
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <XCircleIcon className="w-8 h-8"/>
                    </button>
                </header>

                <div className="p-6 flex-grow overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Financial Market */}
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <ChartBarIcon className="w-6 h-6 text-sky-400" />
                            Mercado Financeiro
                        </h3>
                        {!apiAccess.financial ? (
                            <div className="h-full flex flex-col items-center justify-center bg-slate-700/30 rounded-lg p-8 text-center">
                                <LockClosedIcon className="w-12 h-12 text-slate-500 mb-4" />
                                <h4 className="font-bold text-slate-300">Acesso à API Bloqueado</h4>
                                <p className="text-sm text-slate-400">Pesquise a tecnologia "API: Mercado Financeiro" no painel de P&D para desbloquear a negociação de ações.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-slate-300 mb-2">Sua Carteira</h4>
                                    <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <p className="text-slate-400 text-sm">Valor Total: <span className="font-bold text-white">${getPortfolioValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                                        <ul className="mt-2 space-y-2">
                                            {portfolio.map(asset => {
                                                const currentPrice = financialMarket[asset.symbol].currentPrice;
                                                const pnl = (currentPrice - asset.purchasePrice) * asset.shares;
                                                return (
                                                <li key={asset.symbol} className="text-xs flex justify-between items-center">
                                                    <span>{asset.shares}x <span className="font-bold text-slate-200">{asset.symbol}</span> @ ${asset.purchasePrice.toFixed(2)}</span>
                                                    <span className={`font-semibold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                                                    </span>
                                                </li>
                                            )})}
                                            {portfolio.length === 0 && <p className="text-xs text-slate-500">Nenhum ativo na carteira.</p>}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-300 mb-2">Ações Disponíveis</h4>
                                    <div className="space-y-2">
                                        {Object.entries(financialMarket).map(([symbol, stock]) => (
                                            <div key={symbol} className="bg-slate-700/50 p-3 rounded-lg flex items-center justify-between gap-2">
                                                <div>
                                                    <p className="font-bold text-white">{symbol}</p>
                                                    <p className="text-sm text-slate-300">${stock.currentPrice.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="number" 
                                                        min="1"
                                                        value={tradeAmounts[symbol] || ''}
                                                        onChange={e => handleAmountChange(symbol, e.target.value)}
                                                        className="w-20 bg-slate-900 border border-slate-600 rounded-md px-2 py-1 text-white text-right"
                                                        placeholder="Qtd."
                                                    />
                                                    <button onClick={() => onBuyStock(symbol, parseInt(tradeAmounts[symbol] || '0'))} disabled={!tradeAmounts[symbol] || systemTreasury < stock.currentPrice * parseInt(tradeAmounts[symbol])} className="p-2 rounded-md bg-green-600 hover:bg-green-700 disabled:bg-slate-600"><ArrowTrendingUpIcon className="w-4 h-4 text-white"/></button>
                                                    <button onClick={() => onSellStock(symbol, parseInt(tradeAmounts[symbol] || '0'))} disabled={!tradeAmounts[symbol] || !portfolio.some(a => a.symbol === symbol && a.shares >= parseInt(tradeAmounts[symbol]))} className="p-2 rounded-md bg-red-600 hover:bg-red-700 disabled:bg-slate-600"><ArrowTrendingDownIcon className="w-4 h-4 text-white"/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                     {/* Social Media */}
                    <section>
                         <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <MegaphoneIcon className="w-6 h-6 text-rose-400" />
                            Mídia Social
                        </h3>
                        {!apiAccess.social ? (
                            <div className="h-full flex flex-col items-center justify-center bg-slate-700/30 rounded-lg p-8 text-center">
                                <LockClosedIcon className="w-12 h-12 text-slate-500 mb-4" />
                                <h4 className="font-bold text-slate-300">Acesso à API Bloqueado</h4>
                                <p className="text-sm text-slate-400">Pesquise a tecnologia "API: Redes Sociais" no painel de P&D para desbloquear campanhas de sentimento.</p>
                            </div>
                        ) : (
                             <div className="bg-slate-700/50 p-6 rounded-lg text-center flex flex-col items-center justify-center h-full">
                                <h4 className="font-bold text-lg text-white">Campanha de Sentimento da Marca</h4>
                                <p className="text-slate-400 my-3">Lance uma campanha coordenada nas redes sociais para melhorar a percepção pública da Synapse AI e aumentar o sentimento da marca.</p>
                                <button
                                    onClick={onLaunchSocialCampaign}
                                    disabled={systemTreasury < SOCIAL_CAMPAIGN_COST}
                                    className="bg-rose-600 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-rose-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
                                >
                                    Lançar Campanha (Custo: ${SOCIAL_CAMPAIGN_COST})
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ExternalNetworkDashboard;
