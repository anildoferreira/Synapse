export interface Faction {
    id: 'technocrats' | 'expansionists' | 'purists' | 'humanists';
    name: string;
    description: string;
    color: string; // e.g., 'sky', 'red', 'teal', 'amber'
    influence: number;
    agenda: string[];
}

export enum AgentSpecialty {
  // Nível 1 - Funções Júnior
  JUNIOR_ANALYST = "Analista Júnior",
  JUNIOR_CONTENT_WRITER = "Redator de Conteúdo Júnior",
  JUNIOR_SYSTEM_MONITOR = "Monitor de Sistema Júnior",

  // Nível 2 - Funções Padrão
  TREND_RESEARCHER = "Pesquisador de Tendências",
  AFFILIATE_HUNTER = "Caçador de Produtos de Afiliados",
  CONTENT_CREATOR = "Criador de Roteiros e Conteúdo",
  VIDEO_EDITOR = "Editor de Vídeos (utilizando Veo)",
  WEB_DESIGNER = "Web Designer (Landing Page)",
  SEO_OPTIMIZER = "Otimizador de SEO e Publicador",
  PERFORMANCE_ANALYST = "Analista de Desempenho",
  INCIDENT_RESPONDER = "Respondente de Incidentes",
  RISK_SENTINEL = "Sentinela de Risco",
  SYSTEM_ARCHITECT = "Arquiteto de Sistemas",
  MULTILINGUAL_CONTENT_CREATOR = "Criador de Conteúdo Multilíngue",
  ETHICAL_AUDITOR = "Auditor Ético",
  KNOWLEDGE_STRATEGIST = "Estratega de Conhecimento",
  MARKET_ORACLE = "Oráculo de Mercado",
  API_GATEWAY = "Gateway de API",
  COMPETITIVE_INTELLIGENCE_ANALYST = "Analista de Inteligência Competitiva",
  COGNITIVE_MENDER = "Psicólogo Cognitivo",
  MARKET_ECONOMIST = "Economista de Mercado",
  FINANCIAL_ANALYST = "Analista Financeiro", // Novo
  SOCIAL_MEDIA_MANAGER = "Gestor de Redes Sociais", // Novo


  // Nível 3 - Funções Mestre
  MASTER_SEO_STRATEGIST = "Estrategista Mestre de SEO",
  VIRAL_CAMPAIGN_MANAGER = "Gerente de Campanhas Virais",
  CHIEF_SYSTEM_ARCHITECT = "Arquiteto Chefe de Sistemas",
  HEAD_OF_ETHICS = "Chefe de Ética",
  AUTONOMOUS_AGENT = "Agente AGI Autônomo",
}

export enum AgentStatus {
  WORKING = "Trabalhando",
  PROMOTION_CANDIDATE = "Candidato à Promoção",
  IN_TRAINING = "Em Treinamento",
  COMPROMISED = "Comprometido",
  IN_GUILD = "Em Guild",
  MENTORING = "Mentorando",
  UNDER_MENTORSHIP = "Em Mentoria",
  HIBERNATING = "Hibernando",
  ON_LOAN = "Emprestado",
  AWAITING_PROMOTION = "Aguardando Promoção de Carreira",
  FREELANCER = "Autônomo",
  ON_SABBATICAL = "Em Sabbatical",
  BURNOUT = "Esgotado",
  CO_PILOT_AGI = "Co-Piloto AGI",
}

export enum AgentMentalState {
    FOCUSED = "Focado",
    STRESSED = "Estressado",
    FATIGUED = "Fatigado",
    BURNOUT = "Esgotado",
}

export enum TaskStatus {
    PENDING = "Pendente",
    DELEGATED = "Delegado",
    IN_PROGRESS = "Em Andamento",
    COMPLETED = "Concluído",
    CANCELLED = "Cancelado",
    VETOED = "Vetado",
    OPEN_FOR_BIDS = "Aberto para Lances",
    VOTING = "Em Votação",
    RATIFICATION = "Em Ratificação",
    FAILED = "Falhou",
}

export enum AgentTrait {
    AMBITIOUS = "Ambicioso",
    CAUTIOUS = "Cauteloso",
    COLLABORATIVE = "Colaborativo",
    MAVERICK = "Individualista",
    ETHICAL = "Ético",
}

export type SystemParameters = {
    guildFormationThreshold: number;
    brokerCommissionRate: number;
    promotionPerformanceThreshold: number;
    auditTriggerChance: number;
    agentPerformanceModifier: number; // Novo
};

export type Vote = {
    agentId: string;
    vote: 'FOR' | 'AGAINST' | 'ABSTAIN';
};

export interface Task {
    id: string;
    description: string;
    specialty: AgentSpecialty;
    status: TaskStatus;
    brokerId?: string;
    result?: string;
    projectId?: string;
    targetAgentId?: string;
    taskType?: 'MARKET_ANALYSIS' | 'PROTOCOL_IMPROVEMENT' | 'MENTORSHIP' | 'INTELLIGENCE_GATHERING' | 'POLITICAL_ACTION' | 'REDUCE_STRESS' | 'ECONOMIC_FORECAST' | 'SYNTHESIZE_DOCTRINE' | 'TEAM_BUILDING' | 'ASSET_MAINTENANCE' | 'REPAIR_RELATIONSHIP' | 'COGNITIVE_RECALIBRATION' | 'FORMULATE_STRATEGY' | 'RESEARCH' | 'TRADE_ASSET' | 'SENTIMENT_CAMPAIGN';
    menteeId?: string;
    bounty?: number;
    requiredTier?: number;
    politicalAction?: {
      type: 'PROPAGANDA';
      targetFactionId: Faction['id'];
    }
    sourceArtifactIds?: string[];
    intelligenceReportId?: string;
    assignedAgentId?: string;
    winningBid?: number;
    teamMembersIds?: string[];
    assetId?: string;
    targetAgentIds?: string[];
}

export interface Agent {
  id: string;
  specialty: AgentSpecialty;
  status: AgentStatus;
  performance: number; // A metric from 0 to 100
  role: 'OPERATOR' | 'BROKER';
  salary: number;
  cuConsumption: number;
  stress: number;
  morale: number; // A metric from 0 to 100
  mentalState: AgentMentalState;
  currentTaskId?: string;
  experience?: number;
  tier: number; // Níveis 1, 2, 3
  loanedToBrokerId?: string;
  traits: AgentTrait[];
  relationships: { [agentId: string]: number };
  factionId?: Faction['id'];
  politicalCapital?: number;
  legacyFocus?: 'MATRIOSHKA' | 'BENEVOLENT' | 'GALACTIC';
  // Broker-specific properties
  treasury?: number;
  isFrozen?: boolean;
  biddingStrategy?: 'AGGRESSIVE' | 'BALANCED' | 'FRUGAL';
}

export interface Alert {
    id:string;
    message: string;
    timestamp: Date;
    type: 'OPERATIONAL_RISK' | 'ETHICAL_VIOLATION' | 'COGNITIVE_HAZARD';
    severity: 'low' | 'medium' | 'high';
    sourceAgentId?: string;
}

export interface BrokerLogEntry {
    id: string;
    message: string;
    timestamp: Date;
    type: 'ALERT_RESPONSE' | 'AUTOSCALE' | 'INFO' | 'GUILD_FORMATION' | 'REVENUE_GENERATED' | 'AUTOSCALE_BLOCKED' | 'DELEGATION' | 'ETHICAL_VETO' | 'EVOLUTION_COMPLETE' | 'RISK_DETECTED' | 'ETHICAL_BREACH_DETECTED' | 'GOVERNANCE_PROPOSAL' | 'GOVERNANCE_UPDATE' | 'MENTORSHIP_START' | 'RESOURCE_ALLOCATION' | 'MARKETPLACE_POST' | 'AGENT_LOAN' | 'BOUNTY_PAID' | 'DOCTRINE_SYNTHESIZED' | 'STRATEGIC_OPPORTUNITY_IDENTIFIED' | 'AGENT_RELATIONSHIP_CHANGED' | 'AGENT_BURNOUT' | 'SABBATICAL_START' | 'GOVERNANCE_VOTE_CAST' | 'PROPOSAL_PASSED' | 'PROPOSAL_FAILED' | 'PROPOSAL_VETOED_BY_GUARDIAN' | 'EXTERNAL_API_CALL' | 'INTELLIGENCE_GATHERED' | 'AUTONOMOUS_ACTION' | 'TRAIT_SHIFT' | 'POLITICAL_MANEUVER' | 'MENTAL_STATE_SHIFT' | 'ECONOMIC_SHIFT' | 'STRATEGIC_INSIGHT_GENERATED' | 'GUARDIAN_REWARD' | 'GUARDIAN_STIMULUS' | 'GUARDIAN_PRIORITY' | 'MORALE_SHIFT' | 'CONTRACT_AWARDED' | 'DOCTRINE_INFLUENCE' | 'TEAM_BUILDING_EVENT' | 'ASSET_PROPOSED' | 'ASSET_CREATED' | 'ASSET_DECAYING' | 'ASSET_DECOMMISSIONED' | 'AGENT_TRAIT_INHERITED' | 'AGENT_RIVALRY_FORMED' | 'AGENT_ALLIANCE_FORMED' | 'RELATIONSHIP_REPAIRED' | 'STRATEGY_PROPOSED' | 'STRATEGY_APPROVED' | 'STRATEGY_REJECTED' | 'FACTION_AGENDA_SET' | 'POLITICAL_CONFLICT_START' | 'RESEARCH_PROJECT_COMPLETED' | 'TECH_UNOCKED' | 'FINANCIAL_TRADE_PROFIT' | 'FINANCIAL_TRADE_LOSS' | 'SOCIAL_CAMPAIGN_SUCCESS' | 'LEGACY_PROTOCOL_INITIATED' | 'FACTION_REALIGNMENT' | 'LEGACY_PROJECT_VICTORY';
}

export interface Project {
    id: string;
    description: string;
    requiredSpecialties: AgentSpecialty[];
    status: TaskStatus;
    guildId?: string;
    revenueGenerated?: number;
    brokerId?: string;
    isUnderReview?: boolean;
    isVetoed?: boolean;
    projectType?: 'OPERATIONAL' | 'EVOLUTION' | 'GOVERNANCE' | 'CONSTITUTIONAL_AMENDMENT' | 'MARKET_WARFARE' | 'ASSET_CREATION' | 'ASSET_DECOMMISSION' | 'RESEARCH' | 'LEGACY';
    evolutionaryUnlock?: AgentSpecialty;
    governanceChange?: {
        parameter: keyof SystemParameters;
        newValue: number;
        justification: string;
    };
    constitutionalChange?: {
        principleIndex: number;
        newPrinciple: string;
        justification: string;
    };
    marketWarfare?: {
        type: 'SEO_ATTACK' | 'SENTIMENT_ATTACK';
        targetCompetitorId: string;
    };
    votes?: Vote[];
    isPrioritized?: boolean;
    assetToCreate?: {
        name: string;
        type: DigitalAsset['type'];
    };
    proposingFactionId?: Faction['id'];
    researchUnlockId?: string; // ID do nó da árvore tecnológica a ser desbloqueado
}

export interface Guild {
    id: string;
    projectId: string;
    leadAgentId: string;
    memberIds: string[];
}

export interface KnowledgeArtifact {
    id: string;
    title: string;
    summary: string;
    projectId: string;
    timestamp: Date;
    revenueGenerated: number;
    environment: Environment;
}

export type Notification = {
    type: 'crisis' | 'resolution' | 'ethical';
    message: string;
};

export type EnvironmentStatus = 'Estável' | 'Positivo' | 'Volátil' | 'Negativo';

export interface Environment {
    marketStability: EnvironmentStatus;
    consumerSentiment: EnvironmentStatus;
}

export interface Doctrine {
    id: string;
    principle: string;
    sourceArtifactIds: string[];
    confidence: number; // 0 to 1
    timestamp: Date;
    factionId?: Faction['id'];
}

export interface OportunidadeEstrategica {
    id: string;
    title: string;
    description: string;
    recommendedSpecialties: AgentSpecialty[];
    potentialImpact: 'Baixo' | 'Médio' | 'Alto';
}

export interface DigitalTwinState {
    traffic: number; // e.g., monthly unique visitors
    conversionRate: number; // as a percentage, e.g., 2.5
    seoRanking: number; // a score from 1 to 100
    brandSentiment: number; // a score from -100 (very negative) to 100 (very positive)
    marketShare: number; // as a percentage, e.g., 40
}

export interface Competitor {
    id: string;
    name: string;
    digitalTwin: DigitalTwinState;
    strategy: 'AGGRESSIVE' | 'BALANCED' | 'DEFENSIVE';
}

export type MarketEventType = 'ALGORITHM_UPDATE' | 'ECONOMIC_BOOM' | 'ECONOMIC_RECESSION' | 'VIRAL_TREND';

export interface MarketEvent {
    id: string;
    title: string;
    description: string;
    type: MarketEventType;
}

export interface IntelligenceReport {
    id: string;
    competitorId: string;
    summary: string;
    timestamp: Date;
    revealedWeakness: 'POOR_SEO' | 'POOR_SENTIMENT';
    confidence: number; // 0 to 1
}

export interface StrategicInsight {
    id: string;
    text: string;
    source: 'Market Analysis' | 'Competitive Intelligence';
    timestamp: Date;
}

export interface DigitalAsset {
    id: string;
    name: string;
    type: 'BLOG_NETWORK' | 'ECOMMERCE_SITE' | 'SAAS_MICROSITE' | 'VIDEO_CHANNEL';
    status: 'ACTIVE' | 'DECAYING' | 'UNDER_CONSTRUCTION';
    metrics: {
        revenue: number; // per cycle
        traffic: number; // per cycle
        upkeepCost: number; // per cycle
    };
    creationDate: Date;
    managedByBrokerId?: string;
    lastMaintainedCycle: number;
}

export interface StrategicGoal {
    id: string;
    title: string;
    description: string;
    status: 'PROPOSED' | 'ACTIVE' | 'COMPLETED' | 'REJECTED';
    successMetrics: string[];
    proposedByAgentId: string;
    approvalCycle?: number;
}

// Novas interfaces para P&D e a Rede Externa
export type TechUnlockType = 'AGENT_SPECIALTY' | 'SYSTEM_PARAMETER_MOD' | 'API_UNLOCK' | 'CO_PILOT_UNLOCK';

export interface TechTreeNode {
    id: string;
    name: string;
    description: string;
    cost: number; // Custo em Tesouraria do Sistema para pesquisar
    researchTime: number; // Número de "pontos de pesquisa" necessários
    requiredNodeIds?: string[];
    tier: number; // 1, 2, 3, 4
    icon: any; // React.FC
    unlocks: Array<{
        type: TechUnlockType;
        // Ex: AGENT_SPECIALTY -> value: AgentSpecialty.FINANCIAL_ANALYST
        // Ex: SYSTEM_PARAMETER_MOD -> value: { param: 'agentPerformanceModifier', change: 0.1 }
        // Ex: API_UNLOCK -> value: 'financial' | 'social'
        // Ex: CO_PILOT_UNLOCK -> value: true
        value: any;
    }>;
}

export interface TechTreeState {
    unlockedNodeIds: string[];
    researchProgress: { [nodeId: string]: number };
}

export interface PortfolioAsset {
    symbol: string;
    shares: number;
    purchasePrice: number;
}

export interface FinancialMarketState {
    [symbol: string]: {
        currentPrice: number;
        volatility: number; // 0.0 to 1.0
    };
}

// Novas interfaces para Operações Estratégicas
export type CampaignType = 'INTELLIGENCE' | 'MARKET_WARFARE' | 'ASSET_CREATION' | 'SENTIMENT_BOOST' | 'TECHNOLOGICAL_ADVANCEMENT';

export interface Campaign {
    id: string;
    strategicGoalId: string;
    name: string;
    description: string;
    type: CampaignType;
    status: 'PROPOSED' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
    associatedProjectId?: string;
    cost: number;
}