export type IpoCategory = 'SME' | 'Mainboard'

export type StatusTone = 'high-confidence' | 'mixed-signals' | 'closed'

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

export interface FactReadPair {
  fact: string
  read: string
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
}

export interface IpoSummary {
  slug: string
  name: string
  category: IpoCategory
  oneLiner: string
  status: StatusTone
  isOpen: boolean
  closesInDays?: number
  minInvestment?: number
  logoUrl?: string
}

export interface IpoDetail extends IpoSummary {
  confidenceLabel: string
  verdictHeadline: string
  verdictBody: string
  topFacts: FactItem[]
  businessModel: string
  useOfProceeds: string
  risks: RiskFactor[]
  promoter: Promoter
  peers: PeerMultiple[]
  factReadPairs: FactReadPair[]
  sourcesChecked: string[]
  verifiedSourceCount: number
  sampleChat: ChatMessage[]
  illustrative?: boolean
}

export interface UserProfile {
  name: string
  email: string
  phone: string
}

export interface ApplicationRecord {
  companyName: string
  status: 'applied' | 'allotted' | 'not-allotted' | 'refunded'
  date: string
}
