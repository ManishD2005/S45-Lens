import type { IpoDetail, IpoSummary } from '../types'

const zappfresh: IpoDetail = {
  slug: 'zappfresh',
  name: 'Zappfresh (DSM Fresh Foods Ltd)',
  category: 'SME',
  oneLiner: 'Farm-to-fork meat and seafood delivery across Delhi NCR',
  isOpen: true,
  closesInDays: 2,
  minInvestment: 14948,
  logoUrl: '/zappfresh.png',
  topFacts: [
    {
      tone: 'success',
      text: 'Revenue up 45%, profit up 94% year on year',
      source: 'Verified against DRHP + MCA filing',
    },
    {
      tone: 'warning',
      text: 'Chicken is ~55% of total revenue',
      source: 'From DRHP, concentration risk',
    },
    {
      tone: 'danger',
      text: '₹8.7 Cr tax demand under dispute, ₹32 Cr debt outstanding',
      source: 'From DRHP',
    },
  ],
  howTheyMakeMoney:
    "Zappfresh sells meat and seafood directly to consumers online and via app, sourcing straight from farms and running its own cold-chain logistics instead of going through middlemen.",
  useOfProceeds:
    '₹10.7 Cr of the ₹59.65 Cr raised goes to 6 new cold-storage units across Delhi, Mumbai, and Odisha over 2 years.',
  useOfProceedsBreakdown: [
    { label: 'Capex – new cold-storage units', amountCr: 10.7 },
    { label: 'Working capital', amountCr: 38 },
    { label: 'General corporate purposes', amountCr: 7.5 },
    { label: 'Issue-related expenses', amountCr: 3.45 },
  ],
  strengths: [
    '10-year track record in Delhi NCR’s meat and seafood delivery market',
    'Owns its cold-chain logistics end-to-end, reducing dependence on third-party delivery',
    'Revenue and profit have grown together for three consecutive years',
    'Direct farm-sourcing relationships lower input cost volatility',
    'Repeat-customer base reduces reliance on new customer acquisition spend',
  ],
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
    preIssuePct: 62,
    postIssuePct: 57,
    background: '8 years in FMCG supply chain roles before founding Zappfresh in 2016',
  },
  peers: [
    { name: 'Zappfresh', pe: 22, isSubject: true },
    { name: 'Avanti Feeds', pe: 26 },
    { name: 'Godrej Agrovet', pe: 24 },
    { name: "Venky's India", pe: 14 },
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
  leadManager: {
    name: 'Narnolia Financial Services',
    totalIssues: 12,
    belowIssuePriceCount: 2,
  },
  fullReport: {
    issueMechanics: {
      issueType: 'Fresh issue only',
      freshIssueCr: 59.65,
      offerForSaleCr: 0,
      priceBand: '₹181 – ₹187 per share',
      faceValue: 10,
      lotSize: 80,
      totalIssueSizeCr: 59.65,
    },
    applicationTiers: [
      { category: 'Retail', lotsMin: 1, sharesMin: 80, amountMin: 14960, reservationPct: 35 },
      { category: 'S-HNI', lotsMin: 14, sharesMin: 1120, amountMin: 209440, reservationPct: 15 },
      { category: 'B-HNI', lotsMin: 68, sharesMin: 5440, amountMin: 1017280, reservationPct: 50 },
    ],
    allocation: [
      { category: 'QIB', reservationPct: 50, subscriptionTimesX: 2.4 },
      { category: 'NII (HNI)', reservationPct: 15, subscriptionTimesX: 3.1 },
      { category: 'Retail', reservationPct: 35, subscriptionTimesX: 1.8 },
    ],
    anchor: {
      allottedCr: 17.9,
      lockInNote: '50% of anchor shares locked in for 30 days, remainder for 90 days from allotment',
      marqueeInvestors: ['Nippon India Small Cap Fund', 'Ashoka Whiteoak ICAV', 'Kotak Multicap Fund'],
    },
    capitalHistory: [
      { date: 'Mar 2019', event: 'Initial subscription on incorporation', shares: 50_000, pricePerShare: 10 },
      { date: 'Jul 2022', event: 'Series A allotment', shares: 180_000, pricePerShare: 340 },
      { date: 'Jan 2025', event: 'Pre-IPO placement', shares: 62_000, pricePerShare: 165 },
    ],
    financials: [
      { period: 'FY23', revenueCr: 58, ebitdaCr: 5, patCr: 2.1, netWorthCr: 19, borrowingsCr: 21 },
      { period: 'FY24', revenueCr: 81, ebitdaCr: 9, patCr: 4.7, netWorthCr: 28, borrowingsCr: 27 },
      { period: 'FY25', revenueCr: 118, ebitdaCr: 15, patCr: 9.2, netWorthCr: 42, borrowingsCr: 32 },
    ],
    valuationRatios: {
      roePct: 21.9,
      rocePct: 24.3,
      ebitdaMarginPct: 12.7,
      patMarginPct: 7.8,
      debtToEquity: 0.76,
      epsPreIssue: 9.7,
      epsPostIssue: 8.5,
      peBasedOnPreIssueEps: 19.3,
      peBasedOnPostIssueEps: 22,
      ronwPct: 21.9,
      navPerShare: 38.6,
      priceToBookValue: 4.8,
    },
    extendedPeers: [
      { name: 'Zappfresh', revenueCr: 118, revenueGrowthPct: 45, patMarginPct: 7.8, ronwPct: 21.9, pe: 22, isSubject: true },
      { name: 'Avanti Feeds', revenueCr: 4200, revenueGrowthPct: 8, patMarginPct: 6.8, ronwPct: 15.2, pe: 26 },
      { name: 'Godrej Agrovet', revenueCr: 9800, revenueGrowthPct: 6, patMarginPct: 4.1, ronwPct: 11.6, pe: 24 },
      { name: "Venky's India", revenueCr: 7600, revenueGrowthPct: 4, patMarginPct: 5.3, ronwPct: 13.8, pe: 14 },
    ],
    registrar: { name: 'Bigshare Services Pvt Ltd' },
    contingentLiabilities: [
      { description: 'Income tax demand under dispute (AY 2023-24)', amountCr: 8.7 },
      { description: 'Bank guarantees issued to suppliers', amountCr: 2.1 },
    ],
    borrowings: [
      { lender: 'HDFC Bank', facilityType: 'Working capital / cash credit', outstandingCr: 18.4 },
      { lender: 'Axis Bank', facilityType: 'Term loan (cold-storage capex)', outstandingCr: 13.6 },
    ],
    sourceLinks: [
      { label: 'DRHP / RHP', note: 'Filed with SEBI and the stock exchanges' },
      { label: 'SEBI', note: 'Regulatory filings and observation letter' },
      { label: 'NSE / BSE', note: 'Exchange listing and disclosure pages' },
      { label: 'MCA', note: 'Registrar of Companies filings' },
      { label: 'Registrar portal', note: 'Allotment status and application tracking' },
    ],
  },
}

const orbitLogistics: IpoDetail = {
  slug: 'orbit-logistics',
  name: 'Orbit Logistics Ltd',
  category: 'SME',
  oneLiner: 'Last-mile freight aggregation for D2C brands',
  isOpen: true,
  closesInDays: 1,
  minInvestment: 12036,
  logoUrl: '/orbit.png',
  topFacts: [
    {
      tone: 'success',
      text: 'Revenue up 38% year on year',
      source: 'Verified against DRHP + MCA filing',
    },
    {
      tone: 'warning',
      text: 'Two clients account for ~41% of revenue',
      source: 'From DRHP, concentration risk',
    },
    {
      tone: 'warning',
      text: 'Operating margin below peer median',
      source: 'From DRHP, peer filings',
    },
  ],
  howTheyMakeMoney:
    'Orbit earns a margin on every shipment by aggregating spare capacity from regional fleet partners and reselling it as a single delivery API to D2C and quick-commerce brands.',
  useOfProceeds:
    '₹6.2 Cr of the ₹28 Cr raised goes to working capital for fleet partner payouts, the remainder to a new sortation hub in Pune.',
  useOfProceedsBreakdown: [
    { label: 'Working capital – fleet partner payouts', amountCr: 6.2 },
    { label: 'Capex – Pune sortation hub', amountCr: 19.3 },
    { label: 'General corporate purposes', amountCr: 2 },
    { label: 'Issue-related expenses', amountCr: 0.5 },
  ],
  strengths: [
    'Asset-light model avoids heavy fleet capital expenditure',
    'API-based integration makes onboarding new D2C clients fast',
    'Established relationships with regional fleet partners across key metros',
    'Revenue has grown consistently for three straight years',
  ],
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
    preIssuePct: 53,
    postIssuePct: 49,
    background: '12 years in freight and courier operations before co-founding Orbit in 2019',
    notableAffiliation:
      'Also a director at a separate logistics venture struck off the MCA register in 2021 for non-filing of annual returns; no further regulatory action was noted.',
  },
  peers: [
    { name: 'Orbit Logistics', pe: 19, isSubject: true },
    { name: 'TCI Express', pe: 32 },
    { name: 'Blue Dart Express', pe: 52 },
    { name: 'VRL Logistics', pe: 18 },
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
  leadManager: {
    name: 'Hem Securities',
    totalIssues: 18,
    belowIssuePriceCount: 3,
  },
  fullReport: {
    issueMechanics: {
      issueType: 'Fresh issue only',
      freshIssueCr: 28,
      offerForSaleCr: 0,
      priceBand: '₹115 – ₹120 per share',
      faceValue: 10,
      lotSize: 100,
      totalIssueSizeCr: 28,
    },
    applicationTiers: [
      { category: 'Retail', lotsMin: 1, sharesMin: 100, amountMin: 12000, reservationPct: 35 },
      { category: 'S-HNI', lotsMin: 17, sharesMin: 1700, amountMin: 204000, reservationPct: 15 },
      { category: 'B-HNI', lotsMin: 84, sharesMin: 8400, amountMin: 1008000, reservationPct: 50 },
    ],
    allocation: [
      { category: 'QIB', reservationPct: 50, subscriptionTimesX: 1.6 },
      { category: 'NII (HNI)', reservationPct: 15, subscriptionTimesX: 2.2 },
      { category: 'Retail', reservationPct: 35, subscriptionTimesX: 1.3 },
    ],
    anchor: {
      allottedCr: 8.4,
      lockInNote: '50% of anchor shares locked in for 30 days, remainder for 90 days from allotment',
      marqueeInvestors: ['ICICI Prudential Smallcap Fund', 'Motilal Oswal Midcap Fund', 'Edelweiss Mutual Fund'],
    },
    capitalHistory: [
      { date: 'Feb 2020', event: 'Initial subscription on incorporation', shares: 40_000, pricePerShare: 10 },
      { date: 'Sep 2022', event: 'Series A allotment', shares: 145_000, pricePerShare: 210 },
      { date: 'Feb 2025', event: 'Pre-IPO placement', shares: 51_000, pricePerShare: 98 },
    ],
    financials: [
      { period: 'FY23', revenueCr: 52, ebitdaCr: 4.1, patCr: 1.3, netWorthCr: 11, borrowingsCr: 8 },
      { period: 'FY24', revenueCr: 68, ebitdaCr: 5.4, patCr: 2.0, netWorthCr: 16, borrowingsCr: 11 },
      { period: 'FY25', revenueCr: 94, ebitdaCr: 7.8, patCr: 3.1, netWorthCr: 22, borrowingsCr: 14 },
    ],
    valuationRatios: {
      roePct: 14.1,
      rocePct: 16.8,
      ebitdaMarginPct: 8.3,
      patMarginPct: 3.3,
      debtToEquity: 0.64,
      epsPreIssue: 6.9,
      epsPostIssue: 6.3,
      peBasedOnPreIssueEps: 17.4,
      peBasedOnPostIssueEps: 19,
      ronwPct: 14.1,
      navPerShare: 17.4,
      priceToBookValue: 6.9,
    },
    extendedPeers: [
      { name: 'Orbit Logistics', revenueCr: 94, revenueGrowthPct: 38, patMarginPct: 3.3, ronwPct: 14.1, pe: 19, isSubject: true },
      { name: 'TCI Express', revenueCr: 1180, revenueGrowthPct: 12, patMarginPct: 7.9, ronwPct: 18.4, pe: 32 },
      { name: 'Blue Dart Express', revenueCr: 4650, revenueGrowthPct: 10, patMarginPct: 6.2, ronwPct: 22.1, pe: 52 },
      { name: 'VRL Logistics', revenueCr: 2680, revenueGrowthPct: 9, patMarginPct: 5.1, ronwPct: 16.7, pe: 18 },
    ],
    registrar: { name: 'Skyline Financial Services Pvt Ltd' },
    contingentLiabilities: [
      { description: 'Disputed service tax demand (FY22)', amountCr: 1.4 },
      { description: 'Guarantees given to fleet-partner vendors', amountCr: 0.9 },
    ],
    borrowings: [
      { lender: 'Yes Bank', facilityType: 'Invoice discounting facility', outstandingCr: 8.6 },
      { lender: 'IDFC First Bank', facilityType: 'Working capital demand loan', outstandingCr: 5.4 },
    ],
    sourceLinks: [
      { label: 'DRHP / RHP', note: 'Filed with SEBI and the stock exchanges' },
      { label: 'SEBI', note: 'Regulatory filings and observation letter' },
      { label: 'NSE / BSE', note: 'Exchange listing and disclosure pages' },
      { label: 'MCA', note: 'Registrar of Companies filings' },
      { label: 'Registrar portal', note: 'Allotment status and application tracking' },
    ],
  },
}

const nimbusCloud: IpoDetail = {
  slug: 'nimbus-cloud',
  name: 'Nimbus Cloud Systems Ltd',
  category: 'Mainboard',
  oneLiner: 'Enterprise backup and disaster-recovery SaaS',
  isOpen: true,
  closesInDays: 5,
  minInvestment: 28290,
  logoUrl: '/nimbus.png',
  topFacts: [
    {
      tone: 'success',
      text: 'Net revenue retention of 118%',
      source: 'Verified against DRHP + auditor report',
    },
    {
      tone: 'success',
      text: 'No single customer above 6% of revenue',
      source: 'From DRHP',
    },
    {
      tone: 'warning',
      text: 'R&D spend declined as a share of revenue this year',
      source: 'From DRHP',
    },
  ],
  howTheyMakeMoney:
    'Nimbus earns recurring subscription revenue by selling backup and disaster-recovery software to mid-size enterprises, billed annually under multi-year contracts.',
  useOfProceeds:
    '₹42 Cr of the ₹210 Cr raised goes to expanding the engineering team and a new data-residency region in the EU.',
  useOfProceedsBreakdown: [
    { label: 'Engineering team expansion', amountCr: 25 },
    { label: 'Capex – EU data-residency region', amountCr: 17 },
    { label: 'General corporate purposes', amountCr: 78 },
    { label: 'Working capital', amountCr: 22 },
    { label: 'Issue-related expenses', amountCr: 8 },
  ],
  strengths: [
    'Net revenue retention of 118% shows expanding wallet share with existing customers',
    'No single customer contributes more than 6% of revenue, reducing concentration risk',
    'Multi-year contracts with 200+ enterprise clients provide revenue visibility',
    'New EU data-residency region expands addressable market in regulated industries',
    'Founder-CEO holds no pledged shares, aligning incentives with public shareholders',
  ],
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
    preIssuePct: 38,
    postIssuePct: 34,
    background: '10 years as an engineering leader at enterprise storage companies before founding Nimbus in 2017',
  },
  peers: [
    { name: 'Nimbus Cloud', pe: 29, isSubject: true },
    { name: 'Commvault Systems', pe: 45 },
    { name: 'NetApp', pe: 25 },
    { name: 'Persistent Systems', pe: 44 },
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
  leadManager: {
    name: 'JM Financial',
    totalIssues: 9,
    belowIssuePriceCount: 1,
  },
  fullReport: {
    issueMechanics: {
      issueType: 'Fresh issue + Offer for sale',
      freshIssueCr: 150,
      offerForSaleCr: 60,
      priceBand: '₹630 – ₹655 per share',
      faceValue: 2,
      lotSize: 44,
      totalIssueSizeCr: 210,
    },
    applicationTiers: [
      { category: 'Retail', lotsMin: 1, sharesMin: 44, amountMin: 28820, reservationPct: 35 },
      { category: 'S-HNI', lotsMin: 7, sharesMin: 308, amountMin: 201740, reservationPct: 15 },
      { category: 'B-HNI', lotsMin: 32, sharesMin: 1408, amountMin: 922240, reservationPct: 50 },
    ],
    allocation: [
      { category: 'QIB', reservationPct: 50, subscriptionTimesX: 3.8 },
      { category: 'NII (HNI)', reservationPct: 15, subscriptionTimesX: 2.9 },
      { category: 'Retail', reservationPct: 35, subscriptionTimesX: 2.1 },
    ],
    anchor: {
      allottedCr: 63,
      lockInNote: '50% of anchor shares locked in for 30 days, remainder for 90 days from allotment',
      marqueeInvestors: ['SBI Mutual Fund', 'Fidelity Investments', 'Government of Singapore (GIC)'],
    },
    capitalHistory: [
      { date: 'Mar 2015', event: 'Initial subscription on incorporation', shares: 500_000, pricePerShare: 2 },
      { date: 'Nov 2019', event: 'Series B allotment', shares: 1_200_000, pricePerShare: 185 },
      { date: 'Jun 2024', event: 'Pre-IPO placement', shares: 310_000, pricePerShare: 520 },
    ],
    financials: [
      { period: 'FY23', revenueCr: 210, ebitdaCr: 52, patCr: 29, netWorthCr: 201, borrowingsCr: 26 },
      { period: 'FY24', revenueCr: 258, ebitdaCr: 68, patCr: 41, netWorthCr: 248, borrowingsCr: 22 },
      { period: 'FY25', revenueCr: 312, ebitdaCr: 87, patCr: 54, netWorthCr: 310, borrowingsCr: 18 },
    ],
    valuationRatios: {
      roePct: 17.4,
      rocePct: 19.6,
      ebitdaMarginPct: 27.9,
      patMarginPct: 17.3,
      debtToEquity: 0.06,
      epsPreIssue: 24.8,
      epsPostIssue: 22.6,
      peBasedOnPreIssueEps: 26.4,
      peBasedOnPostIssueEps: 29,
      ronwPct: 17.4,
      navPerShare: 124,
      priceToBookValue: 5.3,
    },
    extendedPeers: [
      { name: 'Nimbus Cloud', revenueCr: 312, revenueGrowthPct: 21, patMarginPct: 17.3, ronwPct: 17.4, pe: 29, isSubject: true },
      { name: 'Commvault Systems', revenueCr: 6100, revenueGrowthPct: 15, patMarginPct: 11.8, ronwPct: 14.2, pe: 45 },
      { name: 'NetApp', revenueCr: 52400, revenueGrowthPct: 6, patMarginPct: 15.6, ronwPct: 28.9, pe: 25 },
      { name: 'Persistent Systems', revenueCr: 11400, revenueGrowthPct: 20, patMarginPct: 12.4, ronwPct: 24.6, pe: 44 },
    ],
    registrar: { name: 'KFin Technologies Ltd' },
    contingentLiabilities: [
      { description: 'Corporate guarantee for EU subsidiary credit facility', amountCr: 12.5 },
      { description: 'Disputed GST input credit claim', amountCr: 3.2 },
    ],
    borrowings: [
      { lender: 'HSBC', facilityType: 'Term loan (EU data-residency capex)', outstandingCr: 12 },
      { lender: 'ICICI Bank', facilityType: 'Working capital facility', outstandingCr: 6 },
    ],
    sourceLinks: [
      { label: 'DRHP / RHP', note: 'Filed with SEBI and the stock exchanges' },
      { label: 'SEBI', note: 'Regulatory filings and observation letter' },
      { label: 'NSE / BSE', note: 'Exchange listing and disclosure pages' },
      { label: 'MCA', note: 'Registrar of Companies filings' },
      { label: 'Registrar portal', note: 'Allotment status and application tracking' },
    ],
  },
}

const tridentPapers: IpoDetail = {
  slug: 'trident-papers',
  name: 'Trident Papers Ltd',
  category: 'Mainboard',
  oneLiner: 'Industrial packaging paper manufacturing',
  logoUrl: '/Trident.png',
  isOpen: false,
  listedPrice: 389,
  listedChangePercent: 12.7,
  listedDaysAgo: 42,
  topFacts: [
    {
      tone: 'success',
      text: 'Revenue up 22%, EBITDA margin expanded 140 bps year on year',
      source: 'Verified against DRHP + MCA filing',
    },
    {
      tone: 'warning',
      text: 'Pulp and waste-paper input costs are ~60% of raw material spend',
      source: 'From DRHP, margin exposure',
    },
    {
      tone: 'success',
      text: 'Listed at a 12.7% premium to issue price and has held those gains',
      source: 'From exchange filings',
    },
  ],
  howTheyMakeMoney:
    'Trident Papers earns revenue by manufacturing and selling industrial-grade kraft paper and corrugated packaging board to FMCG, e-commerce, and export customers from two integrated pulp-and-paper mills.',
  useOfProceeds:
    '₹85 Cr of the ₹140 Cr raised funded a new paper machine at the Gujarat facility; the remainder repaid working capital debt.',
  useOfProceedsBreakdown: [
    { label: 'Capex – new paper machine (Gujarat)', amountCr: 68 },
    { label: 'General corporate purposes', amountCr: 12 },
    { label: 'Issue-related expenses', amountCr: 5 },
  ],
  strengths: [
    'Two integrated mills reduce dependence on external pulp suppliers',
    'Export order book adds a second demand channel beyond the domestic market',
    'Revenue and EBITDA margin have both improved for two consecutive years',
    'Long-standing supply relationships with FMCG and e-commerce packaging converters',
    'Conservative pricing at IPO left room for post-listing gains',
  ],
  risks: [
    { rank: 1, text: 'Pulp and waste-paper costs are ~60% of raw material spend, exposed to import price swings' },
    { rank: 2, text: 'Two mills concentrated in Gujarat and Odisha, regional disruption risk' },
    { rank: 3, text: 'Capital-intensive expansion increases near-term debt' },
    { rank: 4, text: 'Cyclical industry, demand tied to FMCG and e-commerce packaging volumes' },
  ],
  promoter: {
    name: 'Rajesh Bhansali',
    holdingPct: 54,
    context: 'Founder, retains control post-listing',
    preIssuePct: 61,
    postIssuePct: 56,
    currentHoldingPct: 54,
    background: '15 years running the family’s paper trading business before setting up Trident’s first mill in 2008',
  },
  peers: [
    { name: 'Trident Papers', pe: 19, isSubject: true },
    { name: 'JK Paper', pe: 24 },
    { name: 'Emami Paper Mills', pe: 18 },
    { name: 'Andhra Paper', pe: 11 },
  ],
  sourcesChecked: ['DRHP / RHP', 'MCA filings', 'Litigation records', 'Exchange filings'],
  verifiedSourceCount: 4,
  sampleChat: [
    { role: 'user', text: 'Why did pulp costs rise?' },
    {
      role: 'assistant',
      text: "The company's post-listing disclosures attribute higher pulp costs to global waste-paper price increases and rupee depreciation on imported pulp. It's a real cost-margin risk worth watching each quarter, not a one-off.",
      source: 'source: DRHP p.51',
    },
  ],
  illustrative: true,
  leadManager: {
    name: 'ICICI Securities',
    totalIssues: 14,
    belowIssuePriceCount: 2,
  },
  fullReport: {
    issueMechanics: {
      issueType: 'Fresh issue + Offer for sale',
      freshIssueCr: 85,
      offerForSaleCr: 55,
      priceBand: '₹338 – ₹345 per share',
      faceValue: 10,
      lotSize: 43,
      totalIssueSizeCr: 140,
    },
    applicationTiers: [
      { category: 'Retail', lotsMin: 1, sharesMin: 43, amountMin: 14835, reservationPct: 35 },
      { category: 'S-HNI', lotsMin: 7, sharesMin: 301, amountMin: 103845, reservationPct: 15 },
      { category: 'B-HNI', lotsMin: 32, sharesMin: 1376, amountMin: 474720, reservationPct: 50 },
    ],
    allocation: [
      { category: 'QIB', reservationPct: 50, subscriptionTimesX: 2.9 },
      { category: 'NII (HNI)', reservationPct: 15, subscriptionTimesX: 2.1 },
      { category: 'Retail', reservationPct: 35, subscriptionTimesX: 1.6 },
    ],
    anchor: {
      allottedCr: 42,
      lockInNote: '50% of anchor shares locked in for 30 days, remainder for 90 days from allotment',
      marqueeInvestors: ['HDFC Mutual Fund', 'ICICI Prudential Value Fund', 'Nomura India Investment Fund'],
    },
    capitalHistory: [
      { date: 'Apr 2008', event: 'Initial subscription on incorporation', shares: 800_000, pricePerShare: 10 },
      { date: 'Nov 2016', event: 'Rights issue for mill expansion', shares: 1_500_000, pricePerShare: 85 },
      { date: 'Mar 2025', event: 'Pre-IPO placement', shares: 220_000, pricePerShare: 290 },
    ],
    financials: [
      { period: 'FY23', revenueCr: 438, ebitdaCr: 60, patCr: 29, netWorthCr: 260, borrowingsCr: 110 },
      { period: 'FY24', revenueCr: 502, ebitdaCr: 74, patCr: 38, netWorthCr: 295, borrowingsCr: 128 },
      { period: 'FY25', revenueCr: 612, ebitdaCr: 98, patCr: 52, netWorthCr: 340, borrowingsCr: 145 },
    ],
    valuationRatios: {
      roePct: 15.3,
      rocePct: 17.2,
      ebitdaMarginPct: 16.0,
      patMarginPct: 8.5,
      debtToEquity: 0.43,
      epsPreIssue: 19.8,
      epsPostIssue: 18.2,
      peBasedOnPreIssueEps: 17.4,
      peBasedOnPostIssueEps: 19,
      ronwPct: 15.3,
      navPerShare: 96,
      priceToBookValue: 3.6,
    },
    extendedPeers: [
      { name: 'Trident Papers', revenueCr: 612, revenueGrowthPct: 22, patMarginPct: 8.5, ronwPct: 15.3, pe: 19, isSubject: true },
      { name: 'JK Paper', revenueCr: 3400, revenueGrowthPct: 9, patMarginPct: 9.8, ronwPct: 13.2, pe: 24 },
      { name: 'Emami Paper Mills', revenueCr: 1980, revenueGrowthPct: 7, patMarginPct: 8.9, ronwPct: 14.6, pe: 18 },
      { name: 'Andhra Paper', revenueCr: 1450, revenueGrowthPct: 5, patMarginPct: 7.1, ronwPct: 10.4, pe: 11 },
    ],
    registrar: { name: 'Link Intime India Pvt Ltd' },
    contingentLiabilities: [
      { description: 'Disputed customs duty on imported pulp (FY22)', amountCr: 4.6 },
      { description: 'Bank guarantees to state pollution control board', amountCr: 1.8 },
    ],
    borrowings: [
      { lender: 'State Bank of India', facilityType: 'Term loan (Gujarat mill expansion)', outstandingCr: 92 },
      { lender: 'Axis Bank', facilityType: 'Working capital / cash credit', outstandingCr: 53 },
    ],
    sourceLinks: [
      { label: 'DRHP / RHP', note: 'Filed with SEBI and the stock exchanges' },
      { label: 'SEBI', note: 'Regulatory filings and observation letter' },
      { label: 'NSE / BSE', note: 'Exchange listing and disclosure pages' },
      { label: 'MCA', note: 'Registrar of Companies filings' },
      { label: 'Registrar portal', note: 'Allotment status and application tracking' },
    ],
  },
  postListing: {
    updates: [
      {
        daysAgo: 5,
        type: 'earnings',
        title: 'Q1 FY27 results announced',
        detail: 'Revenue grew 14% YoY to ₹168 Cr; EBITDA margin expanded 60 bps on lower pulp costs.',
      },
      {
        daysAgo: 18,
        type: 'dividend',
        title: 'Interim dividend declared',
        detail: 'Board approved a ₹2.50 per share interim dividend, record date 25 Jun 2026.',
      },
      {
        daysAgo: 34,
        type: 'board-decision',
        title: 'New independent director appointed',
        detail: 'Board inducted a new independent director to strengthen the audit committee.',
      },
    ],
    insiderActivity: [
      { daysAgo: 9, type: 'bulk-deal', description: 'Promoter group sold 1.1% stake via bulk deal on NSE' },
      { daysAgo: 22, type: 'block-deal', description: 'HDFC Mutual Fund acquired 0.9% stake via block deal on BSE' },
    ],
  },
}

const vantageDairies: IpoDetail = {
  slug: 'vantage-dairies',
  name: 'Vantage Dairies Ltd',
  category: 'SME',
  oneLiner: 'Packaged dairy and value-added milk products',
  logoUrl: '/vantage.png',
  isOpen: true,
  closesInDays: 4,
  minInvestment: 11920,
  topFacts: [
    {
      tone: 'success',
      text: 'Revenue up 31%, profit up 52% year on year',
      source: 'Verified against DRHP + MCA filing',
    },
    {
      tone: 'warning',
      text: 'Raw milk procurement is ~68% of revenue',
      source: 'From DRHP, margin exposure',
    },
    {
      tone: 'warning',
      text: 'Over 70% of sales concentrated in Maharashtra and Gujarat',
      source: 'From DRHP, concentration risk',
    },
  ],
  howTheyMakeMoney:
    'Vantage Dairies sells packaged milk, curd, paneer, and ghee to retail and quick-commerce channels, sourcing raw milk from a contracted network of dairy farmers across Maharashtra and Gujarat.',
  useOfProceeds: '₹26 Cr of the ₹42 Cr raised goes to a new milk processing plant in Nashik.',
  useOfProceedsBreakdown: [
    { label: 'Capex – new processing plant (Nashik)', amountCr: 26 },
    { label: 'Working capital', amountCr: 10 },
    { label: 'General corporate purposes', amountCr: 4 },
    { label: 'Issue-related expenses', amountCr: 2 },
  ],
  strengths: [
    'Contracted farmer-sourcing network reduces dependence on open-market milk procurement',
    'Diversified product mix across milk, curd, paneer, and ghee reduces reliance on any single SKU',
    'Cold-chain distribution network supports same-day delivery across key metros',
    'Revenue and profit have grown together for three consecutive years',
  ],
  risks: [
    { rank: 1, text: 'Raw milk costs ~68% of revenue, exposed to seasonal and monsoon-driven price swings' },
    { rank: 2, text: 'Sales concentrated in Maharashtra and Gujarat, regional demand risk' },
    { rank: 3, text: 'Perishable inventory increases wastage and spoilage risk' },
    { rank: 4, text: 'Competitive category with both organized and unorganized dairy players' },
  ],
  promoter: {
    name: 'Suresh Patil',
    holdingPct: 58,
    context: 'Founder, retains control post-listing',
    preIssuePct: 64,
    postIssuePct: 58,
    background: '20 years in dairy cooperative operations before founding Vantage Dairies in 2011',
  },
  peers: [
    { name: 'Vantage Dairies', pe: 13, isSubject: true },
    { name: 'Hatsun Agro Product', pe: 38 },
    { name: 'Heritage Foods', pe: 22 },
    { name: 'Parag Milk Foods', pe: 19 },
  ],
  sourcesChecked: ['DRHP / RHP', 'MCA filings', 'Litigation records'],
  verifiedSourceCount: 3,
  sampleChat: [
    { role: 'user', text: 'Why is raw milk cost so high?' },
    {
      role: 'assistant',
      text: "Raw milk is the single largest input cost for any dairy processor, and the DRHP shows Vantage sources it from contracted farmers rather than owning cattle directly — so procurement is exposed to seasonal supply and price swings, especially during summer months when milk yield drops.",
      source: 'source: DRHP p.44',
    },
  ],
  illustrative: true,
  leadManager: {
    name: 'GYR Capital Advisors',
    totalIssues: 10,
    belowIssuePriceCount: 1,
  },
  fullReport: {
    issueMechanics: {
      issueType: 'Fresh issue only',
      freshIssueCr: 42,
      offerForSaleCr: 0,
      priceBand: '₹145 – ₹149 per share',
      faceValue: 10,
      lotSize: 80,
      totalIssueSizeCr: 42,
    },
    applicationTiers: [
      { category: 'Retail', lotsMin: 1, sharesMin: 80, amountMin: 11920, reservationPct: 35 },
      { category: 'S-HNI', lotsMin: 14, sharesMin: 1120, amountMin: 166880, reservationPct: 15 },
      { category: 'B-HNI', lotsMin: 68, sharesMin: 5440, amountMin: 810560, reservationPct: 50 },
    ],
    allocation: [
      { category: 'QIB', reservationPct: 50, subscriptionTimesX: 2.1 },
      { category: 'NII (HNI)', reservationPct: 15, subscriptionTimesX: 2.8 },
      { category: 'Retail', reservationPct: 35, subscriptionTimesX: 1.6 },
    ],
    anchor: {
      allottedCr: 12.6,
      lockInNote: '50% of anchor shares locked in for 30 days, remainder for 90 days from allotment',
      marqueeInvestors: ['Quant Small Cap Fund', 'Sundaram Mutual Fund', 'Bandhan AMC'],
    },
    capitalHistory: [
      { date: 'Jun 2011', event: 'Initial subscription on incorporation', shares: 40_000, pricePerShare: 10 },
      { date: 'Aug 2020', event: 'Series A allotment', shares: 150_000, pricePerShare: 95 },
      { date: 'Feb 2025', event: 'Pre-IPO placement', shares: 48_000, pricePerShare: 128 },
    ],
    financials: [
      { period: 'FY23', revenueCr: 145, ebitdaCr: 11.5, patCr: 4.3, netWorthCr: 26, borrowingsCr: 20 },
      { period: 'FY24', revenueCr: 172, ebitdaCr: 14.8, patCr: 5.9, netWorthCr: 33, borrowingsCr: 23 },
      { period: 'FY25', revenueCr: 226, ebitdaCr: 20, patCr: 9, netWorthCr: 44, borrowingsCr: 27 },
    ],
    valuationRatios: {
      roePct: 20.5,
      rocePct: 23,
      ebitdaMarginPct: 8.8,
      patMarginPct: 4,
      debtToEquity: 0.61,
      epsPreIssue: 13.6,
      epsPostIssue: 11.9,
      peBasedOnPreIssueEps: 11,
      peBasedOnPostIssueEps: 13,
      ronwPct: 20.5,
      navPerShare: 58,
      priceToBookValue: 2.6,
    },
    extendedPeers: [
      { name: 'Vantage Dairies', revenueCr: 226, revenueGrowthPct: 31, patMarginPct: 4, ronwPct: 20.5, pe: 13, isSubject: true },
      { name: 'Hatsun Agro Product', revenueCr: 9200, revenueGrowthPct: 9, patMarginPct: 5.8, ronwPct: 16.4, pe: 38 },
      { name: 'Heritage Foods', revenueCr: 3400, revenueGrowthPct: 7, patMarginPct: 3.9, ronwPct: 13.2, pe: 22 },
      { name: 'Parag Milk Foods', revenueCr: 2650, revenueGrowthPct: 11, patMarginPct: 3.1, ronwPct: 11.8, pe: 19 },
    ],
    registrar: { name: 'Cameo Corporate Services Ltd' },
    contingentLiabilities: [
      { description: 'Disputed VAT demand (FY21)', amountCr: 1.2 },
      { description: 'Bank guarantees to milk cooperative societies', amountCr: 0.8 },
    ],
    borrowings: [
      { lender: 'State Bank of India', facilityType: 'Term loan (processing plant capex)', outstandingCr: 18 },
      { lender: 'Punjab National Bank', facilityType: 'Working capital / cash credit', outstandingCr: 9 },
    ],
    sourceLinks: [
      { label: 'DRHP / RHP', note: 'Filed with SEBI and the stock exchanges' },
      { label: 'SEBI', note: 'Regulatory filings and observation letter' },
      { label: 'NSE / BSE', note: 'Exchange listing and disclosure pages' },
      { label: 'MCA', note: 'Registrar of Companies filings' },
      { label: 'Registrar portal', note: 'Allotment status and application tracking' },
    ],
  },
}

const solaceWellness: IpoDetail = {
  slug: 'solace-wellness',
  name: 'Solace Wellness Ltd',
  category: 'Mainboard',
  oneLiner: 'Ayurvedic and wellness consumer products',
  logoUrl: '/Solace.png',
  isOpen: false,
  listedPrice: 245,
  listedChangePercent: 5.2,
  listedDaysAgo: 10,
  topFacts: [
    {
      tone: 'success',
      text: 'Revenue up 26%, profit up 35% year on year',
      source: 'Verified against DRHP + MCA filing',
    },
    {
      tone: 'success',
      text: 'Direct-to-consumer channel now ~22% of revenue, up from 9%',
      source: 'From DRHP',
    },
    {
      tone: 'warning',
      text: 'Advertising spend rose faster than revenue this year',
      source: 'From DRHP',
    },
  ],
  howTheyMakeMoney:
    'Solace Wellness manufactures and sells ayurvedic personal care, nutraceutical, and wellness products through general trade, modern retail, and e-commerce channels.',
  useOfProceeds: '₹55 Cr of the ₹95 Cr raised goes to a new manufacturing unit in Baddi, Himachal Pradesh.',
  useOfProceedsBreakdown: [
    { label: 'Capex – new manufacturing unit (Baddi, HP)', amountCr: 55 },
    { label: 'Brand & marketing expansion', amountCr: 20 },
    { label: 'General corporate purposes', amountCr: 15 },
    { label: 'Issue-related expenses', amountCr: 5 },
  ],
  strengths: [
    'Established ayurvedic brand with two decades of consumer trust',
    'Direct-to-consumer channel growing faster than overall revenue, improving margins',
    'Backward-integrated manufacturing reduces third-party contract-manufacturing dependence',
    'Diversified portfolio across personal care, nutraceuticals, and wellness categories',
    'Revenue and profit have grown together for three consecutive years',
  ],
  risks: [
    { rank: 1, text: 'Advertising and brand-building spend rising faster than revenue' },
    { rank: 2, text: 'Ayurvedic category faces increasing competition from larger FMCG entrants' },
    { rank: 3, text: 'Raw material sourcing depends on seasonal agricultural inputs' },
    { rank: 4, text: 'Regulatory scrutiny on ayurvedic product claims and labeling' },
  ],
  promoter: {
    name: 'Meera Krishnan',
    holdingPct: 51,
    context: 'Founder, retains control post-listing',
    preIssuePct: 58,
    postIssuePct: 52,
    currentHoldingPct: 51,
    background: '18 years building ayurvedic product lines before founding Solace Wellness in 2007',
  },
  peers: [
    { name: 'Solace Wellness', pe: 24, isSubject: true },
    { name: 'Dabur India', pe: 45 },
    { name: 'Emami Ltd', pe: 32 },
    { name: 'Zydus Wellness', pe: 28 },
  ],
  sourcesChecked: ['DRHP / RHP', 'MCA filings', 'SEBI orders', 'Exchange filings'],
  verifiedSourceCount: 4,
  sampleChat: [
    { role: 'user', text: 'Why did advertising spend rise faster than revenue?' },
    {
      role: 'assistant',
      text: "The company's post-IPO disclosures attribute this to a national ad campaign launched ahead of festive season demand. It's a near-term margin drag flagged in the filing, not described as a structural issue.",
      source: 'source: DRHP p.58',
    },
  ],
  illustrative: true,
  leadManager: {
    name: 'Equirus Capital',
    totalIssues: 16,
    belowIssuePriceCount: 3,
  },
  fullReport: {
    issueMechanics: {
      issueType: 'Fresh issue + Offer for sale',
      freshIssueCr: 95,
      offerForSaleCr: 40,
      priceBand: '₹228 – ₹233 per share',
      faceValue: 5,
      lotSize: 64,
      totalIssueSizeCr: 135,
    },
    applicationTiers: [
      { category: 'Retail', lotsMin: 1, sharesMin: 64, amountMin: 14912, reservationPct: 35 },
      { category: 'S-HNI', lotsMin: 14, sharesMin: 896, amountMin: 208768, reservationPct: 15 },
      { category: 'B-HNI', lotsMin: 68, sharesMin: 4352, amountMin: 1014016, reservationPct: 50 },
    ],
    allocation: [
      { category: 'QIB', reservationPct: 50, subscriptionTimesX: 3.4 },
      { category: 'NII (HNI)', reservationPct: 15, subscriptionTimesX: 2.6 },
      { category: 'Retail', reservationPct: 35, subscriptionTimesX: 1.9 },
    ],
    anchor: {
      allottedCr: 28.5,
      lockInNote: '50% of anchor shares locked in for 30 days, remainder for 90 days from allotment',
      marqueeInvestors: ['Nippon India Growth Fund', 'Mirae Asset Mutual Fund', 'Abu Dhabi Investment Authority'],
    },
    capitalHistory: [
      { date: 'Mar 2007', event: 'Initial subscription on incorporation', shares: 100_000, pricePerShare: 5 },
      { date: 'Oct 2017', event: 'Series B allotment', shares: 280_000, pricePerShare: 145 },
      { date: 'Jan 2025', event: 'Pre-IPO placement', shares: 62_000, pricePerShare: 205 },
    ],
    financials: [
      { period: 'FY23', revenueCr: 310, ebitdaCr: 52, patCr: 28, netWorthCr: 190, borrowingsCr: 35 },
      { period: 'FY24', revenueCr: 360, ebitdaCr: 64, patCr: 35, netWorthCr: 224, borrowingsCr: 30 },
      { period: 'FY25', revenueCr: 454, ebitdaCr: 86, patCr: 47, netWorthCr: 268, borrowingsCr: 24 },
    ],
    valuationRatios: {
      roePct: 17.5,
      rocePct: 19.8,
      ebitdaMarginPct: 18.9,
      patMarginPct: 10.4,
      debtToEquity: 0.09,
      epsPreIssue: 10.6,
      epsPostIssue: 9.7,
      peBasedOnPreIssueEps: 22,
      peBasedOnPostIssueEps: 24,
      ronwPct: 17.5,
      navPerShare: 92,
      priceToBookValue: 2.5,
    },
    extendedPeers: [
      { name: 'Solace Wellness', revenueCr: 454, revenueGrowthPct: 26, patMarginPct: 10.4, ronwPct: 17.5, pe: 24, isSubject: true },
      { name: 'Dabur India', revenueCr: 11200, revenueGrowthPct: 7, patMarginPct: 15.2, ronwPct: 19.8, pe: 45 },
      { name: 'Emami Ltd', revenueCr: 3700, revenueGrowthPct: 6, patMarginPct: 18.4, ronwPct: 24.1, pe: 32 },
      { name: 'Zydus Wellness', revenueCr: 1950, revenueGrowthPct: 9, patMarginPct: 11.6, ronwPct: 13.4, pe: 28 },
    ],
    registrar: { name: 'MUFG Intime India Pvt Ltd' },
    contingentLiabilities: [
      { description: 'Disputed income tax demand (AY 2022-23)', amountCr: 3.4 },
      { description: 'Corporate guarantee for subsidiary credit facility', amountCr: 2.1 },
    ],
    borrowings: [
      { lender: 'HDFC Bank', facilityType: 'Working capital / cash credit', outstandingCr: 14 },
      { lender: 'Axis Bank', facilityType: 'Term loan (Baddi manufacturing unit)', outstandingCr: 10 },
    ],
    sourceLinks: [
      { label: 'DRHP / RHP', note: 'Filed with SEBI and the stock exchanges' },
      { label: 'SEBI', note: 'Regulatory filings and observation letter' },
      { label: 'NSE / BSE', note: 'Exchange listing and disclosure pages' },
      { label: 'MCA', note: 'Registrar of Companies filings' },
      { label: 'Registrar portal', note: 'Allotment status and application tracking' },
    ],
  },
  postListing: {
    updates: [
      {
        daysAgo: 6,
        type: 'earnings',
        title: 'Q1 FY27 results announced',
        detail: 'Revenue grew 19% YoY to ₹128 Cr; EBITDA margin expanded 40 bps on DTC channel mix.',
      },
    ],
    insiderActivity: [
      { daysAgo: 8, type: 'block-deal', description: 'Promoter group sold 0.6% stake via block deal on NSE' },
    ],
  },
}

export const ipoDetails: Record<string, IpoDetail> = {
  zappfresh,
  'orbit-logistics': orbitLogistics,
  'nimbus-cloud': nimbusCloud,
  'trident-papers': tridentPapers,
  'vantage-dairies': vantageDairies,
  'solace-wellness': solaceWellness,
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
    isOpen: false,
  },
  tridentPapers,
  vantageDairies,
  solaceWellness,
]

function genericIpoDetail(summary: IpoSummary): IpoDetail {
  return {
    ...summary,
    topFacts: [
      { tone: 'warning', text: 'Detailed facts not yet verified for this IPO', source: 'Sample placeholder' },
    ],
    howTheyMakeMoney: 'Business model detail not included in this prototype sample.',
    useOfProceeds: 'Use of proceeds detail not included in this prototype sample.',
    useOfProceedsBreakdown: [],
    strengths: [],
    risks: [{ rank: 1, text: 'Risk detail not included in this prototype sample' }],
    promoter: { name: 'Not available', holdingPct: 0, context: 'Not included in this prototype sample' },
    peers: [{ name: summary.name, pe: 0, isSubject: true }],
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
