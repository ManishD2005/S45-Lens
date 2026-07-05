import type { IpoDetail } from '../types'
import { formatInr } from './ipoFormat'
import { formatEventDate, getIpoFullTimeline } from './ipoEvents'

const ADVICE_TRIGGERS = ['should i invest', 'should i apply', 'worth buying', 'is it a buy', 'guaranteed']

export function mockAssistantReply(question: string, ipo: IpoDetail): { text: string; source?: string } {
  const q = question.toLowerCase()

  if (ADVICE_TRIGGERS.some((phrase) => q.includes(phrase)) || (q.includes('invest') && q.includes('should'))) {
    return {
      text: `I can only help you understand verified facts about ${ipo.name} — I can't tell you whether to invest. Try asking about revenue growth, risks, use of proceeds, or the promoter.`,
    }
  }

  // These factual lookups mirror the Full Report tab's FAQ — both read from
  // `ipo.fullReport`, so the answers can never drift apart.
  if (q.includes('price band') || q.includes('price range')) {
    return ipo.fullReport
      ? { text: `The price band is ${ipo.fullReport.issueMechanics.priceBand}.`, source: 'source: DRHP' }
      : { text: `Price band details aren't available for ${ipo.name} in this prototype.` }
  }

  if (q.includes('lot size') || q.includes('minimum investment') || q.includes('min investment') || q.includes('how many shares')) {
    const retailTier = ipo.fullReport?.applicationTiers.find((t) => t.category === 'Retail')
    return retailTier
      ? {
          text: `The minimum retail application is ${retailTier.lotsMin} lot of ${retailTier.sharesMin} shares, amounting to ${formatInr(retailTier.amountMin)}.`,
          source: 'source: DRHP',
        }
      : { text: `Lot size details aren't available for ${ipo.name} in this prototype.` }
  }

  if (q.includes('listing date') || q.includes('when does it list') || q.includes('when will it list') || q.includes('when does the ipo list')) {
    const listingStep = getIpoFullTimeline(ipo)?.find((s) => s.label === 'Listing date')
    return listingStep
      ? { text: `The tentative listing date is ${formatEventDate(listingStep.date)}.`, source: 'source: exchange timeline' }
      : { text: `${ipo.name} is no longer open for bidding, so a forward listing date isn't applicable.` }
  }

  if (q.includes('p/e') || q.includes('pe ratio') || q.includes('price to earnings') || q.includes('price-to-earnings')) {
    return ipo.fullReport
      ? {
          text: `Based on post-issue EPS, ${ipo.name} is priced at ${ipo.fullReport.valuationRatios.peBasedOnPostIssueEps}x P/E.`,
          source: 'source: DRHP',
        }
      : { text: `P/E details aren't available for ${ipo.name} in this prototype.` }
  }

  if (q.includes('face value')) {
    return ipo.fullReport
      ? { text: `Each equity share has a face value of ${formatInr(ipo.fullReport.issueMechanics.faceValue)}.`, source: 'source: DRHP' }
      : { text: `Face value details aren't available for ${ipo.name} in this prototype.` }
  }

  if (q.includes('chicken') || q.includes('concentration')) {
    const fact = ipo.topFacts.find((f) => f.text.toLowerCase().includes('chicken') || f.text.toLowerCase().includes('client'))
    return {
      text: fact
        ? `${fact.text}. This is a concentration risk — if that one line of business is disrupted, a large share of revenue is exposed at once.`
        : `${ipo.name}'s DRHP flags a concentration risk in its top facts — see the Summary tab for the specific figure.`,
      source: ipo.sampleChat.find((m) => m.role === 'assistant')?.source ?? 'source: DRHP',
    }
  }

  if (q.includes('debt') || q.includes('tax')) {
    const dangerFact = ipo.topFacts.find((f) => f.tone === 'danger')
    return {
      text: dangerFact ? dangerFact.text : `No outstanding debt or tax disputes are highlighted in ${ipo.name}'s top facts.`,
      source: 'source: DRHP',
    }
  }

  if (q.includes('revenue') || q.includes('profit') || q.includes('growth') || q.includes('pat')) {
    const growthFact = ipo.topFacts.find((f) => f.tone === 'success')
    return {
      text: growthFact ? growthFact.text : `Revenue and profit figures for ${ipo.name} are on the Summary tab.`,
      source: 'source: DRHP + MCA filing',
    }
  }

  if (q.includes('promoter') || q.includes('founder') || q.includes('holding')) {
    return {
      text: `${ipo.promoter.name} — holds ~${ipo.promoter.holdingPct}% of ${ipo.name}. ${ipo.promoter.context}.`,
      source: 'source: DRHP',
    }
  }

  if (q.includes('proceeds') || q.includes('use of') || q.includes('money') || q.includes('raise')) {
    return { text: ipo.useOfProceeds, source: 'source: DRHP' }
  }

  if (q.includes('risk')) {
    const top = ipo.risks[0]
    return {
      text: top
        ? `The highest-ranked risk for ${ipo.name} is: ${top.text}. See the Deep dive tab for the full ranked list.`
        : `Risk detail is not available for ${ipo.name} in this prototype.`,
      source: 'source: DRHP',
    }
  }

  return {
    text: `I don't have a verified answer for that yet in ${ipo.name}'s DRHP. Try asking about revenue, risks, use of proceeds, or the promoter.`,
  }
}
