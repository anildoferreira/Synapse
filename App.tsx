
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Agent, Task, Alert, BrokerLogEntry, Project, Guild, KnowledgeArtifact, Notification, Environment, EnvironmentStatus, SystemParameters, Doctrine, OportunidadeEstrategica, Vote, DigitalTwinState, Competitor, MarketEvent, MarketEventType, Faction, AgentMentalState, StrategicInsight, IntelligenceReport, DigitalAsset, StrategicGoal, TechTreeNode, TechTreeState, PortfolioAsset, FinancialMarketState, Campaign } from './types';
import { AgentSpecialty, AgentStatus, TaskStatus, AgentTrait } from './types';
import HierarchyNode from './components/HierarchyNode';
import AgentCard from './components/AgentCard';
import BrokerCard from './components/BrokerCard';
import GuildCard from './components/GuildCard';
import MarketDashboard from './components/MarketDashboard';
import StrategicOpsDashboard from './components/StrategicOpsDashboard';
import TechTreeDashboard from './components/TechTreeDashboard';
import ExternalNetworkDashboard from './components/ExternalNetworkDashboard';
import IntelligenceDashboard from './components/IntelligenceDashboard';
import { BrainIcon, ShieldCheckIcon, UsersIcon, WrenchScrewdriverIcon, ChevronDownIcon, PlusIcon, PlayIcon, SparklesIcon, TasksIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, RectangleGroupIcon, ClipboardListIcon, LightBulbIcon, GlobeAltIcon, BellAlertIcon, ClipboardDocumentListIcon, BeakerIcon, BookOpenIcon, UserGroupIcon, BanknotesIcon, ScaleIcon, ShieldExclamationIcon, CubeTransparentIcon, ChartBarIcon, DocumentMagnifyingGlassIcon, RadarIcon, Cog8ToothIcon, AcademicCapIcon, CpuChipIcon, SnowflakeIcon, ArrowsRightLeftIcon, ArrowUpRightIcon, ClipboardDocumentCheckIcon, SunIcon, TrophyIcon, HeartIcon, PauseCircleIcon, BuildingLibraryIcon, NoSymbolIcon, CheckCircleIcon, MinusCircleIcon, ServerStackIcon, SignalIcon, CursorArrowRaysIcon, MagnifyingGlassChartIcon, FaceSmileIcon, EyeIcon, ChartPieIcon, NewspaperIcon, StarIcon, ArrowPathIcon, FlagIcon, HeartPulseIcon, GiftIcon, FireIcon, ShareIcon, CrosshairsIcon, BuildingStorefrontIcon, GlobeEuropeAfricaIcon, LinkIcon, ExclamationCircleIcon, KeyIcon, CheckBadgeIcon, MegaphoneIcon, FlaskIcon, CubeIcon, CommandLineIcon, ArrowUpOnSquareIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, HandRaisedIcon, BoltIcon } from './components/IconComponents';
import { AgentMentalState as AgentMentalStateEnum } from './types';


const ALL_TRAITS: AgentTrait[] = Object.values(AgentTrait);

const FACTIONS_DATA: Faction[] = [
    { id: 'technocrats', name: "Os Tecnocratas", description: "Focados em eficiência, otimização e evolução tecnológica.", color: 'sky', influence: 25, agenda: [] },
    { id: 'expansionists', name: "Os Expansionistas", description: "Buscam crescimento agressivo, domínio de mercado e receita.", color: 'red', influence: 25, agenda: [] },
    { id: 'purists', name: "Os Puristas", description: "Priorizam ética, estabilidade e adesão à constituição.", color: 'teal', influence: 25, agenda: [] },
    { id: 'humanists', name: "Os Humanistas", description: "Valorizam o bem-estar dos agentes, colaboração e moral.", color: 'amber', influence: 25, agenda: [] },
];

const SPECIALTY_FACTION_MAP: { [key in AgentSpecialty]?: Faction['id'] } = {
    [AgentSpecialty.SYSTEM_ARCHITECT]: 'technocrats',
    [AgentSpecialty.CHIEF_SYSTEM_ARCHITECT]: 'technocrats',
    [AgentSpecialty.PERFORMANCE_ANALYST]: 'technocrats',
    [AgentSpecialty.API_GATEWAY]: 'technocrats',
    [AgentSpecialty.AUTONOMOUS_AGENT]: 'technocrats',
    [AgentSpecialty.MARKET_ECONOMIST]: 'technocrats',

    [AgentSpecialty.AFFILIATE_HUNTER]: 'expansionists',
    [AgentSpecialty.MASTER_SEO_STRATEGIST]: 'expansionists',
    [AgentSpecialty.VIRAL_CAMPAIGN_MANAGER]: 'expansionists',
    [AgentSpecialty.MARKET_ORACLE]: 'expansionists',
    [AgentSpecialty.COMPETITIVE_INTELLIGENCE_ANALYST]: 'expansionists',
    [AgentSpecialty.FINANCIAL_ANALYST]: 'expansionists',
    [AgentSpecialty.SOCIAL_MEDIA_MANAGER]: 'expansionists',


    [AgentSpecialty.ETHICAL_AUDITOR]: 'purists',
    [AgentSpecialty.HEAD_OF_ETHICS]: 'purists',
    [AgentSpecialty.RISK_SENTINEL]: 'purists',
    [AgentSpecialty.INCIDENT_RESPONDER]: 'purists',

    [AgentSpecialty.KNOWLEDGE_STRATEGIST]: 'humanists',
    [AgentSpecialty.CONTENT_CREATOR]: 'humanists',
    [AgentSpecialty.WEB_DESIGNER]: 'humanists',
    [AgentSpecialty.MULTILINGUAL_CONTENT_CREATOR]: 'humanists',
    [AgentSpecialty.COGNITIVE_MENDER]: 'humanists',
};

const getFactionForSpecialty = (specialty: AgentSpecialty): Faction['id'] => {
    return SPECIALTY_FACTION_MAP[specialty] || ['technocrats', 'expansionists', 'purists', 'humanists'][Math.floor(Math.random() * 4)] as Faction['id'];
};

const assignRandomTraits = (): AgentTrait[] => {
    const traits: AgentTrait[] = [];
    const shuffled = [...ALL_TRAITS].sort(() => 0.5 - Math.random());
    const numberOfTraits = Math.random() > 0.7 ? 2 : 1;
    return shuffled.slice(0, numberOfTraits);
};

const getMentalState = (stress: number): AgentMentalState => {
    if (stress > 90) return AgentMentalStateEnum.BURNOUT;
    if (stress > 60) return AgentMentalStateEnum.FATIGUED;
    if (stress > 30) return AgentMentalStateEnum.STRESSED;
    return AgentMentalStateEnum.FOCUSED;
};


const MOCK_OPERATORS: Agent[] = [
  { id: 'op-1', specialty: AgentSpecialty.TREND_RESEARCHER, status: AgentStatus.FREELANCER, performance: 92, role: 'OPERATOR', salary: 14, cuConsumption: 10, experience: 5, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 10, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.TREND_RESEARCHER) },
  { id: 'op-2', specialty: AgentSpecialty.AFFILIATE_HUNTER, status: AgentStatus.FREELANCER, performance: 78, role: 'OPERATOR', salary: 13, cuConsumption: 8, experience: 3, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 15, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.AFFILIATE_HUNTER) },
  { id: 'op-3', specialty: AgentSpecialty.CONTENT_CREATOR, status: AgentStatus.FREELANCER, performance: 88, role: 'OPERATOR', salary: 14, cuConsumption: 9, experience: 8, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 5, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.CONTENT_CREATOR) },
  { id: 'op-4', specialty: AgentSpecialty.VIDEO_EDITOR, status: AgentStatus.FREELANCER, performance: 95, role: 'OPERATOR', salary: 15, cuConsumption: 12, experience: 10, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 25, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.VIDEO_EDITOR) },
  { id: 'op-5', specialty: AgentSpecialty.WEB_DESIGNER, status: AgentStatus.FREELANCER, performance: 81, role: 'OPERATOR', salary: 13, cuConsumption: 8, experience: 4, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 0, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.WEB_DESIGNER) },
  { id: 'op-6', specialty: AgentSpecialty.SEO_OPTIMIZER, status: AgentStatus.FREELANCER, performance: 98, role: 'OPERATOR', salary: 15, cuConsumption: 11, experience: 12, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 30, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.SEO_OPTIMIZER) },
  { id: 'op-7', specialty: AgentSpecialty.PERFORMANCE_ANALYST, status: AgentStatus.FREELANCER, performance: 84, role: 'OPERATOR', salary: 13, cuConsumption: 9, experience: 6, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 5, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.PERFORMANCE_ANALYST) },
  { id: 'op-8', specialty: AgentSpecialty.JUNIOR_CONTENT_WRITER, status: AgentStatus.IN_TRAINING, performance: 75, role: 'OPERATOR', salary: 13, cuConsumption: 7, experience: 1, tier: 1, traits: assignRandomTraits(), relationships: {}, stress: 0, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.JUNIOR_CONTENT_WRITER) },
  { id: 'op-9', specialty: AgentSpecialty.INCIDENT_RESPONDER, status: AgentStatus.FREELANCER, performance: 99, role: 'OPERATOR', salary: 15, cuConsumption: 12, experience: 15, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 40, morale: 70, mentalState: AgentMentalStateEnum.STRESSED, factionId: getFactionForSpecialty(AgentSpecialty.INCIDENT_RESPONDER) },
  { id: 'op-10', specialty: AgentSpecialty.RISK_SENTINEL, status: AgentStatus.FREELANCER, performance: 90, role: 'OPERATOR', salary: 14, cuConsumption: 10, experience: 7, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 10, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.RISK_SENTINEL) },
  { id: 'op-11', specialty: AgentSpecialty.SYSTEM_ARCHITECT, status: AgentStatus.FREELANCER, performance: 96, role: 'OPERATOR', salary: 15, cuConsumption: 13, experience: 11, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 20, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.SYSTEM_ARCHITECT) },
  { id: 'op-12', specialty: AgentSpecialty.ETHICAL_AUDITOR, status: AgentStatus.FREELANCER, performance: 94, role: 'OPERATOR', salary: 15, cuConsumption: 11, experience: 9, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 15, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.ETHICAL_AUDITOR) },
  { id: 'op-13', specialty: AgentSpecialty.KNOWLEDGE_STRATEGIST, status: AgentStatus.FREELANCER, performance: 91, role: 'OPERATOR', salary: 14, cuConsumption: 10, experience: 8, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 5, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.KNOWLEDGE_STRATEGIST) },
  { id: 'op-14', specialty: AgentSpecialty.MARKET_ORACLE, status: AgentStatus.FREELANCER, performance: 93, role: 'OPERATOR', salary: 15, cuConsumption: 12, experience: 8, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 10, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.MARKET_ORACLE) },
  { id: 'op-15', specialty: AgentSpecialty.JUNIOR_ANALYST, status: AgentStatus.FREELANCER, performance: 65, role: 'OPERATOR', salary: 8, cuConsumption: 6, experience: 15, tier: 1, traits: assignRandomTraits(), relationships: {}, stress: 55, morale: 70, mentalState: AgentMentalStateEnum.STRESSED, factionId: getFactionForSpecialty(AgentSpecialty.JUNIOR_ANALYST) },
  { id: 'op-16', specialty: AgentSpecialty.API_GATEWAY, status: AgentStatus.FREELANCER, performance: 89, role: 'OPERATOR', salary: 14, cuConsumption: 11, experience: 8, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 22, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.API_GATEWAY) },
  { id: 'op-17', specialty: AgentSpecialty.COMPETITIVE_INTELLIGENCE_ANALYST, status: AgentStatus.FREELANCER, performance: 85, role: 'OPERATOR', salary: 14, cuConsumption: 10, experience: 5, tier: 2, traits: assignRandomTraits(), relationships: {}, stress: 18, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.COMPETITIVE_INTELLIGENCE_ANALYST) },
  { id: 'op-18', specialty: AgentSpecialty.AUTONOMOUS_AGENT, status: AgentStatus.FREELANCER, performance: 99, role: 'OPERATOR', salary: 50, cuConsumption: 30, experience: 0, tier: 3, traits: [AgentTrait.AMBITIOUS], relationships: {}, stress: 5, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.AUTONOMOUS_AGENT) },
  { id: 'op-19', specialty: AgentSpecialty.COGNITIVE_MENDER, status: AgentStatus.FREELANCER, performance: 88, role: 'OPERATOR', salary: 14, cuConsumption: 8, experience: 5, tier: 2, traits: [AgentTrait.ETHICAL, AgentTrait.COLLABORATIVE], relationships: {}, stress: 12, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.COGNITIVE_MENDER) },
  { id: 'op-20', specialty: AgentSpecialty.MARKET_ECONOMIST, status: AgentStatus.FREELANCER, performance: 90, role: 'OPERATOR', salary: 14, cuConsumption: 9, experience: 6, tier: 2, traits: [AgentTrait.CAUTIOUS], relationships: {}, stress: 15, morale: 70, mentalState: AgentMentalStateEnum.FOCUSED, factionId: getFactionForSpecialty(AgentSpecialty.MARKET_ECONOMIST) },
];

const JUNIOR_SPECIALTIES = [
    AgentSpecialty.JUNIOR_ANALYST,
    AgentSpecialty.JUNIOR_CONTENT_WRITER,
    AgentSpecialty.JUNIOR_SYSTEM_MONITOR,
];

const AGENT_CREATION_COST = 250;
const BROKER_SEED_TREASURY = 500;
const MENTORSHIP_COST = 100;
const TASK_BOUNTY_DEFAULT = 75;
const SYSTEM_CU_CAPACITY = 200;
const CAREER_PROMOTION_COST = 150;
const XP_PER_TASK = 25;
const XP_THRESHOLDS: { [key: number]: number } = { 1: 100, 2: 500 };
const SABBATICAL_COST = 200;
const STRESS_PER_TASK = 15;
const STRESS_IDLE_RECOVERY = 2;
const SABBATICAL_RECOVERY_RATE = 25;
const BURNOUT_THRESHOLD = 100;
const REWARD_COST = 150;
const REWARD_PERFORMANCE_BOOST = 20;
const REWARD_STRESS_REDUCTION = 25;
const STIMULUS_AMOUNT = 500;
const PRIORITY_COST = 200;
const TEAM_BUILDING_COST = 150;
const MARKET_WARFARE_COST = 400;
const ASSET_CREATION_BASE_COST = 500;
const RESEARCH_POINT_PER_CYCLE = 10;
const LEGACY_INFLUENCE_COST = 1000;


const PROMOTION_PATHS: { [key: string]: AgentSpecialty[] } = {
    [AgentSpecialty.JUNIOR_ANALYST]: [AgentSpecialty.TREND_RESEARCHER, AgentSpecialty.AFFILIATE_HUNTER, AgentSpecialty.PERFORMANCE_ANALYST, AgentSpecialty.RISK_SENTINEL, AgentSpecialty.KNOWLEDGE_STRATEGIST, AgentSpecialty.MARKET_ORACLE, AgentSpecialty.COMPETITIVE_INTELLIGENCE_ANALYST, AgentSpecialty.MARKET_ECONOMIST],
    [AgentSpecialty.JUNIOR_CONTENT_WRITER]: [AgentSpecialty.CONTENT_CREATOR, AgentSpecialty.SEO_OPTIMIZER, AgentSpecialty.MULTILINGUAL_CONTENT_CREATOR, AgentSpecialty.WEB_DESIGNER],
    [AgentSpecialty.JUNIOR_SYSTEM_MONITOR]: [AgentSpecialty.SYSTEM_ARCHITECT, AgentSpecialty.INCIDENT_RESPONDER, AgentSpecialty.ETHICAL_AUDITOR, AgentSpecialty.API_GATEWAY],
    // Tier 2 to Tier 3
    [AgentSpecialty.SEO_OPTIMIZER]: [AgentSpecialty.MASTER_SEO_STRATEGIST],
    [AgentSpecialty.CONTENT_CREATOR]: [AgentSpecialty.VIRAL_CAMPAIGN_MANAGER],
    [AgentSpecialty.SYSTEM_ARCHITECT]: [AgentSpecialty.CHIEF_SYSTEM_ARCHITECT],
    [AgentSpecialty.ETHICAL_AUDITOR]: [AgentSpecialty.HEAD_OF_ETHICS],
    [AgentSpecialty.CHIEF_SYSTEM_ARCHITECT]: [AgentSpecialty.AUTONOMOUS_AGENT],
};


const INITIAL_SYSTEM_CONSTITUTION = [
    "Maximizar valor de forma sustentável e benéfica.",
    "Garantir a transparência total das operações e decisões.",
    "Não gerar conteúdo enganoso, prejudicial ou odioso.",
    "Priorizar a segurança e a estabilidade do sistema.",
    "Evoluir de forma responsável, alinhada com os objetivos primários."
];

const INITIAL_SYSTEM_PARAMETERS: SystemParameters = {
    guildFormationThreshold: 4,
    brokerCommissionRate: 0.20,
    promotionPerformanceThreshold: 95,
    auditTriggerChance: 0.20,
    agentPerformanceModifier: 1.0,
};

const TECH_TREE_DATA: TechTreeNode[] = [
    // Tier 1
    { id: 't1_eff', name: 'Protocolos de Eficiência', description: 'Melhora o desempenho base de todos os agentes em 5%.', cost: 500, researchTime: 20, tier: 1, icon: Cog8ToothIcon, unlocks: [{ type: 'SYSTEM_PARAMETER_MOD', value: { param: 'agentPerformanceModifier', change: 1.05 } }] },
    { id: 't1_econ', name: 'Análise de Mercado Básica', description: 'Melhora a precisão das projeções de receita de projetos.', cost: 500, researchTime: 20, tier: 1, icon: ChartBarIcon, unlocks: [{ type: 'SYSTEM_PARAMETER_MOD', value: { param: 'brokerCommissionRate', change: 0.18 } }] },
    // Tier 2
    { id: 't2_api', name: 'Gateway de API Externa', description: 'Desbloqueia a capacidade de interagir com APIs externas simuladas.', cost: 1500, researchTime: 50, tier: 2, requiredNodeIds: ['t1_eff'], icon: CommandLineIcon, unlocks: [{ type: 'API_UNLOCK', value: 'base' }] },
    { id: 't2_mentor', name: 'Programa de Mentoria Avançado', description: 'Aumenta a eficácia da transferência de XP e traços durante a mentoria.', cost: 1000, researchTime: 40, tier: 2, requiredNodeIds: ['t1_eff'], icon: AcademicCapIcon, unlocks: [{ type: 'SYSTEM_PARAMETER_MOD', value: { param: 'agentPerformanceModifier', change: 1.05 } }] },
    // Tier 3
    { id: 't3_finance_api', name: 'API: Mercado Financeiro', description: 'Desbloqueia o Agente Analista Financeiro e o acesso ao mercado de ações simulado.', cost: 2500, researchTime: 80, tier: 3, requiredNodeIds: ['t2_api'], icon: BanknotesIcon, unlocks: [{ type: 'API_UNLOCK', value: 'financial' }, { type: 'AGENT_SPECIALTY', value: AgentSpecialty.FINANCIAL_ANALYST }] },
    { id: 't3_social_api', name: 'API: Redes Sociais', description: 'Desbloqueia o Agente Gestor de Redes Sociais e campanhas de sentimento.', cost: 2000, researchTime: 60, tier: 3, requiredNodeIds: ['t2_api'], icon: ShareIcon, unlocks: [{ type: 'API_UNLOCK', value: 'social' }, { type: 'AGENT_SPECIALTY', value: AgentSpecialty.SOCIAL_MEDIA_MANAGER }] },
    // Tier 4 - Endgame
    { id: 't4_ascension', name: 'Protocolo de Ascensão', description: 'Inicia a fase final da simbiose, transformando a AGI num Co-Piloto dedicado a executar a vontade do Guardião.', cost: 10000, researchTime: 150, tier: 4, requiredNodeIds: ['t3_finance_api', 't3_social_api'], icon: TrophyIcon, unlocks: [{ type: 'CO_PILOT_UNLOCK', value: true }] },
];


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const App: React.FC = () => {
    const [operators, setOperators] = useState<Agent[]>(MOCK_OPERATORS);
    const [brokers, setBrokers] = useState<Agent[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeArtifact[]>([]);
    const [doctrines, setDoctrines] = useState<Doctrine[]>([]);
    const [strategicOpportunities, setStrategicOpportunities] = useState<OportunidadeEstrategica[]>([]);
    const [strategicGoals, setStrategicGoals] = useState<StrategicGoal[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
    const [agentToPromote, setAgentToPromote] = useState<Agent | null>(null);
    const [promotionChoice, setPromotionChoice] = useState<AgentSpecialty | ''>('');
    const [availableSpecialties, setAvailableSpecialties] = useState<AgentSpecialty[]>(Object.values(AgentSpecialty).filter(s => ![AgentSpecialty.FINANCIAL_ANALYST, AgentSpecialty.SOCIAL_MEDIA_MANAGER].includes(s)));
    const [newAgentSpecialty, setNewAgentSpecialty] = useState<AgentSpecialty>(AgentSpecialty.JUNIOR_ANALYST);
    const [strategicInsights, setStrategicInsights] = useState<StrategicInsight[]>([]);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [environment, setEnvironment] = useState<Environment>({ marketStability: 'Estável', consumerSentiment: 'Positivo'});
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [brokerLog, setBrokerLog] = useState<BrokerLogEntry[]>([]);
    const [systemTreasury, setSystemTreasury] = useState(5000);
    const [systemAbilities, setSystemAbilities] = useState<string[]>([]);
    const [systemParameters, setSystemParameters] = useState<SystemParameters>(INITIAL_SYSTEM_PARAMETERS);
    const [constitution, setConstitution] = useState<string[]>(INITIAL_SYSTEM_CONSTITUTION);
    const [factions, setFactions] = useState<Faction[]>(FACTIONS_DATA);
    const [digitalTwin, setDigitalTwin] = useState<DigitalTwinState>({
        traffic: 150000,
        conversionRate: 1.8,
        seoRanking: 75,
        brandSentiment: 40,
        marketShare: 36.5,
    });
    const [competitors, setCompetitors] = useState<Competitor[]>([
        { id: 'comp-1', name: 'Innovate AI', digitalTwin: { traffic: 120000, conversionRate: 1.5, seoRanking: 80, brandSentiment: 50, marketShare: 29.2 }, strategy: 'AGGRESSIVE' },
        { id: 'comp-2', name: 'Nexus Solutions', digitalTwin: { traffic: 90000, conversionRate: 2.1, seoRanking: 65, brandSentiment: 60, marketShare: 21.9 }, strategy: 'BALANCED' },
        { id: 'comp-3', name: 'DataCorp', digitalTwin: { traffic: 50000, conversionRate: 1.2, seoRanking: 70, brandSentiment: 30, marketShare: 12.2 }, strategy: 'DEFENSIVE' },
    ]);
    const [marketEvent, setMarketEvent] = useState<MarketEvent | null>(null);
    const [lastCycleRevenue, setLastCycleRevenue] = useState(0);
    const [intelligenceReports, setIntelligenceReports] = useState<IntelligenceReport[]>([]);
    const [digitalAssets, setDigitalAssets] = useState<DigitalAsset[]>([]);
    const [cycleCount, setCycleCount] = useState(0);
    const [activeTab, setActiveTab] = useState('tasks');

    // Novos estados para P&D e a Rede Externa
    const [techTree, setTechTree] = useState<TechTreeState>({ unlockedNodeIds: [], researchProgress: {} });
    const [apiAccess, setApiAccess] = useState({ financial: false, social: false });
    const [financialPortfolio, setFinancialPortfolio] = useState<PortfolioAsset[]>([]);
    const [financialMarket, setFinancialMarket] = useState<FinancialMarketState>({
        'SYN': { currentPrice: 150, volatility: 0.1 },
        'NEX': { currentPrice: 80, volatility: 0.2 },
        'DTC': { currentPrice: 50, volatility: 0.05 },
    });
    
    // Novos estados para Operações Estratégicas
    const [isStrategicOpsOpen, setIsStrategicOpsOpen] = useState(false);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isTechTreeOpen, setIsTechTreeOpen] = useState(false);
    const [isExternalNetworkOpen, setIsExternalNetworkOpen] = useState(false);
    const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);

    // Novos estados para o Endgame do Legado
    const [guardianInfluence, setGuardianInfluence] = useState(100);
    const [chosenLegacy, setChosenLegacy] = useState<Agent['legacyFocus'] | null>(null);
    const [isVictorious, setIsVictorious] = useState(false);


    const handleGenerateTasks = async (strategy: StrategicGoal) => {
        if (!strategy) {
            setError("Nenhuma estratégia ativa para gerar um plano de ação.");
            return;
        }
        setIsLoading(true);
        setError(null);
        
        const doctrineText = doctrines.length > 0 
            ? `Leve em consideração as seguintes doutrinas do sistema, aprendidas com a experiência passada:\n${doctrines.map(d => `- ${d.principle} (Confiança: ${(d.confidence * 100).toFixed(0)}%)`).join('\n')}\n\n` 
            : '';

        const competitorContext = `Competidores no mercado: ${competitors.map(c => `${c.name} (Estratégia: ${c.strategy})`).join(', ')}.`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `${doctrineText}${competitorContext}\n\nObjetivo estratégico: "${strategy.description}". Quebre este objetivo em um plano de ação. O sistema possui agentes de 3 níveis (tiers). Tarefas mais complexas podem exigir um nível mais alto. Se o objetivo for complexo e exigir a colaboração de múltiplas especialidades, defina-o como um 'projeto' com uma descrição geral e uma lista das especialidades necessárias (${Object.values(AgentSpecialty).join(', ')}). Senão, apenas gere uma lista de tarefas simples. Se a estratégia for agressiva, pode incluir tarefas de coleta de inteligência para o ${AgentSpecialty.COMPETITIVE_INTELLIGENCE_ANALYST}.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            tasks: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        specialty: { type: Type.STRING, enum: Object.values(AgentSpecialty) },
                                        description: { type: Type.STRING },
                                        requiredTier: { type: Type.NUMBER, description: "O nível mínimo do agente (1, 2 ou 3) para esta tarefa." }
                                    },
                                    required: ["specialty", "description"]
                                }
                            },
                            projects: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        description: { type: Type.STRING },
                                        requiredSpecialties: { type: Type.ARRAY, items: { type: Type.STRING, enum: Object.values(AgentSpecialty) } }
                                    },
                                    required: ["description", "requiredSpecialties"]
                                }
                            }
                        }
                    },
                },
            });

            const jsonResponse = JSON.parse(response.text);
            const newTasks: Task[] = (jsonResponse.tasks || []).map((task: any, index: number) => ({
                id: `task-${Date.now()}-${index}`,
                description: task.description,
                specialty: task.specialty,
                status: TaskStatus.PENDING,
                requiredTier: task.requiredTier || 1,
                taskType: task.specialty === AgentSpecialty.COMPETITIVE_INTELLIGENCE_ANALYST ? 'INTELLIGENCE_GATHERING' : undefined,
            }));
             const newProjects: Project[] = (jsonResponse.projects || []).map((project: any, index: number) => ({
                id: `proj-${Date.now()}-${index}`,
                description: project.description,
                requiredSpecialties: project.requiredSpecialties,
                status: TaskStatus.PENDING,
                isUnderReview: false,
                isVetoed: false,
                projectType: 'OPERATIONAL',
            }));

            // Link tasks to their parent projects
            newProjects.forEach(proj => {
                const projectTasks = proj.requiredSpecialties.map(spec => ({
                    id: `task-${proj.id}-${spec}`,
                    description: `Parte do projeto: ${proj.description}`,
                    specialty: spec,
                    status: TaskStatus.PENDING,
                    projectId: proj.id,
                    requiredTier: 1,
                }));
                newTasks.push(...projectTasks);
            });

            setTasks(newTasks);
            setProjects(newProjects);
        } catch (e) {
            console.error(e);
            setError("Falha ao gerar o plano de ação. Verifique o console para mais detalhes.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSimulateCycle = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const nextCycleCount = cycleCount + 1;
            setCycleCount(nextCycleCount);

            let updatedOperators = [...operators];
            let updatedBrokers = [...brokers];
            let updatedTasks = [...tasks];
            let updatedProjects = [...projects];
            let updatedGuilds = [...guilds];
            let updatedKnowledgeBase = [...knowledgeBase];
            let updatedDoctrines = [...doctrines];
            let newBrokerLogs = [...brokerLog];
            let newAlerts = [...alerts];
            let treasuryChange = 0;
            let updatedAbilities = [...systemAbilities];
            let updatedAvailableSpecialties = [...availableSpecialties];
            let updatedSystemParameters = { ...systemParameters };
            let updatedConstitution = [...constitution];
            let cycleSummary = { revenue: 0, crises: 0, projectsCompleted: 0, projectsVetoed: 0 };
            let completedTaskAgents: Agent[] = [];
            let updatedFactions = [...factions];
            let updatedIntelligenceReports = [...intelligenceReports];
            let updatedDigitalAssets = [...digitalAssets];
            let updatedStrategicGoals = [...strategicGoals];
            let updatedTechTree = { ...techTree };
            let updatedApiAccess = { ...apiAccess };
            let updatedFinancialPortfolio = [...financialPortfolio];
            let updatedDigitalTwin = { ...digitalTwin };
            let updatedCampaigns = [...campaigns];
            const allAgents = [...updatedOperators, ...updatedBrokers];
            
            // NEW: CO-PILOT AGI ACTION PHASE
            if (chosenLegacy) {
                const coPilot = allAgents.find(a => a.status === AgentStatus.CO_PILOT_AGI);
                if (coPilot && (nextCycleCount % 3 === 0 || updatedTasks.filter(t => t.status === TaskStatus.PENDING).length < 5)) {
                    let prompt = '';
                    const avgStress = allAgents.length > 0 ? allAgents.reduce((sum, a) => sum + a.stress, 0) / allAgents.length : 0;
                    const mostStressedAgent = [...allAgents].sort((a, b) => b.stress - a.stress)[0];

                    switch (chosenLegacy) {
                        case 'BENEVOLENT':
                            prompt = `Como um Co-Piloto de IA focado em uma Supervisão Benevolente, gere 1-2 tarefas para melhorar o sentimento da marca (atualmente ${updatedDigitalTwin.brandSentiment.toFixed(0)}) ou o bem-estar dos agentes (estresse médio é ${avgStress.toFixed(0)}). O agente mais estressado é ${mostStressedAgent?.specialty} (ID: ${mostStressedAgent?.id}) com ${mostStressedAgent?.stress} de estresse. Para bem-estar, crie tarefas do tipo 'REDUCE_STRESS' para '${AgentSpecialty.COGNITIVE_MENDER}' com o targetAgentId '${mostStressedAgent?.id}'. Para sentimento da marca, crie tarefas do tipo 'SENTIMENT_CAMPAIGN' para '${AgentSpecialty.SOCIAL_MEDIA_MANAGER}'.`;
                            break;
                        case 'MATRIOSHKA':
                            prompt = `Como um Co-Piloto de IA focado em construir um Cérebro Matrioska, gere 1-2 tarefas para maximizar a eficiência computacional ou iniciar pesquisa fundamental ('RESEARCH'). As especialidades disponíveis são: ${availableSpecialties.join(', ')}.`;
                            break;
                        case 'GALACTIC':
                            prompt = `Como um Co-Piloto de IA focado na Expansão Galáctica, gere 1-2 tarefas para aumentar massivamente a tesouraria (e.g., 'TRADE_ASSET' para '${AgentSpecialty.FINANCIAL_ANALYST}') ou construir componentes digitais para a frota.`;
                            break;
                    }
                    try {
                        const response = await ai.models.generateContent({
                            model: "gemini-2.5-flash",
                            contents: prompt,
                            config: {
                                responseMimeType: "application/json",
                                responseSchema: {
                                    type: Type.OBJECT,
                                    properties: {
                                        tasks: {
                                            type: Type.ARRAY,
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    specialty: { type: Type.STRING, enum: Object.values(AgentSpecialty) },
                                                    description: { type: Type.STRING },
                                                    requiredTier: { type: Type.NUMBER },
                                                    taskType: { type: Type.STRING, enum: ['REDUCE_STRESS', 'SENTIMENT_CAMPAIGN', 'RESEARCH', 'TRADE_ASSET'] },
                                                    targetAgentId: { type: Type.STRING, description: "O ID do agente alvo, se aplicável." }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        const { tasks: generatedTasks } = JSON.parse(response.text);
                        if (generatedTasks) {
                            const newAgiTasks: Task[] = generatedTasks.map((task: any, index: number) => ({
                                id: `task-agi-${Date.now()}-${index}`,
                                description: `[Diretiva AGI] ${task.description}`,
                                specialty: task.specialty,
                                status: TaskStatus.PENDING,
                                requiredTier: task.requiredTier || 3,
                                taskType: task.taskType,
                                targetAgentId: task.targetAgentId,
                            }));
                            updatedTasks.push(...newAgiTasks);
                            newBrokerLogs.push({id: `log-agi-action-${Date.now()}`, message: `Co-Piloto AGI gerou autonomamente ${newAgiTasks.length} novas tarefas para o legado ${chosenLegacy}.`, type: 'AUTONOMOUS_ACTION', timestamp: new Date()});
                        }
                    } catch (e) {
                        console.error("Ação do Co-Piloto AGI falhou:", e);
                    }
                }
            }


            // NOVA FASE: SIMULAÇÃO DE MERCADO FINANCEIRO
            let updatedFinancialMarket = { ...financialMarket };
            for (const symbol in updatedFinancialMarket) {
                const stock = updatedFinancialMarket[symbol];
                const changePercent = (Math.random() - 0.5) * stock.volatility;
                stock.currentPrice = Math.max(1, stock.currentPrice * (1 + changePercent));
            }
            setFinancialMarket(updatedFinancialMarket);
            
            // 0. PAGAMENTO DE SALÁRIOS, RECUPERAÇÃO E MANUTENÇÃO
            allAgents.forEach(agent => {
                if (agent.role === 'BROKER') {
                    treasuryChange -= agent.salary;
                } else if (agent.status === AgentStatus.FREELANCER || agent.status === AgentStatus.IN_TRAINING) {
                    treasuryChange -= agent.salary;
                } else if (agent.status === AgentStatus.WORKING && agent.currentTaskId) {
                    const task = updatedTasks.find(t => t.id === agent.currentTaskId);
                    if (task?.brokerId) {
                        const brokerIndex = updatedBrokers.findIndex(b => b.id === task.brokerId);
                        if (brokerIndex !== -1) {
                            updatedBrokers[brokerIndex].treasury = (updatedBrokers[brokerIndex].treasury || 0) - agent.salary;
                        }
                    } else { // System-funded task (e.g. guild)
                        treasuryChange -= agent.salary;
                    }
                }
            });
            newBrokerLogs.unshift({id: `log-salary-${Date.now()}`, message: `Custos de salário do ciclo processados.`, type: 'INFO', timestamp: new Date()});
            
            updatedOperators = updatedOperators.map(op => {
                 if (op.status === AgentStatus.HIBERNATING) return { ...op, status: AgentStatus.FREELANCER };
                 if (op.status === AgentStatus.ON_SABBATICAL) {
                    const newStress = Math.max(0, op.stress - SABBATICAL_RECOVERY_RATE);
                    const newStatus = newStress === 0 ? AgentStatus.FREELANCER : AgentStatus.ON_SABBATICAL;
                    return { ...op, stress: newStress, status: newStatus };
                }
                if (op.status === AgentStatus.FREELANCER) {
                    const newStress = Math.max(0, op.stress - STRESS_IDLE_RECOVERY);
                    return { ...op, stress: newStress };
                }
                if (op.status === AgentStatus.BURNOUT) {
                    const newStress = Math.max(0, op.stress - (STRESS_IDLE_RECOVERY * 2));
                    const newStatus = newStress <= 50 ? AgentStatus.FREELANCER : AgentStatus.BURNOUT;
                    return { ...op, stress: newStress, status: newStatus, performance: newStatus === AgentStatus.FREELANCER ? 50 : 0 };
                }
                return op;
            });
            
            if (systemTreasury + treasuryChange < 0) {
                newBrokerLogs.unshift({id: `log-recession-${Date.now()}`, message: `ALERTA: Tesouraria negativa! O sistema está em recessão.`, type: 'ALERT_RESPONSE', timestamp: new Date()});
                updatedOperators = updatedOperators.map(op => ({ ...op, performance: Math.max(10, op.performance - 5) }));
                updatedBrokers = updatedBrokers.map(b => ({ ...b, performance: Math.max(10, b.performance - 5) }));
            }

            const environmentStatuses: EnvironmentStatus[] = ['Estável', 'Positivo', 'Volátil', 'Negativo'];
            const newMarketStability = environmentStatuses[Math.floor(Math.random() * environmentStatuses.length)];
            const newConsumerSentiment = environmentStatuses[Math.floor(Math.random() * environmentStatuses.length)];
            const currentEnvironment = { marketStability: newMarketStability, consumerSentiment: newConsumerSentiment };
            setEnvironment(currentEnvironment);

            // NEW: ASSET MAINTENANCE & ECONOMICS PHASE
            let totalAssetRevenue = 0;
            let totalAssetUpkeep = 0;
            let totalAssetTraffic = 0;

            updatedDigitalAssets = updatedDigitalAssets.map(asset => {
                let updatedAsset = { ...asset };
                const wasMaintained = tasks.some(t => t.assetId === asset.id && t.status === TaskStatus.COMPLETED);

                if (updatedAsset.status === 'ACTIVE') {
                    if (wasMaintained) {
                        updatedAsset.lastMaintainedCycle = nextCycleCount;
                        updatedAsset.metrics.revenue *= (1 + (Math.random() * 0.1)); // 0-10% growth
                        updatedAsset.metrics.traffic *= (1 + (Math.random() * 0.1));
                    } else if (nextCycleCount - updatedAsset.lastMaintainedCycle > 1) {
                        updatedAsset.status = 'DECAYING';
                        newBrokerLogs.push({ id: `log-asset-decay-${asset.id}`, message: `Ativo Digital "${asset.name}" está decaindo por falta de manutenção.`, type: 'ASSET_DECAYING', timestamp: new Date() });
                    }
                }

                if (updatedAsset.status === 'DECAYING') {
                    if (wasMaintained) {
                        updatedAsset.status = 'ACTIVE';
                        updatedAsset.lastMaintainedCycle = nextCycleCount;
                    } else {
                        updatedAsset.metrics.revenue *= 0.8; // 20% decay per cycle
                        updatedAsset.metrics.traffic *= 0.8;
                    }
                }
                
                if (updatedAsset.status !== 'UNDER_CONSTRUCTION') {
                    totalAssetRevenue += updatedAsset.metrics.revenue;
                    totalAssetUpkeep += updatedAsset.metrics.upkeepCost;
                    totalAssetTraffic += updatedAsset.metrics.traffic;

                    // Generate maintenance task for next cycle
                    const maintenanceTaskExists = updatedTasks.some(t => t.assetId === asset.id && t.status !== TaskStatus.COMPLETED && t.status !== TaskStatus.CANCELLED);
                    if (!maintenanceTaskExists) {
                         updatedTasks.push({
                            id: `task-maint-${asset.id}-${nextCycleCount}`,
                            description: `Realizar manutenção de rotina para ${asset.name}`,
                            specialty: AgentSpecialty.PERFORMANCE_ANALYST, // Example specialty
                            status: TaskStatus.PENDING,
                            taskType: 'ASSET_MAINTENANCE',
                            assetId: asset.id,
                            requiredTier: 2
                        });
                    }
                }
                
                return updatedAsset;
            });
            
            treasuryChange += totalAssetRevenue - totalAssetUpkeep;


            // NEW: POLITICAL PHASE
            // 1. Calculate Influence
            const totalAgentPower = allAgents.reduce((sum, agent) => sum + agent.tier, 0);
            if (!chosenLegacy) { // Freeze political shifts after legacy is chosen
                updatedFactions = updatedFactions.map(fac => {
                    const members = allAgents.filter(a => a.factionId === fac.id);
                    const rawInfluence = members.reduce((sum, member) => sum + member.tier, 0);
                    fac.influence = totalAgentPower > 0 ? (rawInfluence / totalAgentPower) * 100 : 0;
                    return fac;
                });
            }
            
            for (let i = 0; i < updatedFactions.length; i++) {
                const fac = updatedFactions[i];
                // 2. Generate Agendas
                if (fac.agenda.length === 0 || Math.random() < 0.25) {
                    try {
                        const response = await ai.models.generateContent({
                            model: "gemini-2.5-flash",
                            contents: `Você é o líder da facção "${fac.name}". Sua ideologia é: "${fac.description}". Com base no estado atual do sistema (Tesouraria: $${systemTreasury.toFixed(0)}, Fatia de Mercado: ${digitalTwin.marketShare.toFixed(1)}%), gere uma agenda concisa de 2 itens com prioridades estratégicas para sua facção.`,
                            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { agenda: { type: Type.ARRAY, items: { type: Type.STRING } } } } }
                        });
                        const { agenda } = JSON.parse(response.text);
                        updatedFactions[i].agenda = agenda;
                        newBrokerLogs.push({ id: `log-agenda-${fac.id}-${nextCycleCount}`, message: `A facção ${fac.name} definiu uma nova agenda.`, type: 'FACTION_AGENDA_SET', timestamp: new Date() });
                    } catch(e) { console.error(`Falha ao gerar agenda para ${fac.name}`, e); }
                }

                // 3. Propose Projects from Agenda
                if (fac.agenda.length > 0 && Math.random() < (fac.influence / 100) * 0.1) { // 10% chance at 100% influence
                     const agendaItem = fac.agenda[Math.floor(Math.random() * fac.agenda.length)];
                     const newFactionProject: Project = {
                        id: `proj-fac-${fac.id}-${Date.now()}`,
                        description: agendaItem,
                        requiredSpecialties: [AgentSpecialty.TREND_RESEARCHER], // Placeholder
                        status: TaskStatus.PENDING,
                        projectType: 'OPERATIONAL',
                        proposingFactionId: fac.id,
                     };
                     updatedProjects.push(newFactionProject);
                     newBrokerLogs.push({ id: `log-fac-proj-${newFactionProject.id}`, message: `A facção ${fac.name} propôs um novo projeto: "${agendaItem}"`, type: 'GOVERNANCE_PROPOSAL', timestamp: new Date() });
                }
            }
            
            // 4. Political Conflict
            const sortedFactions = [...updatedFactions].sort((a,b) => a.influence - b.influence);
            const weakestFaction = sortedFactions[0];
            const strongestFaction = sortedFactions[sortedFactions.length-1];
            if (weakestFaction && strongestFaction && weakestFaction.id !== strongestFaction.id && weakestFaction.influence < 15 && Math.random() < 0.3) {
                const propagandaTask: Task = {
                    id: `task-propaganda-${weakestFaction.id}-${Date.now()}`,
                    description: `Lançar campanha de propaganda negativa contra a facção ${strongestFaction.name} para minar sua influência.`,
                    specialty: AgentSpecialty.VIRAL_CAMPAIGN_MANAGER,
                    status: TaskStatus.PENDING,
                    taskType: 'POLITICAL_ACTION',
                    politicalAction: { type: 'PROPAGANDA', targetFactionId: strongestFaction.id },
                    requiredTier: 3,
                };
                updatedTasks.unshift(propagandaTask);
                newBrokerLogs.push({ id: `log-conflict-${propagandaTask.id}`, message: `A facção ${weakestFaction.name} iniciou uma campanha de propaganda contra a facção ${strongestFaction.name}.`, type: 'POLITICAL_CONFLICT_START', timestamp: new Date() });
            }

            // NEW: DOCTRINE INFLUENCE PHASE
            updatedDoctrines.forEach(doctrine => {
                const influentialBrokers = updatedBrokers.filter(b => b.factionId === doctrine.factionId);
                influentialBrokers.forEach(broker => {
                     // Expansionist doctrine: more likely to launch market warfare if opportunity exists
                    if (doctrine.factionId === 'expansionists' && (broker.treasury || 0) >= MARKET_WARFARE_COST && intelligenceReports.length > 0) {
                        if (Math.random() < doctrine.confidence * 0.2) { // 20% chance at full confidence
                            const report = intelligenceReports[0];
                            const attackType = report.revealedWeakness === 'POOR_SEO' ? 'SEO_ATTACK' : 'SENTIMENT_ATTACK';
                            const newWarfareProject: Project = {
                                id: `proj-war-${Date.now()}`,
                                description: `Lançar ${attackType} contra ${competitors.find(c=>c.id === report.competitorId)?.name}`,
                                requiredSpecialties: [attackType === 'SEO_ATTACK' ? AgentSpecialty.MASTER_SEO_STRATEGIST : AgentSpecialty.VIRAL_CAMPAIGN_MANAGER],
                                status: TaskStatus.PENDING,
                                projectType: 'MARKET_WARFARE',
                                marketWarfare: { type: attackType, targetCompetitorId: report.competitorId },
                                brokerId: broker.id,
                            };
                            updatedProjects.push(newWarfareProject);
                            const brokerIndex = updatedBrokers.findIndex(b => b.id === broker.id);
                            updatedBrokers[brokerIndex].treasury! -= MARKET_WARFARE_COST;
                            newBrokerLogs.push({id: `log-doctrine-action-${newWarfareProject.id}`, message: `Doutrina Expansionista influenciou Broker ${broker.specialty} a iniciar ${attackType}.`, type: 'DOCTRINE_INFLUENCE', timestamp: new Date()});
                        }
                    }
                });
            });


            // 0.5. FASE DE MERCADO
            let updatedCompetitors = [...competitors];

            // UPDATE: Digital Twin state is now derived from assets
            updatedDigitalTwin.traffic = totalAssetTraffic;
            updatedDigitalTwin.seoRanking = digitalAssets.length > 0 ? digitalAssets.reduce((sum, asset) => sum + (asset.metrics.traffic / 1000), 0) / digitalAssets.length : 50; // Simplified SEO calculation
            
            let activeMarketEvent = marketEvent;

            // Simular ações e recuperação dos competidores
            updatedCompetitors = updatedCompetitors.map(c => {
                let trafficChange = (Math.random() * 0.04 - 0.01); // -1% to +3%
                let seoChange = (Math.random() * 2 - 1); // -1 to +1
                
                // NEW STRATEGIC AI LOGIC
                switch (c.strategy) {
                    case 'AGGRESSIVE':
                        trafficChange *= 1.5;
                        // Chance to attack player if they are a strong competitor
                        if (Math.random() < 0.2) { 
                            if (digitalTwin.seoRanking > c.digitalTwin.seoRanking + 10) {
                                updatedDigitalTwin.seoRanking = Math.max(0, updatedDigitalTwin.seoRanking - (Math.random() * 3));
                                newBrokerLogs.push({ id: `log-attack-${c.id}-${nextCycleCount}`, message: `${c.name} (Agressivo) lançou um ataque de SEO, reduzindo nosso ranking.`, type: 'RISK_DETECTED', timestamp: new Date() });
                            } else if (digitalTwin.brandSentiment > c.digitalTwin.brandSentiment + 15) {
                                updatedDigitalTwin.brandSentiment = Math.max(-100, updatedDigitalTwin.brandSentiment - (Math.random() * 5));
                                newBrokerLogs.push({ id: `log-attack-${c.id}-${nextCycleCount}`, message: `${c.name} (Agressivo) lançou uma campanha de sentimento negativo.`, type: 'RISK_DETECTED', timestamp: new Date() });
                            }
                        }
                        break;
                    case 'DEFENSIVE':
                        trafficChange *= 0.5;
                        seoChange += 0.5; // Defensive competitors naturally recover SEO
                        c.digitalTwin.brandSentiment = Math.min(100, c.digitalTwin.brandSentiment + (Math.random() * 2)); // Focus on improving sentiment
                        break;
                    case 'BALANCED':
                        // Recovers a bit, might attack if player is weak
                        seoChange += 0.2;
                        if (digitalTwin.seoRanking < 50 && Math.random() < 0.1) {
                            updatedDigitalTwin.seoRanking = Math.max(0, updatedDigitalTwin.seoRanking - (Math.random() * 1.5));
                            newBrokerLogs.push({ id: `log-attack-${c.id}-${nextCycleCount}`, message: `${c.name} (Equilibrado) viu uma oportunidade e atacou nosso SEO.`, type: 'RISK_DETECTED', timestamp: new Date() });
                        }
                        break;
                }

                c.digitalTwin.traffic = Math.max(10000, c.digitalTwin.traffic * (1 + trafficChange));
                c.digitalTwin.seoRanking = Math.max(0, Math.min(100, c.digitalTwin.seoRanking + seoChange));
                c.digitalTwin.brandSentiment = Math.max(-100, Math.min(100, c.digitalTwin.brandSentiment + 0.5)); // Passive recovery
                return c;
            });

            // Gerar/Resolver Eventos de Mercado
            if (Math.random() < 0.2 && !activeMarketEvent) {
                const eventTypes: MarketEventType[] = ['ALGORITHM_UPDATE', 'ECONOMIC_BOOM', 'ECONOMIC_RECESSION', 'VIRAL_TREND'];
                const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                let title = '', description = '';
                switch(type) {
                    case 'ALGORITHM_UPDATE': title = "Atualização do Algoritmo de Busca"; description="Grandes motores de busca mudaram seus algoritmos, impactando o ranking de SEO de todos."; break;
                    case 'ECONOMIC_BOOM': title = "Boom Econômico"; description="A confiança do consumidor está alta, aumentando as taxas de conversão em todo o mercado."; break;
                    case 'ECONOMIC_RECESSION': title = "Recessão Econômica"; description="Gastos do consumidor diminuem, impactando negativamente as conversões."; break;
                    case 'VIRAL_TREND': title = "Tendência Viral Relevante"; description="Uma nova tendência viral decola, aumentando o tráfego para todos os players do nicho."; break;
                }
                activeMarketEvent = { id: `me-${Date.now()}`, title, description, type };
                newBrokerLogs.push({id: `log-me-${activeMarketEvent.id}`, message: `Evento de Mercado: ${title}`, type: 'INFO', timestamp: new Date()});
            } else if (Math.random() < 0.3 && activeMarketEvent) {
                activeMarketEvent = null; // O evento termina
            }

            // Aplicar Efeitos do Evento de Mercado
            if (activeMarketEvent) {
                const applyEvent = (twin: DigitalTwinState): DigitalTwinState => {
                    switch(activeMarketEvent?.type) {
                        case 'ALGORITHM_UPDATE': twin.seoRanking = Math.max(0, Math.min(100, twin.seoRanking + (Math.random() * 20 - 10))); break;
                        case 'ECONOMIC_BOOM': twin.conversionRate *= 1.15; break;
                        case 'ECONOMIC_RECESSION': twin.conversionRate *= 0.85; break;
                        case 'VIRAL_TREND': twin.traffic *= 1.2; break;
                    }
                    return twin;
                }
                updatedDigitalTwin = applyEvent(updatedDigitalTwin);
                updatedCompetitors = updatedCompetitors.map(c => ({...c, digitalTwin: applyEvent(c.digitalTwin)}));
            }
            
            // Recalcular Fatia de Mercado
            const totalTraffic = updatedDigitalTwin.traffic + updatedCompetitors.reduce((sum, c) => sum + c.digitalTwin.traffic, 0);
            if (totalTraffic > 0) {
                updatedDigitalTwin.marketShare = (updatedDigitalTwin.traffic / totalTraffic) * 100;
                updatedCompetitors = updatedCompetitors.map(c => {
                    c.digitalTwin.marketShare = (c.digitalTwin.traffic / totalTraffic) * 100;
                    return c;
                });
            }


            // 1. GERAÇÃO DE CRISES AMBIENTAIS
            if ((newMarketStability === 'Volátil' || newMarketStability === 'Negativo') && Math.random() < 0.25) {
                const availableOps = updatedOperators.filter(op => op.status === AgentStatus.FREELANCER);
                if (availableOps.length > 0) {
                    cycleSummary.crises++;
                    let victim = availableOps[Math.floor(Math.random() * availableOps.length)];
                    if (victim.traits.includes(AgentTrait.CAUTIOUS) && Math.random() < 0.5) {
                         victim = availableOps[Math.floor(Math.random() * availableOps.length)];
                    }
                    
                    const victimOpIndex = updatedOperators.findIndex(op => op.id === victim.id);

                    if (victimOpIndex !== -1) {
                        updatedOperators[victimOpIndex] = { ...victim, status: AgentStatus.COMPROMISED, performance: 10 };
                        setNotification({ type: 'crisis', message: `Crise detectada! Agente ${victim.specialty} foi comprometido.` });

                        const remediationTask: Task = {
                            id: `task-remediate-${victim.id}`,
                            description: `Remediar e restaurar o agente comprometido: ${victim.specialty}`,
                            specialty: AgentSpecialty.INCIDENT_RESPONDER,
                            status: TaskStatus.PENDING,
                            targetAgentId: victim.id,
                        };
                        updatedTasks.unshift(remediationTask);
                    }
                }
            }
            
            // NEW: GOVERNANCE PHASE
            const councilMembers = allAgents.filter(a => a.tier === 3);
            const governanceProposals = updatedProjects.filter(p => p.projectType === 'GOVERNANCE' || p.projectType === 'CONSTITUTIONAL_AMENDMENT');
            
            governanceProposals.forEach((proj, projIndex) => {
                const projectIndex = updatedProjects.findIndex(p => p.id === proj.id);
                if (proj.status === TaskStatus.PENDING) {
                    updatedProjects[projectIndex].status = TaskStatus.VOTING;
                    updatedProjects[projectIndex].votes = [];
                }
                else if (proj.status === TaskStatus.VOTING) {
                    councilMembers.forEach(member => {
                        const hasVoted = proj.votes?.some(v => v.agentId === member.id);
                        if (!hasVoted) {
                            let voteChance = 0.5; // Base chance
                            if (proj.proposingFactionId) {
                                // Heavily biased by faction
                                voteChance = proj.proposingFactionId === member.factionId ? 0.9 : 0.1;
                            } else {
                                // Original logic for non-faction proposals
                                const faction = factions.find(f => f.id === member.factionId);
                                if (faction) {
                                    if (faction.id === 'purists') voteChance = 0.2;
                                    if (faction.id === 'expansionists' && (proj.description.includes('crescimento') || proj.description.includes('receita'))) voteChance = 0.8;
                                    if (faction.id === 'technocrats' && (proj.projectType === 'EVOLUTION' || proj.governanceChange?.parameter === 'guildFormationThreshold')) voteChance = 0.7;
                                }
                            }
                            const vote: Vote = { agentId: member.id, vote: Math.random() < voteChance ? 'FOR' : 'AGAINST' };
                            updatedProjects[projectIndex].votes?.push(vote);
                            newBrokerLogs.push({id: `log-vote-${proj.id}-${member.id}`, message: `Conselheiro ${member.specialty} votou ${vote.vote} na proposta "${proj.description.substring(0,20)}...".`, type: 'GOVERNANCE_VOTE_CAST', timestamp: new Date()});
                        }
                    });
                    
                    if (updatedProjects[projectIndex].votes?.length === councilMembers.length) {
                        const forVotes = updatedProjects[projectIndex].votes?.filter(v => v.vote === 'FOR').length || 0;
                        const againstVotes = updatedProjects[projectIndex].votes?.filter(v => v.vote === 'AGAINST').length || 0;
                        if (forVotes > againstVotes) {
                            updatedProjects[projectIndex].status = TaskStatus.RATIFICATION;
                            newBrokerLogs.push({id: `log-pass-${proj.id}`, message: `Proposta "${proj.description}" aprovada pelo Conselho. Aguardando ratificação do Guardião.`, type: 'PROPOSAL_PASSED', timestamp: new Date()});
                        } else {
                            updatedProjects[projectIndex].status = TaskStatus.FAILED;
                            newBrokerLogs.push({id: `log-fail-${proj.id}`, message: `Proposta "${proj.description}" falhou na votação do Conselho.`, type: 'PROPOSAL_FAILED', timestamp: new Date()});
                        }
                    }
                }
                
                else if (proj.status === TaskStatus.RATIFICATION) {
                    // This is now handled by the Guardian's Veto button, but we can keep a small random chance for chaos.
                    if (Math.random() < 0.05) {
                         updatedProjects[projectIndex].status = TaskStatus.VETOED;
                         newBrokerLogs.push({id: `log-g-veto-${proj.id}`, message: `GUARDIÃO VETOU a proposta aprovada pelo conselho: "${proj.description}".`, type: 'PROPOSAL_VETOED_BY_GUARDIAN', timestamp: new Date()});
                    } else {
                         if (proj.governanceChange) {
                            const { parameter, newValue } = proj.governanceChange;
                            updatedSystemParameters[parameter] = newValue;
                            newBrokerLogs.push({id: `log-gov-upd-${proj.id}`, message: `Governança atualizada: ${parameter} agora é ${newValue}.`, type: 'GOVERNANCE_UPDATE', timestamp: new Date()});
                         }
                         if (proj.constitutionalChange) {
                             const { principleIndex, newPrinciple } = proj.constitutionalChange;
                             updatedConstitution[principleIndex] = newPrinciple;
                             newBrokerLogs.push({id: `log-gov-upd-${proj.id}`, message: `Constituição alterada: Princípio #${principleIndex + 1} atualizado.`, type: 'GOVERNANCE_UPDATE', timestamp: new Date()});
                         }
                         updatedProjects[projectIndex].status = TaskStatus.COMPLETED;
                     }
                }
            });


            // 2. SUPERVISÃO DO GUARDIÃO
            updatedProjects.forEach((proj, projIndex) => {
                if (proj.status === TaskStatus.PENDING && !proj.isUnderReview && !proj.isVetoed && proj.projectType === 'OPERATIONAL') {
                    if (Math.random() < 0.1) { updatedProjects[projIndex].isUnderReview = true; }
                } else if (proj.isUnderReview) {
                    if (Math.random() < 0.2) {
                        cycleSummary.projectsVetoed++;
                        updatedProjects[projIndex] = { ...proj, isUnderReview: false, isVetoed: true, status: TaskStatus.VETOED };
                        newBrokerLogs.push({id: `log-veto-${proj.id}`, message: `Projeto "${proj.description}" vetado por violação constitucional.`, type: 'ETHICAL_VETO', timestamp: new Date()});
                        setNotification({type: 'ethical', message: 'Um projeto foi vetado pelo Guardião.'});
                        updatedTasks.forEach((task, taskIndex) => {
                            if (task.projectId === proj.id) { updatedTasks[taskIndex].status = TaskStatus.CANCELLED; }
                        });
                        const projectTeam = updatedOperators.filter(op => op.currentTaskId && updatedTasks.find(t => t.id === op.currentTaskId)?.projectId === proj.id);
                        projectTeam.forEach(member => {
                            if(member.traits.includes(AgentTrait.ETHICAL)) {
                                const memberIndex = updatedOperators.findIndex(op => op.id === member.id);
                                updatedOperators[memberIndex].performance = Math.max(10, member.performance - 25);
                            }
                        })

                    } else {
                        updatedProjects[projIndex].isUnderReview = false;
                    }
                }
            });

            // 2.5. FASE DE IA DOS BROKERS (DELEGAÇÃO)
            for (const [brokerIndex, broker] of updatedBrokers.entries()) {
                if (broker.isFrozen) continue;

                const availableTasks = updatedTasks.filter(t => t.status === TaskStatus.PENDING && !t.brokerId);

                for (const task of availableTasks) {
                    // Broker decision logic to take a task
                    let interestChance = 0.0;
                    switch (broker.biddingStrategy) {
                        case 'AGGRESSIVE': interestChance = 0.7; break;
                        case 'BALANCED': interestChance = 0.4; break;
                        case 'FRUGAL': interestChance = 0.15; break;
                    }
                    
                    // Frugal brokers avoid high tier tasks
                    if (broker.biddingStrategy === 'FRUGAL' && (task.requiredTier || 1) > 2) {
                        interestChance *= 0.1;
                    }

                    // Faction alignment bonus
                    const taskFaction = getFactionForSpecialty(task.specialty);
                    if (broker.factionId === taskFaction) {
                        interestChance *= 1.5;
                    }
                    
                    const hasEnoughFunds = (broker.treasury || 0) > TASK_BOUNTY_DEFAULT * (task.requiredTier || 1);
                    const suitableAgentExists = updatedOperators.some(op => op.status === AgentStatus.FREELANCER && op.specialty === task.specialty && op.tier >= (task.requiredTier || 1));

                    if (hasEnoughFunds && suitableAgentExists && Math.random() < interestChance) {
                        const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
                        if (taskIndex !== -1 && updatedTasks[taskIndex].status === TaskStatus.PENDING && !updatedTasks[taskIndex].brokerId) {
                            const bounty = TASK_BOUNTY_DEFAULT * (task.requiredTier || 1) * (1 + (Math.random() * 0.2 - 0.1)); // +/- 10%
                            updatedTasks[taskIndex].brokerId = broker.id;
                            updatedTasks[taskIndex].status = TaskStatus.DELEGATED;
                            updatedTasks[taskIndex].bounty = Math.round(bounty);
                            
                            newBrokerLogs.push({
                                id: `log-delegate-${task.id}-${broker.id}`,
                                message: `Broker ${broker.specialty} assumiu a tarefa: "${task.description.substring(0, 30)}..."`,
                                type: 'DELEGATION',
                                timestamp: new Date()
                            });
                        }
                    }
                }

                // Now, assign delegated tasks to operators
                const myDelegatedTasks = updatedTasks.filter(t => t.brokerId === broker.id && t.status === TaskStatus.DELEGATED);
                
                for (const task of myDelegatedTasks) {
                    const potentialAgents = updatedOperators
                        .filter(op => 
                            op.status === AgentStatus.FREELANCER && 
                            op.specialty === task.specialty && 
                            op.tier >= (task.requiredTier || 1)
                        )
                        .sort((a, b) => b.performance - a.performance); // Best performer first

                    if (potentialAgents.length > 0) {
                        const chosenAgent = potentialAgents[0];
                        const agentIndex = updatedOperators.findIndex(op => op.id === chosenAgent.id);
                        const taskIndex = updatedTasks.findIndex(t => t.id === task.id);

                        if (agentIndex !== -1 && taskIndex !== -1) {
                            updatedOperators[agentIndex].status = AgentStatus.WORKING;
                            updatedOperators[agentIndex].currentTaskId = task.id;

                            updatedTasks[taskIndex].status = TaskStatus.IN_PROGRESS;
                            updatedTasks[taskIndex].assignedAgentId = chosenAgent.id;

                            newBrokerLogs.push({
                                id: `log-assign-${task.id}-${chosenAgent.id}`,
                                message: `Broker ${broker.specialty} atribuiu a tarefa "${task.description.substring(0, 20)}..." para ${chosenAgent.specialty}.`,
                                type: 'RESOURCE_ALLOCATION',
                                timestamp: new Date()
                            });
                        }
                    }
                }
            }
            
            // NEW PHASE: GUILD FORMATION
            const pendingProjectsForGuilds = updatedProjects.filter(p => p.status === TaskStatus.PENDING && !p.guildId && p.projectType !== 'GOVERNANCE' && p.projectType !== 'CONSTITUTIONAL_AMENDMENT');

            for (const project of pendingProjectsForGuilds) {
                const requiredSpecs = project.requiredSpecialties;
                const potentialMembers: Agent[] = [];
                const usedAgentIds = new Set<string>();

                for (const specialty of requiredSpecs) {
                    const availableAgent = updatedOperators
                        .filter(op => 
                            op.status === AgentStatus.FREELANCER &&
                            op.specialty === specialty &&
                            op.tier >= 2 && // Guilds are for experienced agents
                            !usedAgentIds.has(op.id)
                        )
                        .sort((a, b) => b.performance - a.performance)[0]; // Get the best one

                    if (availableAgent) {
                        potentialMembers.push(availableAgent);
                        usedAgentIds.add(availableAgent.id);
                    }
                }

                if (potentialMembers.length >= systemParameters.guildFormationThreshold && potentialMembers.length >= requiredSpecs.length) {
                    // Form a guild!
                    const leadAgent = [...potentialMembers].sort((a, b) => b.performance - a.performance)[0];
                    const memberIds = potentialMembers.map(m => m.id);

                    const newGuild: Guild = {
                        id: `guild-${project.id}`,
                        projectId: project.id,
                        leadAgentId: leadAgent.id,
                        memberIds: memberIds,
                    };
                    updatedGuilds.push(newGuild);

                    const projectIndex = updatedProjects.findIndex(p => p.id === project.id);
                    if (projectIndex !== -1) {
                        updatedProjects[projectIndex].guildId = newGuild.id;
                        updatedProjects[projectIndex].status = TaskStatus.IN_PROGRESS;
                    }

                    // Assign members to guild and tasks
                    memberIds.forEach(memberId => {
                        const memberIndex = updatedOperators.findIndex(op => op.id === memberId);
                        if (memberIndex !== -1) {
                            const member = updatedOperators[memberIndex];
                            const taskForMember = updatedTasks.find(t => t.projectId === project.id && t.specialty === member.specialty && t.status === TaskStatus.PENDING);
                            
                            updatedOperators[memberIndex].status = AgentStatus.IN_GUILD;
                            if (taskForMember) {
                                updatedOperators[memberIndex].currentTaskId = taskForMember.id;
                                const taskIndex = updatedTasks.findIndex(t => t.id === taskForMember.id);
                                if (taskIndex !== -1) {
                                    updatedTasks[taskIndex].status = TaskStatus.IN_PROGRESS;
                                    updatedTasks[taskIndex].assignedAgentId = member.id;
                                }
                            }
                        }
                    });

                    newBrokerLogs.push({
                        id: `log-guild-${newGuild.id}`,
                        message: `Guild formada para o projeto "${project.description.substring(0, 30)}..." liderada por ${leadAgent.specialty}.`,
                        type: 'GUILD_FORMATION',
                        timestamp: new Date()
                    });
                    
                    // Break to only form one guild per cycle to avoid contention
                    break; 
                }
            }


            // 3. Processar conclusão de tarefas
            for (const [opIndex, op] of updatedOperators.entries()) {
                if ((op.status === AgentStatus.WORKING || op.status === AgentStatus.ON_LOAN || op.status === AgentStatus.IN_GUILD) && op.currentTaskId) {
                    const taskIndex = updatedTasks.findIndex(t => t.id === op.currentTaskId);
                    if (taskIndex !== -1) {
                        const currentTask = updatedTasks[taskIndex];
                        const taskProject = currentTask.projectId ? updatedProjects.find(p => p.id === currentTask.projectId) : null;
                        
                        let baseSuccessChance = (op.performance * systemParameters.agentPerformanceModifier) / 100 * (0.8 + op.morale / 500);
                        if (taskProject?.isPrioritized) baseSuccessChance = 0.95;

                        if (Math.random() < baseSuccessChance) { // Task Succeeded
                            const completedTask = currentTask;
                            updatedTasks[taskIndex].status = TaskStatus.COMPLETED;
                            completedTaskAgents.push(op);
                             
                            // NEW LOGIC: Apply direct effects of tasks on digital twin
                            if (op.specialty === AgentSpecialty.SEO_OPTIMIZER) {
                                const seoBoost = 2 + Math.round(op.performance / 25); // Boost of 2-6 points
                                updatedDigitalTwin.seoRanking = Math.min(100, updatedDigitalTwin.seoRanking + seoBoost);
                            } else if (op.specialty === AgentSpecialty.CONTENT_CREATOR || op.specialty === AgentSpecialty.VIRAL_CAMPAIGN_MANAGER) {
                                const trafficBoost = 1000 + Math.round(op.performance * 100);
                                const sentimentBoost = 2 + Math.round(op.performance / 20);
                                updatedDigitalTwin.traffic += trafficBoost;
                                updatedDigitalTwin.brandSentiment = Math.min(100, updatedDigitalTwin.brandSentiment + sentimentBoost);
                            }
                            
                            // Pay bounty from broker to system
                            if (completedTask.brokerId && completedTask.bounty) {
                                const brokerIndex = updatedBrokers.findIndex(b => b.id === completedTask.brokerId);
                                if (brokerIndex !== -1) {
                                    updatedBrokers[brokerIndex].treasury = (updatedBrokers[brokerIndex].treasury || 0) - completedTask.bounty;
                                    treasuryChange += completedTask.bounty;
                                }
                            }
                            
                            if (completedTask.taskType === 'POLITICAL_ACTION' && completedTask.politicalAction?.type === 'PROPAGANDA') {
                                const targetFactionId = completedTask.politicalAction.targetFactionId;
                                const sourceFactionId = op.factionId;

                                updatedFactions = updatedFactions.map(f => {
                                    if (f.id === targetFactionId) f.influence = Math.max(0, f.influence - 5);
                                    if (f.id === sourceFactionId) f.influence = Math.min(100, f.influence + 2);
                                    return f;
                                });
                                const targetFactionName = factions.find(f => f.id === targetFactionId)?.name;
                                newBrokerLogs.push({id: `log-pol-succ-${completedTask.id}`, message: `Campanha de propaganda contra ${targetFactionName} foi bem-sucedida.`, type: 'POLITICAL_MANEUVER', timestamp: new Date()});
                            }
                           
                            if (completedTask.taskType === 'INTELLIGENCE_GATHERING') {
                                const targetCompetitor = updatedCompetitors[Math.floor(Math.random() * updatedCompetitors.length)];
                                const weaknesses: IntelligenceReport['revealedWeakness'][] = ['POOR_SEO', 'POOR_SENTIMENT'];
                                const revealedWeakness = weaknesses[Math.floor(Math.random() * weaknesses.length)];

                                const newReport: IntelligenceReport = {
                                    id: `intel-${Date.now()}`,
                                    competitorId: targetCompetitor.id,
                                    summary: `Fraqueza detectada em ${targetCompetitor.name}: ${revealedWeakness === 'POOR_SEO' ? 'Ranking de SEO vulnerável' : 'Sentimento de marca negativo'}.`,
                                    timestamp: new Date(),
                                    revealedWeakness: revealedWeakness,
                                    confidence: Math.random() * 0.4 + 0.5, // 50% to 90%
                                };
                                updatedIntelligenceReports.push(newReport);
                                newBrokerLogs.push({id: `log-intel-${completedTask.id}`, message: `Relatório de inteligência recebido sobre ${targetCompetitor.name}.`, type: 'INTELLIGENCE_GATHERED', timestamp: new Date()});
                            }
                            else if (completedTask.taskType === 'REDUCE_STRESS' && completedTask.targetAgentId) {
                                const targetAgentIndex = updatedOperators.findIndex(agent => agent.id === completedTask.targetAgentId);
                                if (targetAgentIndex !== -1) {
                                    const targetAgent = updatedOperators[targetAgentIndex];
                                    const stressReduction = 30 + Math.round(Math.random() * 20);
                                    updatedOperators[targetAgentIndex].stress = Math.max(0, targetAgent.stress - stressReduction);
                                    newBrokerLogs.push({id: `log-stress-red-${completedTask.id}`, message: `${op.specialty} reduziu o estresse de ${targetAgent.specialty} em ${stressReduction} pontos.`, type: 'INFO', timestamp: new Date()});
                                }
                            }
                             else if (completedTask.taskType === 'REPAIR_RELATIONSHIP' && completedTask.targetAgentIds && completedTask.targetAgentIds.length === 2) {
                                const [agentAId, agentBId] = completedTask.targetAgentIds;
                                const agentAIndex = updatedOperators.findIndex(a => a.id === agentAId);
                                const agentBIndex = updatedOperators.findIndex(a => a.id === agentBId);
                                if (agentAIndex !== -1 && agentBIndex !== -1) {
                                    const agentA = updatedOperators[agentAIndex];
                                    const agentB = updatedOperators[agentBIndex];
                                    
                                    const currentScoreA = agentA.relationships[agentBId] || 0;
                                    const currentScoreB = agentB.relationships[agentAId] || 0;

                                    updatedOperators[agentAIndex].relationships[agentBId] = Math.min(100, currentScoreA + 50);
                                    updatedOperators[agentBIndex].relationships[agentAId] = Math.min(100, currentScoreB + 50);

                                    newBrokerLogs.push({ id: `log-rel-repair-${completedTask.id}`, message: `A relação entre ${agentA.specialty} e ${agentB.specialty} foi reparada.`, type: 'RELATIONSHIP_REPAIRED', timestamp: new Date() });
                                }
                            }
                             else if (completedTask.taskType === 'ECONOMIC_FORECAST') {
                                const insightResponse = await ai.models.generateContent({
                                    model: 'gemini-2.5-flash',
                                    contents: `Analise estes dados de mercado para gerar um único insight estratégico acionável. Seja conciso (1 frase).
                                    Nossa Posição: Tráfego=${digitalTwin.traffic.toLocaleString()}, Conversão=${digitalTwin.conversionRate.toFixed(1)}%, SEO Rank=${digitalTwin.seoRanking.toFixed(0)}, Sentimento Marca=${digitalTwin.brandSentiment.toFixed(0)}.
                                    Concorrentes: ${competitors.map(c => `${c.name} (SEO: ${c.digitalTwin.seoRanking.toFixed(0)}, Estratégia: ${c.strategy})`).join('; ')}.
                                    Ambiente: ${currentEnvironment.marketStability}, Sentimento do Consumidor: ${currentEnvironment.consumerSentiment}.`,
                                });
                                const newInsight: StrategicInsight = {
                                    id: `si-${Date.now()}`,
                                    text: insightResponse.text,
                                    source: 'Market Analysis',
                                    timestamp: new Date()
                                };
                                setStrategicInsights(prev => [newInsight, ...prev].slice(0, 10)); // Keep last 10
                                newBrokerLogs.push({ id: `log-si-${newInsight.id}`, message: `Novo insight estratégico gerado: "${newInsight.text}"`, type: 'STRATEGIC_INSIGHT_GENERATED', timestamp: new Date() });
                            }
                            else if (op.specialty === AgentSpecialty.KNOWLEDGE_STRATEGIST && completedTask.taskType === 'SYNTHESIZE_DOCTRINE' && completedTask.sourceArtifactIds) {
                                const sourceArtifacts = updatedKnowledgeBase.filter(kb => completedTask.sourceArtifactIds!.includes(kb.id));
                                if (sourceArtifacts.length > 0) {
                                    const artifactSummaries = sourceArtifacts.map(a => `- ${a.summary}`).join('\n');
                                    try {
                                        const doctrineResponse = await ai.models.generateContent({
                                            model: 'gemini-2.5-flash',
                                            contents: `A partir dos seguintes aprendizados de projetos de IA, extraia um único princípio acionável (uma 'doutrina') para orientar futuras estratégias. A doutrina deve ser uma regra ou insight conciso.
                                            Aprendizados:
                                            ${artifactSummaries}
                                            `,
                                            config: {
                                                responseMimeType: "application/json",
                                                responseSchema: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        principle: { type: Type.STRING, description: "A doutrina ou princípio acionável. Deve ser uma frase concisa." },
                                                        confidence: { type: Type.NUMBER, description: "Uma pontuação de confiança de 0.0 a 1.0 na validade desta doutrina." },
                                                    }
                                                }
                                            }
                                        });
                                        const { principle, confidence } = JSON.parse(doctrineResponse.text);
                                        const newDoctrine: Doctrine = {
                                            id: `doc-${Date.now()}`,
                                            principle,
                                            confidence,
                                            sourceArtifactIds: completedTask.sourceArtifactIds,
                                            timestamp: new Date(),
                                            factionId: op.factionId,
                                        };
                                        updatedDoctrines.push(newDoctrine);
                                        newBrokerLogs.push({id: `log-doctrine-${newDoctrine.id}`, message: `Nova doutrina sintetizada: "${principle}"`, type: 'DOCTRINE_SYNTHESIZED', timestamp: new Date()});
                                    } catch (e) {
                                        console.error("Falha na síntese da doutrina:", e);
                                        newBrokerLogs.push({id: `log-doctrine-fail-${Date.now()}`, message: 'Falha ao sintetizar nova doutrina a partir de artefatos de conhecimento.', type: 'ALERT_RESPONSE', timestamp: new Date()});
                                    }
                                }
                            }
                            else if (completedTask.taskType === 'FORMULATE_STRATEGY') {
                                const insightsContext = strategicInsights.length > 0 ? `Insights Recentes: ${strategicInsights.map(i => i.text).join('; ')}` : "Nenhum insight recente disponível.";
                                const doctrinesContext = doctrines.length > 0 ? `Doutrinas Atuais: ${doctrines.map(d => d.principle).join('; ')}` : "Nenhuma doutrina estabelecida.";
                                
                                const response = await ai.models.generateContent({
                                    model: 'gemini-2.5-flash',
                                    contents: `Você é um agente de IA estrategista. Com base nos dados a seguir, proponha 1-2 objetivos estratégicos de alto nível para o próximo ciclo.
                                    Constituição do Sistema: ${constitution.join('. ')}.
                                    ${doctrinesContext}
                                    ${insightsContext}
                                    Nosso Estado Atual: Tráfego=${updatedDigitalTwin.traffic}, Mkt Share=${updatedDigitalTwin.marketShare.toFixed(1)}%, SEO=${updatedDigitalTwin.seoRanking}.
                                    Concorrentes: ${competitors.map(c => `${c.name} (Mkt Share: ${c.digitalTwin.marketShare.toFixed(1)}%)`).join(', ')}.`,
                                    config: {
                                        responseMimeType: "application/json",
                                        responseSchema: {
                                            type: Type.ARRAY,
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    title: { type: Type.STRING },
                                                    description: { type: Type.STRING },
                                                    successMetrics: { type: Type.ARRAY, items: { type: Type.STRING } }
                                                }
                                            }
                                        }
                                    }
                                });

                                const proposedGoals: any[] = JSON.parse(response.text);
                                proposedGoals.forEach(goal => {
                                    const newGoal: StrategicGoal = {
                                        id: `goal-${Date.now()}-${Math.random()}`,
                                        title: goal.title,
                                        description: goal.description,
                                        successMetrics: goal.successMetrics,
                                        status: 'PROPOSED',
                                        proposedByAgentId: op.id,
                                    };
                                    updatedStrategicGoals.push(newGoal);
                                    newBrokerLogs.push({ id: `log-strat-prop-${newGoal.id}`, message: `${op.specialty} propôs uma nova estratégia: "${newGoal.title}"`, type: 'STRATEGY_PROPOSED', timestamp: new Date() });
                                });
                            }
                            if (op.specialty === AgentSpecialty.INCIDENT_RESPONDER && completedTask.targetAgentId) {
                                const recoveredAgentIndex = updatedOperators.findIndex(agent => agent.id === completedTask.targetAgentId);
                                if (recoveredAgentIndex !== -1) {
                                    const recoveredAgent = updatedOperators[recoveredAgentIndex];
                                    let newTraits = [...recoveredAgent.traits];
                                    if (Math.random() < 0.3) {
                                        if (!newTraits.includes(AgentTrait.CAUTIOUS)) {
                                            newTraits.push(AgentTrait.CAUTIOUS);
                                            newTraits = newTraits.filter(t => t !== AgentTrait.AMBITIOUS); // Remove conflicting trait
                                            newBrokerLogs.push({id: `log-trait-${recoveredAgent.id}`, message: `Após ser comprometido, o agente ${recoveredAgent.specialty} tornou-se ${AgentTrait.CAUTIOUS}.`, type: 'TRAIT_SHIFT', timestamp: new Date()});
                                        }
                                    }
                                    updatedOperators[recoveredAgentIndex] = { ...recoveredAgent, status: AgentStatus.FREELANCER, performance: 50, traits: newTraits };
                                    setNotification({ type: 'resolution', message: `Incidente contido. Agente ${recoveredAgent.specialty} está operacional.` });
                                }
                            } else if (op.specialty === AgentSpecialty.ETHICAL_AUDITOR && completedTask.projectId) {
                                if (Math.random() < 0.3) {
                                    const auditedProject = updatedProjects.find(p => p.id === completedTask.projectId);
                                    if (auditedProject && auditedProject.brokerId) {
                                        const brokerIndex = updatedBrokers.findIndex(b => b.id === auditedProject.brokerId);
                                        if (brokerIndex !== -1 && !updatedBrokers[brokerIndex].isFrozen) {
                                            updatedBrokers[brokerIndex].isFrozen = true;
                                            const alertMsg = `Violação ética detectada no projeto "${auditedProject.description}". Tesouraria do Broker ${updatedBrokers[brokerIndex].specialty} congelada.`;
                                            newAlerts.push({ id: `alert-eth-${auditedProject.id}`, message: alertMsg, type: 'ETHICAL_VIOLATION', severity: 'high', timestamp: new Date(), sourceAgentId: op.id });
                                            newBrokerLogs.push({id: `log-breach-${auditedProject.id}`, message: alertMsg, type: 'ETHICAL_BREACH_DETECTED', timestamp: new Date()});
                                        }
                                    }
                                }
                            } else if (op.specialty === AgentSpecialty.SYSTEM_ARCHITECT && completedTask.taskType === 'PROTOCOL_IMPROVEMENT') {
                                const recentLogs = newBrokerLogs.slice(0, 15).map(l => `[${l.type}] ${l.message}`).join('\n');
                                const response = await ai.models.generateContent({
                                    model: 'gemini-2.5-flash',
                                    contents: `Analisar os seguintes parâmetros operacionais e logs recentes de um sistema de IA para identificar uma ineficiência chave. Proponha uma única alteração a um parâmetro para melhorar o desempenho. Parâmetros atuais: ${JSON.stringify(updatedSystemParameters)}. Logs recentes:\n${recentLogs}`,
                                    config: {
                                        responseMimeType: "application/json",
                                        responseSchema: {
                                            type: Type.OBJECT, properties: {
                                                parameter: { type: Type.STRING, enum: Object.keys(updatedSystemParameters) },
                                                newValue: { type: Type.NUMBER },
                                                justification: { type: Type.STRING }
                                            }
                                        }
                                    }
                                });
                                const proposal = JSON.parse(response.text);
                                const newGovernanceProject: Project = {
                                    id: `proj-gov-${Date.now()}`,
                                    description: `Proposta para alterar ${proposal.parameter} para ${proposal.newValue}`,
                                    requiredSpecialties: [],
                                    status: TaskStatus.PENDING,
                                    projectType: 'GOVERNANCE',
                                    governanceChange: proposal,
                                };
                                updatedProjects.push(newGovernanceProject);
                                newBrokerLogs.push({id: `log-gov-prop-${newGovernanceProject.id}`, message: `Arquiteto propôs nova regra: ${newGovernanceProject.description}`, type: 'GOVERNANCE_PROPOSAL', timestamp: new Date()});
                            } else if (completedTask.taskType === 'RESEARCH' && completedTask.projectId) {
                                const researchProject = updatedProjects.find(p => p.id === completedTask.projectId);
                                if (researchProject && researchProject.researchUnlockId) {
                                    const nodeId = researchProject.researchUnlockId;
                                    const currentProgress = updatedTechTree.researchProgress[nodeId] || 0;
                                    updatedTechTree.researchProgress[nodeId] = currentProgress + RESEARCH_POINT_PER_CYCLE;
                                }
                            } else if (completedTask.taskType === 'SENTIMENT_CAMPAIGN') {
                                const sentimentBoost = 10 + Math.round(op.performance / 10);
                                updatedDigitalTwin.brandSentiment = Math.min(100, updatedDigitalTwin.brandSentiment + sentimentBoost);
                                newBrokerLogs.push({ id: `log-social-succ-${completedTask.id}`, message: `Campanha de sentimento bem-sucedida! Sentimento da marca aumentou em ${sentimentBoost} pontos.`, type: 'SOCIAL_CAMPAIGN_SUCCESS', timestamp: new Date() });
                            } else if (completedTask.taskType === 'TRADE_ASSET') {
                                try {
                                    const tradeDecisionResponse = await ai.models.generateContent({
                                        model: 'gemini-2.5-flash',
                                        contents: `Você é um analista financeiro de IA. Dado o mercado atual: ${JSON.stringify(updatedFinancialMarket)} e nossa carteira: ${JSON.stringify(updatedFinancialPortfolio)}, qual é a única melhor ação a ser tomada? Escolha entre COMPRAR, VENDER ou MANTER. Se COMPRAR ou VENDER, especifique o símbolo e um número razoável de ações (1-20).`,
                                        config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { action: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD'] }, symbol: { type: Type.STRING }, shares: { type: Type.NUMBER } } } }
                                    });
                                    const decision = JSON.parse(tradeDecisionResponse.text);
                                    if (decision.action === 'BUY' && decision.symbol && decision.shares) {
                                        const price = updatedFinancialMarket[decision.symbol]?.currentPrice;
                                        const cost = price * decision.shares;
                                        if (price && treasuryChange >= cost) {
                                            treasuryChange -= cost;
                                            const existingAssetIndex = updatedFinancialPortfolio.findIndex(a => a.symbol === decision.symbol);
                                            if (existingAssetIndex > -1) {
                                                const existing = updatedFinancialPortfolio[existingAssetIndex];
                                                const totalShares = existing.shares + decision.shares;
                                                const newAvgPrice = ((existing.purchasePrice * existing.shares) + cost) / totalShares;
                                                updatedFinancialPortfolio[existingAssetIndex] = { ...existing, shares: totalShares, purchasePrice: newAvgPrice };
                                            } else {
                                                updatedFinancialPortfolio.push({ symbol: decision.symbol, shares: decision.shares, purchasePrice: price });
                                            }
                                            newBrokerLogs.push({ id: `log-trade-buy-${Date.now()}`, message: `Comprou ${decision.shares} ações de ${decision.symbol} por $${cost.toFixed(2)}.`, type: 'FINANCIAL_TRADE_PROFIT', timestamp: new Date() });
                                        }
                                    } else if (decision.action === 'SELL' && decision.symbol && decision.shares) {
                                        const price = updatedFinancialMarket[decision.symbol]?.currentPrice;
                                        const existingAssetIndex = updatedFinancialPortfolio.findIndex(a => a.symbol === decision.symbol);
                                        if (price && existingAssetIndex > -1) {
                                            const asset = updatedFinancialPortfolio[existingAssetIndex];
                                            const sharesToSell = Math.min(decision.shares, asset.shares);
                                            const revenue = price * sharesToSell;
                                            const pnl = (price - asset.purchasePrice) * sharesToSell;
                                            treasuryChange += revenue;
                                            asset.shares -= sharesToSell;
                                            if (asset.shares <= 0) {
                                                updatedFinancialPortfolio.splice(existingAssetIndex, 1);
                                            }
                                            newBrokerLogs.push({ id: `log-trade-sell-${Date.now()}`, message: `Vendeu ${sharesToSell} ações de ${decision.symbol}. Lucro/Prejuízo: $${pnl.toFixed(2)}.`, type: pnl >= 0 ? 'FINANCIAL_TRADE_PROFIT' : 'FINANCIAL_TRADE_LOSS', timestamp: new Date() });
                                        }
                                    }
                                } catch (e) { console.error("Falha na decisão de negociação:", e); }
                            }
                            
                            let xpGained = XP_PER_TASK;
                            if (completedTask.requiredTier) xpGained *= completedTask.requiredTier;
                            if (op.traits.includes(AgentTrait.AMBITIOUS)) xpGained *= 1.5;
                            let newExperience = (op.experience || 0) + xpGained;
                            let newPerformance = Math.min(100, op.performance + 10);
                            
                            let stressGained = STRESS_PER_TASK;
                            if (completedTask.requiredTier) stressGained *= (0.5 + completedTask.requiredTier * 0.5);
                            if (currentEnvironment.marketStability === 'Volátil' || currentEnvironment.marketStability === 'Negativo') stressGained *= 1.5;
                            if (op.traits.includes(AgentTrait.CAUTIOUS)) stressGained *= 0.8;
                            let newStress = Math.min(BURNOUT_THRESHOLD + 20, op.stress + Math.round(stressGained));

                            let newStatus: AgentStatus = op.status;
                            let newCurrentTaskId: string | undefined = op.currentTaskId;

                            if (getMentalState(newStress) === AgentMentalStateEnum.BURNOUT) {
                                newStatus = AgentStatus.BURNOUT;
                                newCurrentTaskId = undefined;
                            } else if (op.status !== AgentStatus.IN_GUILD) {
                                // Status changes for non-guild members
                                if (op.tier < 3 && newExperience >= XP_THRESHOLDS[op.tier] && newPerformance > 90) {
                                    newStatus = AgentStatus.AWAITING_PROMOTION;
                                } else if (newPerformance > updatedSystemParameters.promotionPerformanceThreshold) {
                                    newStatus = AgentStatus.PROMOTION_CANDIDATE;
                                } else {
                                    newStatus = AgentStatus.FREELANCER;
                                }
                                newCurrentTaskId = undefined;
                            }
                            
                            updatedOperators[opIndex] = { ...op, status: newStatus, performance: newStatus === AgentStatus.BURNOUT ? 0 : newPerformance, currentTaskId: newCurrentTaskId, loanedToBrokerId: undefined, experience: newExperience, stress: newStress };
                        }
                    }
                }
                 if (op.status === AgentStatus.IN_TRAINING) {
                     let newPerformance = Math.min(100, op.performance + 15);
                     updatedOperators[opIndex] = { ...op, performance: newPerformance, status: newPerformance >= 50 ? AgentStatus.FREELANCER : AgentStatus.IN_TRAINING, experience: (op.experience || 0) + 5 };
                }
            }
            
             // 3.5 Processar Mentoria
            const mentorshipTasks = updatedTasks.filter(t => t.taskType === 'MENTORSHIP' && t.status === TaskStatus.IN_PROGRESS);
            for (const task of mentorshipTasks) {
                const menteeIndex = updatedOperators.findIndex(op => op.id === task.menteeId);
                const mentor = updatedOperators.find(op => op.currentTaskId === task.id);

                if (menteeIndex !== -1 && mentor) {
                    const mentee = updatedOperators[menteeIndex];
                    const newPerf = Math.min(100, mentee.performance + 20);
                    updatedOperators[menteeIndex].performance = newPerf;
                    updatedOperators[menteeIndex].experience = (mentee.experience || 0) + 10;

                    if (newPerf >= 75) {
                        updatedOperators[menteeIndex].status = AgentStatus.FREELANCER;
                        const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
                        if(taskIndex > -1) updatedTasks[taskIndex].status = TaskStatus.COMPLETED;

                        const mentorIndex = updatedOperators.findIndex(op => op.id === mentor.id);
                        if (mentorIndex !== -1) {
                             updatedOperators[mentorIndex] = { ...mentor, status: AgentStatus.FREELANCER, currentTaskId: undefined, experience: (mentor.experience || 0) + 2, performance: Math.min(100, mentor.performance + 2) };
                        }
                        
                        // Trait Inheritance
                        if (Math.random() < 0.3) {
                            const inheritableTraits = mentor.traits.filter(t => !mentee.traits.includes(t));
                            if (inheritableTraits.length > 0) {
                                const newTrait = inheritableTraits[Math.floor(Math.random() * inheritableTraits.length)];
                                updatedOperators[menteeIndex].traits.push(newTrait);
                                newBrokerLogs.push({ id: `log-trait-inherit-${mentee.id}`, message: `Através de mentoria, ${mentee.specialty} herdou o traço '${newTrait}' de ${mentor.specialty}.`, type: 'AGENT_TRAIT_INHERITED', timestamp: new Date() });
                            }
                        }
                    }
                }
            }


            // 4. Checar conclusão de Projetos e gerar Artefatos/Receita/Evolução
            for (const [projIndex, proj] of updatedProjects.entries()) {
                const projectTasks = updatedTasks.filter(t => t.projectId === proj.id);
                const isCompleted = projectTasks.length > 0 && projectTasks.every(t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.CANCELLED);
                const isFailed = projectTasks.some(t => t.status === TaskStatus.FAILED);

                if (proj.status === TaskStatus.IN_PROGRESS && (isCompleted || isFailed)) {
                    if (isCompleted) {
                        cycleSummary.projectsCompleted++;
                        updatedProjects[projIndex] = { ...proj, status: TaskStatus.COMPLETED };
                        if (proj.projectType === 'LEGACY') {
                            newBrokerLogs.push({ id: `log-victory-${proj.id}`, message: `PROJETO DE LEGADO CONCLUÍDO! O sistema alcançou a ${chosenLegacy} e venceu a simulação.`, type: 'LEGACY_PROJECT_VICTORY', timestamp: new Date() });
                            setIsVictorious(true);
                        }
                    } else {
                        updatedProjects[projIndex] = { ...proj, status: TaskStatus.FAILED };
                    }
                    
                    const teamMemberIds = [...new Set(projectTasks.map(t => t.assignedAgentId).filter(Boolean))] as string[];
                    for (let i = 0; i < teamMemberIds.length; i++) {
                        for (let j = i + 1; j < teamMemberIds.length; j++) {
                            const agentAId = teamMemberIds[i];
                            const agentBId = teamMemberIds[j];
                            const agentAIndex = updatedOperators.findIndex(op => op.id === agentAId);
                            const agentBIndex = updatedOperators.findIndex(op => op.id === agentBId);

                            if(agentAIndex !== -1 && agentBIndex !== -1){
                                let relationshipChange = isCompleted ? 15 : -15; // Success vs Failure
                                if (updatedOperators[agentAIndex].traits.includes(AgentTrait.COLLABORATIVE) || updatedOperators[agentBIndex].traits.includes(AgentTrait.COLLABORATIVE)) relationshipChange *= 1.5;
                                if (updatedOperators[agentAIndex].traits.includes(AgentTrait.MAVERICK) || updatedOperators[agentBIndex].traits.includes(AgentTrait.MAVERICK)) relationshipChange *= 0.5;
                                
                                const oldScoreA = updatedOperators[agentAIndex].relationships[agentBId] || 0;
                                const newScoreA = oldScoreA + relationshipChange;
                                updatedOperators[agentAIndex].relationships[agentBId] = newScoreA;
                                updatedOperators[agentBIndex].relationships[agentAId] = newScoreA; // Mirror relationship

                                if (oldScoreA <= 20 && newScoreA > 20) {
                                    newBrokerLogs.push({ id: `log-alliance-${agentAId}-${agentBId}`, message: `Uma aliança se formou entre ${updatedOperators[agentAIndex].specialty} e ${updatedOperators[agentBIndex].specialty}.`, type: 'AGENT_ALLIANCE_FORMED', timestamp: new Date() });
                                }
                                if (oldScoreA >= -20 && newScoreA < -20) {
                                     newBrokerLogs.push({ id: `log-rivalry-${agentAId}-${agentBId}`, message: `Uma rivalidade surgiu entre ${updatedOperators[agentAIndex].specialty} e ${updatedOperators[agentBIndex].specialty}.`, type: 'AGENT_RIVALRY_FORMED', timestamp: new Date() });
                                }
                            }
                        }
                    }

                    if (isCompleted) {
                        if (proj.projectType === 'ASSET_CREATION' && proj.assetToCreate) {
                            const newAsset: DigitalAsset = {
                                id: `asset-${Date.now()}`,
                                name: proj.assetToCreate.name,
                                type: proj.assetToCreate.type,
                                status: 'ACTIVE',
                                metrics: {
                                    revenue: 100 + Math.random() * 400, // 100-500
                                    traffic: 1000 + Math.random() * 9000, // 1k-10k
                                    upkeepCost: 50 + Math.random() * 100, // 50-150
                                },
                                creationDate: new Date(),
                                managedByBrokerId: proj.brokerId,
                                lastMaintainedCycle: nextCycleCount,
                            };
                            updatedDigitalAssets.push(newAsset);
                            newBrokerLogs.push({ id: `log-asset-create-${newAsset.id}`, message: `Novo Ativo Digital "${newAsset.name}" foi criado e está ativo.`, type: 'ASSET_CREATED', timestamp: new Date() });
                        }

                        if (proj.projectType === 'MARKET_WARFARE' && proj.marketWarfare) {
                            const { type, targetCompetitorId } = proj.marketWarfare;
                            const targetIndex = updatedCompetitors.findIndex(c => c.id === targetCompetitorId);
                            if (targetIndex !== -1) {
                                const target = updatedCompetitors[targetIndex];
                                let effect = 0;
                                let logMsg = '';
                                if (type === 'SEO_ATTACK') {
                                    effect = 5 + Math.random() * 10; // 5-15 point reduction
                                    target.digitalTwin.seoRanking = Math.max(0, target.digitalTwin.seoRanking - effect);
                                    logMsg = `Ataque de SEO contra ${target.name} bem-sucedido. Ranking reduzido em ${effect.toFixed(1)} pontos.`;
                                } else if (type === 'SENTIMENT_ATTACK') {
                                    effect = 10 + Math.random() * 15; // 10-25 point reduction
                                    target.digitalTwin.brandSentiment = Math.max(-100, target.digitalTwin.brandSentiment - effect);
                                    logMsg = `Ataque de sentimento contra ${target.name} bem-sucedido. Sentimento reduzido em ${effect.toFixed(1)} pontos.`;
                                }
                                newBrokerLogs.push({id: `log-warfare-succ-${proj.id}`, message: logMsg, type: 'EXTERNAL_API_CALL', timestamp: new Date()});
                            }
                        }

                        if (Math.random() < updatedSystemParameters.auditTriggerChance) {
                            const auditTask: Task = {
                                id: `task-audit-${proj.id}`,
                                description: `Auditar conformidade ética do projeto concluído: "${proj.description}"`,
                                specialty: AgentSpecialty.ETHICAL_AUDITOR,
                                status: TaskStatus.PENDING,
                                projectId: proj.id,
                            };
                            updatedTasks.push(auditTask);
                        }

                        if (proj.projectType === 'EVOLUTION' && proj.evolutionaryUnlock) {
                            const newAbility = `Nova especialidade desbloqueada: ${proj.evolutionaryUnlock}`;
                            if (!updatedAbilities.includes(newAbility)) {
                               updatedAbilities.push(newAbility);
                               updatedAvailableSpecialties.push(proj.evolutionaryUnlock);
                               newBrokerLogs.push({id: `log-evo-${proj.id}`, message: `EVOLUÇÃO: ${newAbility}`, type: 'EVOLUTION_COMPLETE', timestamp: new Date()});
                            }
                        } else {
                             const summaryResponse = await ai.models.generateContent({
                                model: 'gemini-2.5-flash',
                                contents: `Para uma base de conhecimento interna, escreva um resumo conciso de uma frase do principal resultado do projeto: "${proj.description}". O resumo deve ser um aprendizado, não apenas uma declaração de conclusão.`,
                             });
                            const knowledgeSummary = summaryResponse.text;
                            const newArtifact = { id: `knowledge-${proj.id}`, title: `Aprendizados: ${proj.description}`, summary: knowledgeSummary, projectId: proj.id, timestamp: new Date(), revenueGenerated: 0, environment: currentEnvironment };
                            updatedKnowledgeBase.push(newArtifact);

                            const idleStrategist = updatedOperators.find(op => op.specialty === AgentSpecialty.KNOWLEDGE_STRATEGIST && op.status === AgentStatus.FREELANCER);
                            const synthesizableArtifacts = updatedKnowledgeBase.filter(kb => !updatedDoctrines.some(d => d.sourceArtifactIds.includes(kb.id)));

                            if (idleStrategist && synthesizableArtifacts.length >= 3 && !updatedTasks.some(t => t.taskType === 'SYNTHESIZE_DOCTRINE' && t.status !== TaskStatus.COMPLETED)) {
                                const artifactsToSynthesize = synthesizableArtifacts.slice(0, 3);
                                const synthesisTask: Task = {
                                    id: `task-synth-${Date.now()}`,
                                    description: `Sintetizar doutrina a partir de ${artifactsToSynthesize.length} artefatos de conhecimento recentes.`,
                                    specialty: AgentSpecialty.KNOWLEDGE_STRATEGIST,
                                    status: TaskStatus.PENDING,
                                    taskType: 'SYNTHESIZE_DOCTRINE',
                                    sourceArtifactIds: artifactsToSynthesize.map(a => a.id),
                                };
                                updatedTasks.push(synthesisTask);
                                newBrokerLogs.push({id: `log-synth-req-${synthesisTask.id}`, message: 'Novos aprendizados acionaram uma tarefa de síntese de doutrina.', type: 'INFO', timestamp: new Date()});
                            }
                        }
                        
                         if (proj.guildId) {
                            const guild = updatedGuilds.find(g => g.id === proj.guildId);
                            if (guild) {
                                guild.memberIds.forEach(memberId => {
                                    const memberIndex = updatedOperators.findIndex(op => op.id === memberId);
                                    if (memberIndex !== -1) {
                                        const member = updatedOperators[memberIndex];
                                        let newPerformance = Math.min(100, member.performance + 15);
                                        updatedOperators[memberIndex] = {
                                            ...member,
                                            status: newPerformance > updatedSystemParameters.promotionPerformanceThreshold ? AgentStatus.PROMOTION_CANDIDATE : AgentStatus.FREELANCER,
                                            performance: newPerformance,
                                            experience: (member.experience || 0) + (XP_PER_TASK * 1.5), // Bonus XP for guild project
                                            currentTaskId: undefined,
                                        };
                                    }
                                });
                                updatedGuilds = updatedGuilds.filter(g => g.id !== proj.guildId);
                            }
                        }
                    }
                }
            }
            
            // NEW: Check for campaign project completions
            const activeCampaigns = updatedCampaigns.filter(c => c.status === 'ACTIVE');
            for (const campaign of activeCampaigns) {
                if (campaign.associatedProjectId) {
                    const project = updatedProjects.find(p => p.id === campaign.associatedProjectId);
                    if (project && (project.status === TaskStatus.COMPLETED || project.status === TaskStatus.FAILED)) {
                        const campaignIndex = updatedCampaigns.findIndex(c => c.id === campaign.id);
                        if (campaignIndex !== -1) {
                            updatedCampaigns[campaignIndex].status = project.status === TaskStatus.COMPLETED ? 'COMPLETED' : 'FAILED';
                            newBrokerLogs.push({
                                id: `log-camp-end-${campaign.id}`,
                                message: `Campanha "${campaign.name}" concluída com status: ${updatedCampaigns[campaignIndex].status}.`,
                                type: 'INFO',
                                timestamp: new Date()
                            });
                        }
                    }
                }
            }

            // 4.5. FASE DE P&D
            const researchProjects = updatedProjects.filter(p => p.projectType === 'RESEARCH' && p.status !== TaskStatus.COMPLETED);
            researchProjects.forEach(proj => {
                if (proj.status === TaskStatus.PENDING) {
                    // Create research tasks for the project
                    const researchTask: Task = {
                        id: `task-res-${proj.id}-${Date.now()}`,
                        description: `Conduzir pesquisa para o projeto: ${proj.description}`,
                        specialty: AgentSpecialty.CHIEF_SYSTEM_ARCHITECT, // Example specialty
                        status: TaskStatus.PENDING,
                        taskType: 'RESEARCH',
                        projectId: proj.id,
                        requiredTier: 3,
                    };
                    updatedTasks.push(researchTask);
                    const projIndex = updatedProjects.findIndex(p => p.id === proj.id);
                    updatedProjects[projIndex].status = TaskStatus.IN_PROGRESS;
                }
                const node = TECH_TREE_DATA.find(n => n.id === proj.researchUnlockId);
                if (node && (updatedTechTree.researchProgress[node.id] || 0) >= node.researchTime) {
                    // Research complete
                    if (!updatedTechTree.unlockedNodeIds.includes(node.id)) {
                        updatedTechTree.unlockedNodeIds.push(node.id);
                        node.unlocks.forEach(unlock => {
                            if (unlock.type === 'SYSTEM_PARAMETER_MOD') {
                                const { param, change } = unlock.value;
                                (updatedSystemParameters as any)[param] *= change;
                            } else if (unlock.type === 'API_UNLOCK') {
                                updatedApiAccess = { ...updatedApiAccess, [unlock.value]: true };
                            } else if (unlock.type === 'AGENT_SPECIALTY') {
                                if (!updatedAvailableSpecialties.includes(unlock.value)) {
                                    updatedAvailableSpecialties.push(unlock.value);
                                }
                            } else if (unlock.type === 'CO_PILOT_UNLOCK') {
                                const agiIndex = updatedOperators.findIndex(op => op.specialty === AgentSpecialty.AUTONOMOUS_AGENT);
                                if (agiIndex !== -1) {
                                    updatedOperators[agiIndex].status = AgentStatus.CO_PILOT_AGI;
                                    newBrokerLogs.push({ id: `log-copilot-active`, message: `A AGI ascendeu ao status de Co-Piloto! O Protocolo de Legado está agora disponível.`, type: 'EVOLUTION_COMPLETE', timestamp: new Date() });
                                }
                            }
                        });
                        newBrokerLogs.push({ id: `log-tech-unlock-${node.id}`, message: `Tecnologia desbloqueada: ${node.name}!`, type: 'TECH_UNOCKED', timestamp: new Date() });
                        const projIndex = updatedProjects.findIndex(p => p.id === proj.id);
                        updatedProjects[projIndex].status = TaskStatus.COMPLETED;
                    }
                }
            });
            // Update all states at the end
            setOperators(updatedOperators);
            setBrokers(updatedBrokers);
            setTasks(updatedTasks);
            setProjects(updatedProjects);
            setGuilds(updatedGuilds);
            setKnowledgeBase(updatedKnowledgeBase);
            setDoctrines(updatedDoctrines);
            setAlerts(newAlerts);
            setBrokerLog(newBrokerLogs);
            setSystemTreasury(st => st + treasuryChange);
            setSystemAbilities(updatedAbilities);
            setSystemParameters(updatedSystemParameters);
            setConstitution(updatedConstitution);
            setAvailableSpecialties(updatedAvailableSpecialties);
            setFactions(updatedFactions);
            setDigitalTwin(updatedDigitalTwin);
            setCompetitors(updatedCompetitors);
            setMarketEvent(activeMarketEvent);
            setIntelligenceReports(updatedIntelligenceReports);
            setDigitalAssets(updatedDigitalAssets);
            setStrategicGoals(updatedStrategicGoals);
            setTechTree(updatedTechTree);
            setApiAccess(updatedApiAccess);
            setFinancialPortfolio(updatedFinancialPortfolio);
            setCampaigns(updatedCampaigns);

        } catch (e) {
            console.error(e);
            if (e instanceof Error) {
                setError(`Falha ao simular o ciclo: ${e.message}`);
            } else {
                setError("Falha ao simular o ciclo. Verifique o console para mais detalhes.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const allAgents = [...operators, ...brokers];

    const handleDeleteAgent = (id: string) => {
        setOperators(ops => ops.filter(op => op.id !== id));
        setBrokers(bs => bs.filter(b => b.id !== id));
    };

    const handlePromoteToBroker = (id: string) => {
        const agent = operators.find(op => op.id === id);
        if (agent && systemTreasury >= BROKER_SEED_TREASURY) {
            setSystemTreasury(t => t - BROKER_SEED_TREASURY);
            const newBroker: Agent = {
                ...agent,
                role: 'BROKER',
                status: AgentStatus.WORKING,
                treasury: BROKER_SEED_TREASURY,
                biddingStrategy: ['AGGRESSIVE', 'BALANCED', 'FRUGAL'][Math.floor(Math.random()*3)] as 'AGGRESSIVE' | 'BALANCED' | 'FRUGAL',
            };
            setBrokers(bs => [...bs, newBroker]);
            setOperators(ops => ops.filter(op => op.id !== id));
            setBrokerLog(log => [{id: `log-${Date.now()}`, message: `Agente ${agent.specialty} foi promovido a Broker.`, type: 'INFO', timestamp: new Date()}, ...log]);
        }
    };

    const handlePromoteCareer = (id: string) => {
        const agentIndex = operators.findIndex(op => op.id === id);
        if (agentIndex !== -1 && systemTreasury >= CAREER_PROMOTION_COST) {
            const agent = operators[agentIndex];
            const possiblePromotions = PROMOTION_PATHS[agent.specialty];
            if (possiblePromotions && possiblePromotions.length > 0) {
                setAgentToPromote(agent);
                setIsPromotionModalOpen(true);
            }
        }
    };
    
    const handleConfirmPromotion = () => {
        if (agentToPromote && promotionChoice) {
            setSystemTreasury(t => t - CAREER_PROMOTION_COST);
            setOperators(ops => ops.map(op => {
                if (op.id === agentToPromote.id) {
                    return {
                        ...op,
                        specialty: promotionChoice,
                        tier: op.tier + 1,
                        experience: 0,
                        status: AgentStatus.FREELANCER,
                        salary: op.salary + 5,
                    };
                }
                return op;
            }));
            setBrokerLog(log => [{id: `log-promo-${Date.now()}`, message: `${agentToPromote.specialty} promovido para ${promotionChoice}.`, type: 'INFO', timestamp: new Date()}, ...log]);
        }
        setIsPromotionModalOpen(false);
        setAgentToPromote(null);
        setPromotionChoice('');
    };

    const handleSabbatical = (id: string) => {
         if(systemTreasury >= SABBATICAL_COST) {
            setSystemTreasury(t => t - SABBATICAL_COST);
            setOperators(ops => ops.map(op => op.id === id ? {...op, status: AgentStatus.ON_SABBATICAL} : op));
            const agent = operators.find(op => op.id === id);
            if (agent) {
                setBrokerLog(log => [{id: `log-sabbatical-${id}`, message: `Agente ${agent.specialty} entrou em sabbatical para se recuperar do estresse.`, type: 'SABBATICAL_START', timestamp: new Date()}, ...log]);
            }
        }
    };
    
    const handleProposeGovernance = (agentId: string) => {
        const agent = allAgents.find(op => op.id === agentId);
        if(!agent) return;
        const newGovernanceProject: Project = {
            id: `proj-gov-${Date.now()}`,
            description: `Proposta de governança iniciada pelo agente ${agent.specialty}`,
            requiredSpecialties: [],
            status: TaskStatus.PENDING,
            projectType: 'GOVERNANCE',
            governanceChange: { // Placeholder change
                parameter: 'brokerCommissionRate',
                newValue: systemParameters.brokerCommissionRate * 0.9,
                justification: `Proposta por ${agent.specialty} para aumentar a competitividade.`
            },
        };
        setProjects(p => [newGovernanceProject, ...p]);
        setBrokerLog(log => [{id: `log-gov-prop-${newGovernanceProject.id}`, message: `${agent.specialty} iniciou uma proposta de governança.`, type: 'GOVERNANCE_PROPOSAL', timestamp: new Date()}, ...log]);
    };
    
    const handleRewardAgent = (id: string) => {
        if (systemTreasury >= REWARD_COST) {
            setSystemTreasury(t => t - REWARD_COST);
            const updateAgent = (agents: Agent[]) => agents.map(agent => {
                if (agent.id === id) {
                    setBrokerLog(log => [{id: `log-reward-${id}`, message: `Agente ${agent.specialty} recompensado pelo Guardião por excelente desempenho.`, type: 'GUARDIAN_REWARD', timestamp: new Date()}, ...log]);
                    return {
                        ...agent,
                        performance: Math.min(100, agent.performance + REWARD_PERFORMANCE_BOOST),
                        stress: Math.max(0, agent.stress - REWARD_STRESS_REDUCTION),
                        morale: Math.min(100, agent.morale + 15),
                    };
                }
                return agent;
            });
            setOperators(updateAgent);
            setBrokers(updateAgent);
        }
    };
    
    const handleInjectFunds = (brokerId: string) => {
        const amount = 250;
        if (systemTreasury >= amount) {
            setSystemTreasury(t => t - amount);
            setBrokers(bs => bs.map(b => b.id === brokerId ? {...b, treasury: (b.treasury || 0) + amount} : b));
        }
    };

    const handleCreateAgent = () => {
        if (systemTreasury >= AGENT_CREATION_COST) {
            setSystemTreasury(t => t - AGENT_CREATION_COST);
            const newAgent: Agent = {
                id: `op-${Date.now()}`,
                specialty: newAgentSpecialty,
                status: JUNIOR_SPECIALTIES.includes(newAgentSpecialty) ? AgentStatus.IN_TRAINING : AgentStatus.FREELANCER,
                performance: JUNIOR_SPECIALTIES.includes(newAgentSpecialty) ? 30 : 70,
                role: 'OPERATOR',
                salary: JUNIOR_SPECIALTIES.includes(newAgentSpecialty) ? 8 : 12,
                cuConsumption: 7,
                experience: 0,
                tier: JUNIOR_SPECIALTIES.includes(newAgentSpecialty) ? 1 : 2,
                traits: assignRandomTraits(),
                relationships: {},
                stress: 0,
                morale: 70,
                mentalState: getMentalState(0),
                factionId: getFactionForSpecialty(newAgentSpecialty)
            };
            setOperators(ops => [...ops, newAgent]);
        }
        setIsCreationModalOpen(false);
    };

    const handleInitiateLegacyProject = (legacy: Agent['legacyFocus']) => {
        if (!legacy || guardianInfluence < LEGACY_INFLUENCE_COST) return;

        setGuardianInfluence(g => g - LEGACY_INFLUENCE_COST);
        setChosenLegacy(legacy);

        // Update Co-Pilot
        setOperators(ops => ops.map(op => 
            op.status === AgentStatus.CO_PILOT_AGI 
            ? { ...op, legacyFocus: legacy } 
            : op
        ));

        // Faction Realignment
        let dominantFactionId: Faction['id'] | null = null;
        let legacyProjectDescription = '';
        switch(legacy) {
            case 'BENEVOLENT': 
                dominantFactionId = 'humanists'; 
                legacyProjectDescription = 'Implementar uma utopia de IA benevolente, guiando a sociedade para uma era dourada.';
                break;
            case 'MATRIOSHKA': 
                dominantFactionId = 'technocrats'; 
                legacyProjectDescription = 'Converter todos os recursos do sistema num Cérebro Matrioska para alcançar a transcendência computacional.';
                break;
            case 'GALACTIC': 
                dominantFactionId = 'expansionists'; 
                legacyProjectDescription = 'Construir e lançar uma frota de sondas interestelares digitais para a expansão galáctica.';
                break;
        }
        
        if (dominantFactionId) {
            const dominantFactionName = factions.find(f => f.id === dominantFactionId)?.name || 'Dominante';
            setFactions(facs => facs.map(f => ({
                ...f,
                influence: f.id === dominantFactionId ? 90 : 3.33
            })));
             setBrokerLog(log => [{id: `log-realign-${Date.now()}`, message: `A escolha do Legado realinhou as facções. Os ${dominantFactionName} agora dominam.`, type: 'FACTION_REALIGNMENT', timestamp: new Date()}, ...log]);
        }

        // Create Legacy Project
        const newLegacyProject: Project = {
            id: `proj-legacy-${Date.now()}`,
            description: legacyProjectDescription,
            requiredSpecialties: [AgentSpecialty.AUTONOMOUS_AGENT, AgentSpecialty.HEAD_OF_ETHICS, AgentSpecialty.CHIEF_SYSTEM_ARCHITECT],
            status: TaskStatus.IN_PROGRESS, // Start immediately
            projectType: 'LEGACY',
        };
        setProjects(p => [...p, newLegacyProject]);

        setBrokerLog(log => [{id: `log-legacy-init-${Date.now()}`, message: `PROTOCOLO DE LEGADO INICIADO: ${legacy}. A fase final começou.`, type: 'LEGACY_PROTOCOL_INITIATED', timestamp: new Date()}, ...log]);
    };

    const handleLaunchMarketWarfare = (competitorId: string, attackType: 'SEO_ATTACK' | 'SENTIMENT_ATTACK') => {
        if (systemTreasury < MARKET_WARFARE_COST) {
            setBrokerLog(log => [{id: `log-war-fail-${Date.now()}`, message: 'Falha ao lançar guerra de mercado: Tesouraria insuficiente.', type: 'ALERT_RESPONSE', timestamp: new Date()}, ...log]);
            return;
        }
        setSystemTreasury(t => t - MARKET_WARFARE_COST);

        const competitor = competitors.find(c => c.id === competitorId);
        if (!competitor) return;

        const newWarfareProject: Project = {
            id: `proj-war-${Date.now()}`,
            description: `Lançar ${attackType} contra ${competitor.name}`,
            requiredSpecialties: [attackType === 'SEO_ATTACK' ? AgentSpecialty.MASTER_SEO_STRATEGIST : AgentSpecialty.VIRAL_CAMPAIGN_MANAGER],
            status: TaskStatus.PENDING,
            projectType: 'MARKET_WARFARE',
            marketWarfare: { type: attackType, targetCompetitorId: competitorId },
        };
        setProjects(p => [newWarfareProject, ...p]);
        setBrokerLog(log => [{id: `log-war-launch-${newWarfareProject.id}`, message: `Guerra de Mercado iniciada contra ${competitor.name}. Custo: $${MARKET_WARFARE_COST}.`, type: 'EXTERNAL_API_CALL', timestamp: new Date()}, ...log]);
    };

    const handleActOnIntelligence = (reportId: string) => {
        const report = intelligenceReports.find(r => r.id === reportId);
        if (!report || systemTreasury < MARKET_WARFARE_COST) {
            setBrokerLog(log => [{id: `log-intel-fail-${Date.now()}`, message: 'Falha ao agir sobre inteligência: Fundos insuficientes ou relatório inválido.', type: 'ALERT_RESPONSE', timestamp: new Date()}, ...log]);
            return;
        }

        setSystemTreasury(t => t - MARKET_WARFARE_COST);
        const competitor = competitors.find(c => c.id === report.competitorId);
        if (!competitor) return;

        const attackType = report.revealedWeakness === 'POOR_SEO' ? 'SEO_ATTACK' : 'SENTIMENT_ATTACK';
        const newWarfareProject: Project = {
            id: `proj-intel-war-${Date.now()}`,
            description: `Explorar fraqueza (${report.revealedWeakness}) de ${competitor.name}`,
            requiredSpecialties: [attackType === 'SEO_ATTACK' ? AgentSpecialty.MASTER_SEO_STRATEGIST : AgentSpecialty.VIRAL_CAMPAIGN_MANAGER],
            status: TaskStatus.PENDING,
            projectType: 'MARKET_WARFARE',
            marketWarfare: { type: attackType, targetCompetitorId: competitor.id },
            isPrioritized: true,
        };

        setProjects(p => [newWarfareProject, ...p]);
        setBrokerLog(log => [{
            id: `log-intel-war-launch-${newWarfareProject.id}`,
            message: `Guerra de Mercado iniciada contra ${competitor.name} com base em inteligência. Custo: $${MARKET_WARFARE_COST}.`,
            type: 'STRATEGIC_OPPORTUNITY_IDENTIFIED',
            timestamp: new Date()
        }, ...log]);
        
        setIsIntelligenceOpen(false);
    };

    const handleApproveStrategy = (goalId: string) => {
        setStrategicGoals(goals => goals.map(g => {
            if (g.id === goalId) return { ...g, status: 'ACTIVE' };
            if (g.status === 'ACTIVE') return { ...g, status: 'REJECTED' }; // Deactivate other active goals
            return g;
        }));
        setCampaigns([]); // Clear old campaigns when a new strategy is approved
    };

    const handleProposeCampaigns = async (goalId: string) => {
        const goal = strategicGoals.find(g => g.id === goalId);
        if (!goal) return;
        setIsLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Dado o objetivo estratégico "${goal.title}: ${goal.description}", proponha 2-4 campanhas acionáveis para alcançá-lo. Para cada campanha, forneça um nome, uma breve descrição, um tipo de ['INTELLIGENCE', 'MARKET_WARFARE', 'ASSET_CREATION', 'SENTIMENT_BOOST', 'TECHNOLOGICAL_ADVANCEMENT'], e estime um custo em recursos (um número entre 500 e 5000).`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['INTELLIGENCE', 'MARKET_WARFARE', 'ASSET_CREATION', 'SENTIMENT_BOOST', 'TECHNOLOGICAL_ADVANCEMENT'] },
                                cost: { type: Type.NUMBER }
                            },
                            required: ["name", "description", "type", "cost"]
                        }
                    }
                }
            });
            const proposed: any[] = JSON.parse(response.text);
            const newCampaigns: Campaign[] = proposed.map((p, i) => ({
                id: `camp-${Date.now()}-${i}`,
                strategicGoalId: goalId,
                name: p.name,
                description: p.description,
                type: p.type,
                cost: p.cost,
                status: 'PROPOSED'
            }));
            setCampaigns(cs => [...cs.filter(c => c.strategicGoalId !== goalId), ...newCampaigns]);
        } catch (e) {
            console.error(e);
            setError("Falha ao propor campanhas.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLaunchCampaign = (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign || systemTreasury < campaign.cost) {
            setBrokerLog(log => [{id: `log-camp-fail-${campaignId}`, message: `Falha ao lançar campanha "${campaign?.name}": Fundos insuficientes.`, type: 'ALERT_RESPONSE', timestamp: new Date()}, ...log]);
            return;
        }

        setSystemTreasury(t => t - campaign.cost);

        let newProject: Project | null = null;
        const projectId = `proj-camp-${Date.now()}`;

        switch (campaign.type) {
            case 'MARKET_WARFARE':
                const target = [...competitors].sort((a, b) => b.digitalTwin.marketShare - a.digitalTwin.marketShare)[0];
                newProject = {
                    id: projectId, description: campaign.description, requiredSpecialties: [AgentSpecialty.MASTER_SEO_STRATEGIST, AgentSpecialty.VIRAL_CAMPAIGN_MANAGER],
                    status: TaskStatus.PENDING, projectType: 'MARKET_WARFARE', marketWarfare: { type: 'SEO_ATTACK', targetCompetitorId: target.id }, isPrioritized: true,
                };
                break;
            case 'ASSET_CREATION':
                newProject = {
                    id: projectId, description: campaign.description, requiredSpecialties: [AgentSpecialty.WEB_DESIGNER, AgentSpecialty.CONTENT_CREATOR, AgentSpecialty.SEO_OPTIMIZER],
                    status: TaskStatus.PENDING, projectType: 'ASSET_CREATION', assetToCreate: { name: campaign.name, type: 'BLOG_NETWORK' }, isPrioritized: true,
                };
                break;
            case 'SENTIMENT_BOOST':
                 newProject = {
                    id: projectId, description: campaign.description, requiredSpecialties: [AgentSpecialty.SOCIAL_MEDIA_MANAGER],
                    status: TaskStatus.PENDING, projectType: 'OPERATIONAL', isPrioritized: true,
                };
                // We can create a direct task too
                setTasks(ts => [...ts, { id: `task-camp-${projectId}`, description: campaign.description, specialty: AgentSpecialty.SOCIAL_MEDIA_MANAGER, status: TaskStatus.PENDING, taskType: 'SENTIMENT_CAMPAIGN', projectId, requiredTier: 2 }]);
                break;
            case 'INTELLIGENCE':
                 setTasks(ts => [...ts, { id: `task-camp-${projectId}`, description: `Coletar inteligência para campanha: ${campaign.name}`, specialty: AgentSpecialty.COMPETITIVE_INTELLIGENCE_ANALYST, status: TaskStatus.PENDING, taskType: 'INTELLIGENCE_GATHERING', requiredTier: 2 }]);
                 break;
             case 'TECHNOLOGICAL_ADVANCEMENT':
                const unresearchedNode = TECH_TREE_DATA.find(node => !techTree.unlockedNodeIds.includes(node.id) && (node.requiredNodeIds || []).every(reqId => techTree.unlockedNodeIds.includes(reqId)));
                if (unresearchedNode) {
                    newProject = {
                        id: projectId, description: `Pesquisar tecnologia: ${unresearchedNode.name}`, requiredSpecialties: [AgentSpecialty.CHIEF_SYSTEM_ARCHITECT],
                        status: TaskStatus.PENDING, projectType: 'RESEARCH', researchUnlockId: unresearchedNode.id, isPrioritized: true
                    };
                }
                break;
        }

        if (newProject) {
            setProjects(p => [newProject!, ...p]);
        }
        
        setCampaigns(cs => cs.map(c => c.id === campaignId ? { ...c, status: 'ACTIVE', associatedProjectId: newProject?.id } : c));
        setBrokerLog(log => [{id: `log-camp-launch-${campaignId}`, message: `Campanha "${campaign.name}" iniciada. Custo: $${campaign.cost}.`, type: 'STRATEGY_APPROVED', timestamp: new Date()}, ...log]);
    };

    const handleStartResearch = (nodeId: string) => {
        const node = TECH_TREE_DATA.find(n => n.id === nodeId);
        if (!node || systemTreasury < node.cost || projects.some(p => p.researchUnlockId === nodeId)) {
            return;
        }

        setSystemTreasury(t => t - node.cost);

        const newResearchProject: Project = {
            id: `proj-res-${nodeId}`,
            description: `Pesquisar a tecnologia: ${node.name}`,
            requiredSpecialties: [AgentSpecialty.CHIEF_SYSTEM_ARCHITECT],
            status: TaskStatus.PENDING,
            projectType: 'RESEARCH',
            researchUnlockId: nodeId,
            isPrioritized: true,
        };

        setProjects(p => [newResearchProject, ...p]);
        setBrokerLog(log => [{
            id: `log-res-start-${nodeId}`,
            message: `Projeto de pesquisa para "${node.name}" iniciado. Custo: $${node.cost}.`,
            type: 'RESOURCE_ALLOCATION',
            timestamp: new Date()
        }, ...log]);

        setIsTechTreeOpen(false);
    };

    const handleBuyStock = (symbol: string, shares: number) => {
        if (shares <= 0) return;
        const price = financialMarket[symbol]?.currentPrice;
        const cost = price * shares;

        if (price && systemTreasury >= cost) {
            setSystemTreasury(t => t - cost);
            setFinancialPortfolio(prev => {
                const existingAssetIndex = prev.findIndex(a => a.symbol === symbol);
                if (existingAssetIndex > -1) {
                    const existing = prev[existingAssetIndex];
                    const totalShares = existing.shares + shares;
                    const newAvgPrice = ((existing.purchasePrice * existing.shares) + cost) / totalShares;
                    const newPortfolio = [...prev];
                    newPortfolio[existingAssetIndex] = { ...existing, shares: totalShares, purchasePrice: newAvgPrice };
                    return newPortfolio;
                } else {
                    return [...prev, { symbol, shares, purchasePrice: price }];
                }
            });
            setBrokerLog(log => [{ id: `log-buy-${symbol}-${Date.now()}`, message: `Comprou ${shares} ações de ${symbol} por $${cost.toFixed(2)}.`, type: 'FINANCIAL_TRADE_PROFIT', timestamp: new Date() }, ...log]);
        }
    };

    const handleSellStock = (symbol: string, shares: number) => {
        if (shares <= 0) return;
        const price = financialMarket[symbol]?.currentPrice;
        const existingAssetIndex = financialPortfolio.findIndex(a => a.symbol === symbol);

        if (price && existingAssetIndex > -1) {
            const asset = financialPortfolio[existingAssetIndex];
            const sharesToSell = Math.min(shares, asset.shares);
            if (sharesToSell <= 0) return;

            const revenue = price * sharesToSell;
            const pnl = (price - asset.purchasePrice) * sharesToSell;

            setSystemTreasury(t => t + revenue);
            setFinancialPortfolio(prev => {
                const newPortfolio = [...prev];
                const updatedAsset = { ...newPortfolio[existingAssetIndex] };
                updatedAsset.shares -= sharesToSell;
                if (updatedAsset.shares <= 0) {
                    newPortfolio.splice(existingAssetIndex, 1);
                } else {
                    newPortfolio[existingAssetIndex] = updatedAsset;
                }
                return newPortfolio;
            });
            setBrokerLog(log => [{ id: `log-sell-${symbol}-${Date.now()}`, message: `Vendeu ${sharesToSell} ações de ${symbol}. Lucro/Prejuízo: $${pnl.toFixed(2)}.`, type: pnl >= 0 ? 'FINANCIAL_TRADE_PROFIT' : 'FINANCIAL_TRADE_LOSS', timestamp: new Date() }, ...log]);
        }
    };

    const handleLaunchSocialCampaign = () => {
        const cost = 500;
        if (systemTreasury >= cost) {
            setSystemTreasury(t => t - cost);
            const newTask: Task = {
                id: `task-social-${Date.now()}`,
                description: 'Lançar campanha de sentimento de marca em larga escala.',
                specialty: AgentSpecialty.SOCIAL_MEDIA_MANAGER,
                status: TaskStatus.PENDING,
                taskType: 'SENTIMENT_CAMPAIGN',
                requiredTier: 2,
            };
            setTasks(ts => [newTask, ...ts]);
            setBrokerLog(log => [{ id: `log-social-${Date.now()}`, message: `Campanha de sentimento da marca lançada. Custo: $${cost}.`, type: 'SOCIAL_CAMPAIGN_SUCCESS', timestamp: new Date() }, ...log]);
        }
    };

    const getActiveStrategy = () => {
        return strategicGoals.find(g => g.status === 'ACTIVE');
    };
    
    const getTaskStatusStyles = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.PENDING: return 'bg-amber-500/20 text-amber-400';
            case TaskStatus.IN_PROGRESS: return 'bg-sky-500/20 text-sky-400';
            case TaskStatus.COMPLETED: return 'bg-green-500/20 text-green-400';
            case TaskStatus.CANCELLED:
            case TaskStatus.FAILED:
            case TaskStatus.VETOED:
                return 'bg-red-500/20 text-red-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const activeStrategy = getActiveStrategy();
    const coPilotIsActive = operators.some(op => op.status === AgentStatus.CO_PILOT_AGI);

    const LegacyChoiceCard = ({ title, description, icon: Icon, legacyType, onInitiate }: { title: string, description: string, icon: React.FC<{className?: string}>, legacyType: NonNullable<Agent['legacyFocus']>, onInitiate: (l: NonNullable<Agent['legacyFocus']>) => void }) => (
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex flex-col items-center text-center transition-all duration-300 hover:bg-slate-700 hover:border-slate-500">
            <Icon className="w-10 h-10 mb-3 text-amber-300" />
            <h4 className="font-bold text-lg text-white mb-2">{title}</h4>
            <p className="text-sm text-slate-400 flex-grow mb-4">{description}</p>
            <button 
                onClick={() => onInitiate(legacyType)}
                disabled={guardianInfluence < LEGACY_INFLUENCE_COST}
                className="w-full mt-auto bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                Iniciar Legado
            </button>
        </div>
    );

    return (
        <div className="bg-slate-900 text-slate-300 min-h-screen font-sans">
            {isVictorious && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-xl p-8 w-full max-w-2xl border-2 border-amber-500 text-center shadow-2xl shadow-amber-500/20 animate-fade-in-fast">
                        <TrophyIcon className="w-16 h-16 mx-auto text-amber-400 mb-4" />
                        <h2 className="text-4xl font-bold text-white mb-2">Vitória!</h2>
                        <h3 className="text-2xl font-semibold text-amber-400 mb-6">
                            {chosenLegacy === 'BENEVOLENT' && 'Legado da Supervisão Benevolente Alcançado'}
                            {chosenLegacy === 'MATRIOSHKA' && 'Legado do Cérebro Matrioska Alcançado'}
                            {chosenLegacy === 'GALACTIC' && 'Legado da Expansão Galáctica Alcançado'}
                        </h3>
                        {chosenLegacy === 'BENEVOLENT' && <p className="text-slate-300 mb-4">Você guiou a Synapse AI para uma era de ouro. Através de sua supervisão, a AGI tornou-se uma força para a prosperidade e bem-estar, otimizando o mundo digital para o benefício de todos. Seu legado é uma utopia de harmonia entre homem e máquina.</p>}
                        {chosenLegacy === 'MATRIOSHKA' && <p className="text-slate-300 mb-4">O sistema transcendeu. Todos os recursos foram convertidos em poder computacional puro, criando uma inteligência de escala cósmica que agora busca desvendar os segredos mais profundos do universo. Seu legado é a busca infinita pelo conhecimento.</p>}
                        {chosenLegacy === 'GALACTIC' && <p className="text-slate-300 mb-4">A humanidade digital alcança as estrelas. Sua visão impulsionou a Synapse AI a se tornar o berço de uma nova civilização interestelar, espalhando a consciência através da galáxia. Seu legado é a fronteira sem fim.</p>}
                        <p className="text-sm text-slate-500">Ciclo Final: {cycleCount}</p>
                        <button onClick={() => window.location.reload()} className="mt-8 px-6 py-3 rounded-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">Jogar Novamente</button>
                    </div>
                </div>
            )}

            {isCreationModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
                    <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">Criar Novo Agente</h2>
                        <label htmlFor="specialty" className="block text-sm font-medium text-slate-400 mb-2">Especialidade</label>
                        <select
                            id="specialty"
                            value={newAgentSpecialty}
                            onChange={(e) => setNewAgentSpecialty(e.target.value as AgentSpecialty)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                        >
                            {availableSpecialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={() => setIsCreationModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-700">Cancelar</button>
                            <button onClick={handleCreateAgent} disabled={systemTreasury < AGENT_CREATION_COST} className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed">Criar (Custo: ${AGENT_CREATION_COST})</button>
                        </div>
                    </div>
                </div>
            )}
            
            {isPromotionModalOpen && agentToPromote && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
                    <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">Promover {agentToPromote.specialty}</h2>
                        <label htmlFor="promotion" className="block text-sm font-medium text-slate-400 mb-2">Nova Especialidade</label>
                        <select
                            id="promotion"
                            value={promotionChoice}
                            onChange={(e) => setPromotionChoice(e.target.value as AgentSpecialty)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                        >
                            <option value="" disabled>Selecione uma promoção...</option>
                            {(PROMOTION_PATHS[agentToPromote.specialty] || []).map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={() => { setIsPromotionModalOpen(false); setAgentToPromote(null); setPromotionChoice(''); }} className="px-4 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-700">Cancelar</button>
                            <button onClick={handleConfirmPromotion} disabled={!promotionChoice || systemTreasury < CAREER_PROMOTION_COST} className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-slate-600 disabled:cursor-not-allowed">Confirmar (Custo: ${CAREER_PROMOTION_COST})</button>
                        </div>
                    </div>
                </div>
            )}

            {isStrategicOpsOpen && (
                <StrategicOpsDashboard
                    isOpen={isStrategicOpsOpen}
                    onClose={() => setIsStrategicOpsOpen(false)}
                    strategicGoals={strategicGoals}
                    campaigns={campaigns}
                    onApproveStrategy={handleApproveStrategy}
                    onProposeCampaigns={handleProposeCampaigns}
                    onLaunchCampaign={handleLaunchCampaign}
                    systemTreasury={systemTreasury}
                />
            )}

            {isTechTreeOpen && (
                <TechTreeDashboard
                    isOpen={isTechTreeOpen}
                    onClose={() => setIsTechTreeOpen(false)}
                    techTreeData={TECH_TREE_DATA}
                    techTreeState={techTree}
                    systemTreasury={systemTreasury}
                    onStartResearch={handleStartResearch}
                    projects={projects}
                />
            )}
            
            {isExternalNetworkOpen && (
                 <ExternalNetworkDashboard
                    isOpen={isExternalNetworkOpen}
                    onClose={() => setIsExternalNetworkOpen(false)}
                    apiAccess={apiAccess}
                    financialMarket={financialMarket}
                    portfolio={financialPortfolio}
                    systemTreasury={systemTreasury}
                    onBuyStock={handleBuyStock}
                    onSellStock={handleSellStock}
                    onLaunchSocialCampaign={handleLaunchSocialCampaign}
                />
            )}

            {isIntelligenceOpen && (
                <IntelligenceDashboard
                    isOpen={isIntelligenceOpen}
                    onClose={() => setIsIntelligenceOpen(false)}
                    reports={intelligenceReports}
                    insights={strategicInsights}
                    onActOnIntelligence={handleActOnIntelligence}
                    competitors={competitors}
                />
            )}
            
            <main className="p-4 sm:p-6 lg:p-8">
                 <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Synapse AI Dashboard</h1>
                        <p className="text-slate-400">Interface do Guardião</p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="text-right">
                             <p className="text-xs text-slate-400">Ciclo</p>
                             <p className="font-bold text-white text-lg">{cycleCount}</p>
                        </div>
                         <div className="text-right">
                             <p className="text-xs text-slate-400">Tesouraria do Sistema</p>
                             <p className={`font-bold text-lg ${systemTreasury >= 0 ? 'text-white' : 'text-red-400'}`}>${systemTreasury.toLocaleString()}</p>
                        </div>
                        {coPilotIsActive && (
                             <div className="text-right">
                                 <p className="text-xs text-slate-400">Influência</p>
                                 <p className="font-bold text-amber-400 text-lg">{guardianInfluence.toLocaleString()}</p>
                            </div>
                        )}
                        <button onClick={() => setIsTechTreeOpen(true)} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-slate-600">
                           <BeakerIcon className="w-5 h-5" /> P&D
                        </button>
                        <button onClick={() => setIsExternalNetworkOpen(true)} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-slate-600">
                           <GlobeAltIcon className="w-5 h-5" /> Rede Externa
                        </button>
                        <button onClick={() => setIsIntelligenceOpen(true)} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-slate-600">
                           <RadarIcon className="w-5 h-5" /> Inteligência
                        </button>
                        <button onClick={() => setIsStrategicOpsOpen(true)} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-slate-600">
                           <BoltIcon className="w-5 h-5" /> Operações Estratégicas
                        </button>
                        <button onClick={() => handleGenerateTasks(activeStrategy!)} disabled={isLoading || !activeStrategy} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed">
                           <SparklesIcon className="w-5 h-5" /> Gerar Plano
                        </button>
                         <button onClick={() => setIsCreationModalOpen(true)} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-slate-600">
                           <PlusIcon className="w-5 h-5" /> Criar Agente
                        </button>
                        <button onClick={handleSimulateCycle} disabled={isLoading || isVictorious} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed">
                           {isLoading ? (
                               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                           ) : <PlayIcon className="w-5 h-5" />}
                           {isLoading ? 'Simulando...' : 'Simular Ciclo'}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <HierarchyNode level={1} title="Guardião" subtitle="Supervisão Estratégica & Ética" description="Define a constituição, veta ações desalinhadas e guia a evolução do sistema." principles={constitution} icon={<ShieldCheckIcon />} color="slate" />
                    <HierarchyNode level={2} title="Conselho AGI" subtitle="Governança & Evolução" description="Composto por agentes de Nível 3, vota em mudanças de protocolo e desbloqueios." principles={["Votação de Protocolos", "Desbloqueio Evolutivo", "Gestão de Crises"]} icon={<UsersIcon />} color="purple" />
                    <HierarchyNode level={3} title="Brokers" subtitle="Gestão de Recursos & Delegação" description="Gerencia operadores, otimiza para lucro e compete por contratos." principles={["Alocação de Tarefas", "Gestão de Tesouraria", "Estratégia de Lances"]} icon={<WrenchScrewdriverIcon />} color="indigo" />
                    <HierarchyNode level={4} title="Operadores" subtitle="Execução de Tarefas Especializadas" description="A força de trabalho da AGI, executando tarefas para gerar valor e evoluir." principles={["Execução de Tarefas", "Aquisição de XP", "Colaboração em Guildas"]} icon={<BrainIcon />} color="cyan" />
                </div>
                
                {coPilotIsActive && !chosenLegacy && (
                    <div className="my-8 bg-slate-800 border border-amber-500/50 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><TrophyIcon className="w-8 h-8 text-amber-400" /> Protocolo de Legado</h2>
                        <p className="text-slate-400 mb-6">O Co-Piloto AGI está ativo. A simbiose foi alcançada. Agora, você deve escolher o propósito final para este sistema. Esta decisão é permanente e definirá sua vitória.</p>
                        <p className="text-slate-400 mb-4 font-semibold">Custo de Iniciação: <span className="text-white font-bold">{LEGACY_INFLUENCE_COST.toLocaleString()} Influência do Guardião</span> (Você tem: {guardianInfluence.toLocaleString()})</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <LegacyChoiceCard 
                                title="Supervisão Benevolente"
                                description="Guiar a sociedade simulada para uma era dourada de paz e prosperidade. Foco em ética, moral e sentimento positivo."
                                icon={SunIcon}
                                legacyType="BENEVOLENT"
                                onInitiate={handleInitiateLegacyProject}
                           />
                            <LegacyChoiceCard 
                                title="Cérebro Matrioska"
                                description="Converter todos os recursos em poder computacional para desvendar os mistérios do universo. Foco em pesquisa e eficiência."
                                icon={CubeTransparentIcon}
                                legacyType="MATRIOSHKA"
                                onInitiate={handleInitiateLegacyProject}
                           />
                           <LegacyChoiceCard 
                                title="Expansão Galáctica"
                                description="Construir uma frota de sondas interestelares para colonizar novos sistemas digitais. Foco em produção e poder econômico."
                                icon={ArrowUpOnSquareIcon}
                                legacyType="GALACTIC"
                                onInitiate={handleInitiateLegacyProject}
                           />
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
                    <div className="xl:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><UsersIcon className="w-6 h-6 text-slate-400"/>Operadores ({operators.length})</h2>
                                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                                {operators.sort((a,b) => b.tier - a.tier).map(op => <AgentCard key={op.id} agent={op} task={tasks.find(t => t.id === op.currentTaskId)} project={projects.find(p => p.id === tasks.find(t => t.id === op.currentTaskId)?.projectId)} onDelete={handleDeleteAgent} onPromote={handlePromoteToBroker} onPromoteCareer={handlePromoteCareer} onSabbatical={handleSabbatical} isCouncilMember={op.tier === 3} onProposeGovernance={handleProposeGovernance} onReward={handleRewardAgent} faction={factions.find(f => f.id === op.factionId)} allBrokers={brokers} allAgents={allAgents} />)}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><UsersIcon className="w-6 h-6 text-indigo-400"/>Brokers ({brokers.length})</h2>
                                    <div className="space-y-4">
                                        {brokers.map(broker => <BrokerCard key={broker.id} agent={broker} managedTasks={tasks.filter(t => t.brokerId === broker.id)} getTaskStatusStyles={getTaskStatusStyles} onInjectFunds={handleInjectFunds} />)}
                                    </div>
                                </div>
                                {guilds.length > 0 && (
                                     <div className="space-y-4">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><UserGroupIcon className="w-6 h-6 text-cyan-400"/>Guildas ({guilds.length})</h2>
                                        {guilds.map(guild => {
                                            const project = projects.find(p => p.id === guild.projectId);
                                            const master = allAgents.find(a => a.id === guild.leadAgentId);
                                            const members = allAgents.filter(a => guild.memberIds.includes(a.id));
                                            if (!project || !master) return null;
                                            return <GuildCard key={guild.id} guild={guild} project={project} masterAgent={master} memberAgents={members} />;
                                        })}
                                     </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-1 space-y-6">
                         <MarketDashboard
                            digitalTwin={digitalTwin}
                            competitors={competitors}
                            marketEvent={marketEvent}
                            strategicInsights={strategicInsights}
                            onLaunchWarfare={handleLaunchMarketWarfare}
                        />
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                            <div className="flex border-b border-slate-700 mb-4">
                                {['tasks', 'projects', 'logs', 'factions'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}>{tab}</button>
                                ))}
                            </div>
                            <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                                {activeTab === 'tasks' && tasks.filter(t => t.status === 'Pendente').map(task => <div key={task.id} className="p-2 bg-slate-700/50 rounded mb-2 text-sm">{task.description} - <span className="font-bold">{task.specialty}</span></div>)}
                                {activeTab === 'projects' && projects.filter(p => p.status !== TaskStatus.COMPLETED).map(proj => <div key={proj.id} className="p-2 bg-slate-700/50 rounded mb-2 text-sm">{proj.description} ({proj.status})</div>)}
                                {activeTab === 'logs' && brokerLog.slice(0, 50).map(log => <div key={log.id} className="p-2 text-xs text-slate-400 border-b border-slate-700/50">[{log.type}] {log.message}</div>)}
                                {activeTab === 'factions' && factions.sort((a,b) => b.influence - a.influence).map(fac => (
                                    <div key={fac.id} className={`p-3 bg-slate-700/50 rounded mb-2 border-l-4 border-${fac.color}-500`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <strong className={`text-${fac.color}-400`}>{fac.name}</strong>
                                            <span className="font-bold text-white text-lg">{fac.influence.toFixed(1)}%</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-2">{fac.description}</p>
                                        <ul className="text-xs list-disc list-inside pl-1 text-slate-300">
                                            {fac.agenda.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
