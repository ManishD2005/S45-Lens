export type IpoCategory = 'SME' | 'Mainboard'

export type IpoLifecycleStatus = 'open' | 'closing-soon' | 'listed' | 'closed'

export type FactTone = 'success' | 'warning' | 'danger'

export interface FactItem {
  tone: FactTone
  text: string
  source: string
}

export interface RiskFactor {
  rank: number
  text: string
}

export interface PeerMultiple {
  name: string
  pe: number
  isSubject?: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  source?: string
}

export interface Promoter {
  name: string
  holdingPct: number
  context: string
  preIssuePct?: number
  postIssuePct?: number
  currentHoldingPct?: number
  background?: string
  notableAffiliation?: string
}

export interface PostListingUpdate {
  daysAgo: number
  type: 'earnings' | 'dividend' | 'board-decision'
  title: string
  detail: string
}

export interface InsiderActivity {
  daysAgo: number
  type: 'bulk-deal' | 'block-deal' | 'insider-trade'
  description: string
}

export interface PostListingData {
  updates: PostListingUpdate[]
  insiderActivity: InsiderActivity[]
}

export interface LeadManager {
  name: string
  totalIssues: number
  belowIssuePriceCount: number
}

export interface RegistrarInfo {
  name: string
}

export interface IssueMechanics {
  issueType: string
  freshIssueCr: number
  offerForSaleCr: number
  priceBand: string
  faceValue: number
  lotSize: number
  totalIssueSizeCr: number
}

export interface ApplicationTier {
  category: string
  lotsMin: number
  sharesMin: number
  amountMin: number
  reservationPct: number
}

export interface AllocationDetail {
  category: string
  reservationPct: number
  subscriptionTimesX?: number
}

export interface AnchorDetail {
  allottedCr: number
  lockInNote: string
  marqueeInvestors: string[]
}

export interface CapitalHistoryEntry {
  date: string
  event: string
  shares: number
  pricePerShare: number
}

export interface FinancialYear {
  period: string
  revenueCr: number
  ebitdaCr: number
  patCr: number
  netWorthCr: number
  borrowingsCr: number
}

export interface ValuationRatios {
  roePct: number
  rocePct: number
  ebitdaMarginPct: number
  patMarginPct: number
  debtToEquity: number
  epsPreIssue: number
  epsPostIssue: number
  peBasedOnPreIssueEps: number
  peBasedOnPostIssueEps: number
  ronwPct: number
  navPerShare: number
  priceToBookValue: number
}

export interface ExtendedPeer {
  name: string
  revenueCr: number
  revenueGrowthPct: number
  patMarginPct: number
  ronwPct: number
  pe: number
  isSubject?: boolean
}

export interface ContingentLiability {
  description: string
  amountCr: number
}

export interface Borrowing {
  lender: string
  facilityType: string
  outstandingCr: number
}

export interface SourceLink {
  label: string
  note: string
}

export interface FullReportData {
  issueMechanics: IssueMechanics
  applicationTiers: ApplicationTier[]
  allocation: AllocationDetail[]
  anchor: AnchorDetail
  capitalHistory: CapitalHistoryEntry[]
  financials: FinancialYear[]
  valuationRatios: ValuationRatios
  extendedPeers: ExtendedPeer[]
  registrar: RegistrarInfo
  contingentLiabilities: ContingentLiability[]
  borrowings: Borrowing[]
  sourceLinks: SourceLink[]
}

export interface IpoSummary {
  slug: string
  name: string
  category: IpoCategory
  oneLiner: string
  isOpen: boolean
  closesInDays?: number
  minInvestment?: number
  logoUrl?: string
  listedPrice?: number
  listedChangePercent?: number
  listedDaysAgo?: number
}

export interface UseOfProceedsBucket {
  label: string
  amountCr: number
}

export interface IpoDetail extends IpoSummary {
  topFacts: FactItem[]
  howTheyMakeMoney: string
  useOfProceeds: string
  useOfProceedsBreakdown: UseOfProceedsBucket[]
  strengths: string[]
  risks: RiskFactor[]
  promoter: Promoter
  peers: PeerMultiple[]
  sourcesChecked: string[]
  verifiedSourceCount: number
  sampleChat: ChatMessage[]
  illustrative?: boolean
  leadManager?: LeadManager
  fullReport?: FullReportData
  postListing?: PostListingData
}

export interface UserProfile {
  name: string
  email: string
  phone: string
}
