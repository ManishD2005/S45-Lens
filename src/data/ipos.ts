import type { ApplicationRecord, IpoDetail, IpoSummary } from '../types'

const zappfresh: IpoDetail = {
  slug: 'zappfresh',
  name: 'Zappfresh (DSM Fresh Foods Ltd)',
  category: 'SME',
  oneLiner: 'Farm-to-fork meat and seafood delivery across Delhi NCR',
  status: 'high-confidence',
  isOpen: true,
  closesInDays: 2,
  minInvestment: 14948,
  logoUrl: '/zappfresh.png',
  confidenceLabel: 'High confidence',
  verdictHeadline: 'Established, growing steadily, one business line does most of the work',
  verdictBody:
    "A 10-year-old Delhi meat-delivery brand growing fast, but leaning heavily on one product, and raising money mainly to build cold storage in new cities.",
  topFacts: [
    {
      tone: 'success',
      text: 'Revenue up 45%, profit up 94% year on year',
      source: 'verified against DRHP + MCA filing',
    },
    {
      tone: 'warning',
      text: 'Chicken is ~55% of total revenue',
      source: 'from DRHP, concentration risk',
    },
    {
      tone: 'danger',
      text: '₹8.7 Cr tax demand under dispute, ₹32 Cr debt outstanding',
      source: 'from DRHP',
    },
  ],
  businessModel:
    "Zappfresh runs a 'farm to fork' model — sourcing meat and seafood directly and running its own cold-chain logistics to deliver to customers, instead of going through middlemen.",
  useOfProceeds:
    '₹10.7 Cr of the ₹59.65 Cr raised goes to 6 new cold-storage units across Delhi, Mumbai, and Odisha over 2 years.',
  risks: [
    { rank: 1, text: 'Chicken concentration, ~55% of revenue' },
    { rank: 2, text: '₹8.7 Cr tax dispute, unresolved' },
    { rank: 3, text: 'Small team, ~46 employees' },
    { rank: 4, text: 'Competitive category, several players' },
  ],
  promoter: {
    name: 'Deepanshu Manchanda',
    holdingPct: 57,
    context: 'Founder, retains control post-listing',
  },
  peers: [
    { name: 'Zappfresh', pe: 22, isSubject: true },
    { name: 'Peer A', pe: 31 },
    { name: 'Peer B', pe: 18 },
    { name: 'Peer C', pe: 27 },
  ],
  factReadPairs: [
    {
      fact: 'Revenue +45%, PAT +94% YoY',
      read: 'Genuinely strong — growth and profitability improving together',
    },
    {
      fact: 'Chicken = ~55% of revenue',
      read: 'Worth weighing seriously before applying',
    },
  ],
  sourcesChecked: ['DRHP / RHP', 'MCA filings', 'SEBI orders', 'Litigation records'],
  verifiedSourceCount: 4,
  sampleChat: [
    { role: 'user', text: 'Why is chicken 55% of revenue risky?' },
    {
      role: 'assistant',
      text: "It means Zappfresh's business leans heavily on one product line. If chicken prices, supply, or demand shift — say, a health scare or a sourcing disruption — a big share of revenue is exposed at once. Diversified peers wouldn't feel a single-category shock as hard.",
      source: 'source: DRHP p.42',
    },
  ],
}

const orbitLogistics: IpoDetail = {
  slug: 'orbit-logistics',
  name: 'Orbit Logistics Ltd',
  category: 'SME',
  oneLiner: 'Last-mile freight aggregation for D2C brands',
  status: 'mixed-signals',
  isOpen: true,
  closesInDays: 1,
  minInvestment: 12036,
  logoUrl: '/orbit.png',
  confidenceLabel: 'Mixed signals',
  verdictHeadline: 'Fast top-line growth, thinner margins than peers',
  verdictBody:
    'Revenue is scaling quickly on the back of new client wins, but operating margin trails larger logistics peers and two key contracts are up for renewal within the year.',
  topFacts: [
    {
      tone: 'success',
      text: 'Revenue up 38% year on year',
      source: 'verified against DRHP + MCA filing',
    },
    {
      tone: 'warning',
      text: 'Two clients account for ~41% of revenue',
      source: 'from DRHP, concentration risk',
    },
    {
      tone: 'warning',
      text: 'Operating margin below peer median',
      source: 'from DRHP, peer filings',
    },
  ],
  businessModel:
    'Orbit aggregates last-mile courier capacity across regional fleet partners and resells it as a single API to D2C and quick-commerce brands.',
  useOfProceeds:
    '₹6.2 Cr of the ₹28 Cr raised goes to working capital for fleet partner payouts, the remainder to a new sortation hub in Pune.',
  risks: [
    { rank: 1, text: 'Client concentration, two accounts ~41% of revenue' },
    { rank: 2, text: 'Thin operating margin versus peers' },
    { rank: 3, text: 'Two large contracts renew within 12 months' },
    { rank: 4, text: 'Asset-light model, low switching cost for clients' },
  ],
  promoter: {
    name: 'Ritika Sabharwal',
    holdingPct: 49,
    context: 'Co-founder, board retains joint control post-listing',
  },
  peers: [
    { name: 'Orbit Logistics', pe: 19, isSubject: true },
    { name: 'Peer A', pe: 24 },
    { name: 'Peer B', pe: 21 },
    { name: 'Peer C', pe: 16 },
  ],
  factReadPairs: [
    {
      fact: 'Revenue +38% YoY, operating margin below peer median',
      read: 'Growth is real, but it is coming at a cost — worth checking if margin catches up before applying',
    },
    {
      fact: 'Two clients = ~41% of revenue',
      read: 'A single lost contract would leave a visible dent',
    },
  ],
  sourcesChecked: ['DRHP / RHP', 'MCA filings', 'Litigation records'],
  verifiedSourceCount: 3,
  sampleChat: [
    { role: 'user', text: 'What happens if one of the two big clients leaves?' },
    {
      role: 'assistant',
      text: 'The DRHP discloses that two clients together make up roughly 41% of revenue. Losing either without a replacement would materially reduce near-term revenue — the filing does not name a specific contingency plan for that scenario.',
      source: 'source: DRHP p.58',
    },
  ],
  illustrative: true,
}

const nimbusCloud: IpoDetail = {
  slug: 'nimbus-cloud',
  name: 'Nimbus Cloud Systems Ltd',
  category: 'Mainboard',
  oneLiner: 'Enterprise backup and disaster-recovery SaaS',
  status: 'high-confidence',
  isOpen: true,
  closesInDays: 5,
  minInvestment: 28290,
  logoUrl: '/nimbus.png',
  confidenceLabel: 'High confidence',
  verdictHeadline: 'Profitable, diversified customer base, priced in line with peers',
  verdictBody:
    'A mature enterprise SaaS business with recurring revenue spread across 200+ clients and no single customer above 6% of revenue.',
  topFacts: [
    {
      tone: 'success',
      text: 'Net revenue retention of 118%',
      source: 'verified against DRHP + auditor report',
    },
    {
      tone: 'success',
      text: 'No single customer above 6% of revenue',
      source: 'from DRHP',
    },
    {
      tone: 'warning',
      text: 'R&D spend declined as a share of revenue this year',
      source: 'from DRHP',
    },
  ],
  businessModel:
    'Nimbus sells subscription-based backup and disaster-recovery software to mid-size enterprises, billed annually with multi-year contracts.',
  useOfProceeds:
    '₹42 Cr of the ₹210 Cr raised goes to expanding the engineering team and a new data-residency region in the EU.',
  risks: [
    { rank: 1, text: 'R&D intensity declining relative to revenue' },
    { rank: 2, text: 'Long enterprise sales cycles slow growth' },
    { rank: 3, text: 'Currency exposure from EU expansion' },
    { rank: 4, text: 'Competitive category with well-funded incumbents' },
  ],
  promoter: {
    name: 'Arjun Mehta',
    holdingPct: 34,
    context: 'Founder-CEO, no pledged shares',
  },
  peers: [
    { name: 'Nimbus Cloud', pe: 29, isSubject: true },
    { name: 'Peer A', pe: 33 },
    { name: 'Peer B', pe: 26 },
    { name: 'Peer C', pe: 30 },
  ],
  factReadPairs: [
    {
      fact: 'Net revenue retention of 118%, no client above 6% of revenue',
      read: 'A genuinely diversified, sticky customer base — a reassuring combination',
    },
    {
      fact: 'R&D spend down as a share of revenue',
      read: 'Worth watching over the next few quarters, not yet a red flag',
    },
  ],
  sourcesChecked: ['DRHP / RHP', 'MCA filings', 'SEBI orders'],
  verifiedSourceCount: 3,
  sampleChat: [
    { role: 'user', text: 'Is the declining R&D spend a concern?' },
    {
      role: 'assistant',
      text: 'The DRHP shows R&D as a share of revenue fell from prior year levels, though absolute spend still grew. On its own this is not flagged as a material risk in the filing — it is worth watching, not an immediate concern.',
      source: 'source: DRHP p.67',
    },
  ],
  illustrative: true,
}

export const ipoDetails: Record<string, IpoDetail> = {
  zappfresh,
  'orbit-logistics': orbitLogistics,
  'nimbus-cloud': nimbusCloud,
}

export const ipoSummaries: IpoSummary[] = [
  zappfresh,
  orbitLogistics,
  nimbusCloud,
  {
    slug: 'kaveri-agro',
    name: 'Kaveri Agro Foods Ltd',
    category: 'SME',
    oneLiner: 'Packaged spices and dry-goods distribution',
    status: 'closed',
    isOpen: false,
  },
  {
    slug: 'trident-papers',
    name: 'Trident Papers Ltd',
    category: 'Mainboard',
    oneLiner: 'Industrial packaging paper manufacturing',
    status: 'closed',
    isOpen: false,
  },
]

function genericIpoDetail(summary: IpoSummary): IpoDetail {
  return {
    ...summary,
    confidenceLabel: 'Limited data',
    verdictHeadline: 'Detailed verification not yet available for this IPO',
    verdictBody:
      'This prototype only includes deep, sourced verification for a small sample of IPOs. The fields below are placeholders to demonstrate the layout.',
    topFacts: [
      { tone: 'warning', text: 'Detailed facts not yet verified for this IPO', source: 'sample placeholder' },
    ],
    businessModel: 'Business model detail not included in this prototype sample.',
    useOfProceeds: 'Use of proceeds detail not included in this prototype sample.',
    risks: [{ rank: 1, text: 'Risk detail not included in this prototype sample' }],
    promoter: { name: 'Not available', holdingPct: 0, context: 'Not included in this prototype sample' },
    peers: [{ name: summary.name, pe: 0, isSubject: true }],
    factReadPairs: [],
    sourcesChecked: [],
    verifiedSourceCount: 0,
    sampleChat: [],
    illustrative: true,
  }
}

export function getIpoDetail(slug: string): IpoDetail | undefined {
  if (ipoDetails[slug]) return ipoDetails[slug]
  const summary = ipoSummaries.find((ipo) => ipo.slug === slug)
  return summary ? genericIpoDetail(summary) : undefined
}

export const applicationHistory: ApplicationRecord[] = [
  { companyName: 'Zappfresh (DSM Fresh Foods)', status: 'applied', date: '28 Jun 2026' },
  { companyName: 'Nimbus Cloud Systems', status: 'allotted', date: '02 May 2026' },
  { companyName: 'Kaveri Agro Foods', status: 'not-allotted', date: '14 Mar 2026' },
  { companyName: 'Trident Papers', status: 'refunded', date: '09 Feb 2026' },
]
