import type { ReactNode } from 'react'
import type { FullReportData, IpoDetail } from '../../types'
import { formatInr, isIpoListed } from '../../lib/ipoFormat'
import { getIpoFullTimeline, formatEventDate, dateDaysAgo } from '../../lib/ipoEvents'
import { PhaseTag } from '../../components/PhaseTag'

function formatCr(value: number): string {
  return `₹${value.toLocaleString('en-IN')} Cr`
}

const ACTIVITY_LABEL: Record<string, string> = {
  'bulk-deal': 'Bulk deal',
  'block-deal': 'Block deal',
  'insider-trade': 'Insider trade',
}

/**
 * Every answer is derived from the same `fullReport` data used elsewhere in this
 * tab (and by the chatbot's matching keyword branches) so the FAQ can never
 * drift out of sync with facts shown on other tabs.
 */
function buildFaqs(ipo: IpoDetail, report: FullReportData): { question: string; answer: string }[] {
  const shortName = ipo.name.split(' (')[0]
  const faqs: { question: string; answer: string }[] = [
    {
      question: `What is the price band for the ${shortName} IPO?`,
      answer: `The price band is ${report.issueMechanics.priceBand}.`,
    },
  ]

  const retailTier = report.applicationTiers.find((t) => t.category === 'Retail')
  if (retailTier) {
    faqs.push({
      question: 'What is the minimum lot size and investment required?',
      answer: `The minimum retail application is ${retailTier.lotsMin} lot of ${retailTier.sharesMin} shares, amounting to ${formatInr(retailTier.amountMin)}.`,
    })
  }

  const timeline = getIpoFullTimeline(ipo)
  const listingStep = timeline?.find((s) => s.label === 'Listing date')
  faqs.push({
    question: 'When does the IPO list on the exchange?',
    answer: listingStep
      ? `The tentative listing date is ${formatEventDate(listingStep.date)}.`
      : `${shortName} is no longer open for bidding, so a forward listing date isn't applicable here.`,
  })

  faqs.push({
    question: `What P/E is the ${shortName} IPO priced at?`,
    answer: `Based on post-issue EPS, the issue is priced at ${report.valuationRatios.peBasedOnPostIssueEps}x P/E.`,
  })

  faqs.push({
    question: 'What is the face value of each share?',
    answer: `Each equity share has a face value of ${formatInr(report.issueMechanics.faceValue)}.`,
  })

  return faqs
}

function Section({ title, children, sourceLabel }: { title: string; children: ReactNode; sourceLabel?: string }) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xl font-semibold text-heading">{title}</p>
        <PhaseTag variant="fact" label={sourceLabel} />
      </div>
      {children}
    </section>
  )
}

function KeyValueGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-4 bg-surface px-4 py-3">
          <span className="text-sm text-ink-muted">{item.label}</span>
          <span className="text-sm font-medium text-ink">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="bg-surface-sunken">
            {head.map((h, i) => (
              <th
                key={h}
                className={`label-caps px-4 py-2.5 font-medium text-ink-faint ${i === 0 ? 'text-left' : 'text-right'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-line bg-surface">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 text-ink ${j === 0 ? 'font-medium' : 'text-right text-ink-muted'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FullReportTab({ ipo }: { ipo: IpoDetail }) {
  const report = ipo.fullReport

  if (!report) {
    return (
      <div className="rounded-card border border-line bg-surface-sunken px-5 py-12 text-center">
        <p className="text-sm text-ink-muted">Full research report not yet available for this IPO in the prototype.</p>
      </div>
    )
  }

  const timeline = getIpoFullTimeline(ipo)
  const faqs = buildFaqs(ipo, report)
  const { issueMechanics, applicationTiers, allocation, anchor, capitalHistory, financials, valuationRatios, extendedPeers, registrar, contingentLiabilities, borrowings, sourceLinks } = report

  return (
    <div className="space-y-8">
      <Section title="Issue mechanics">
        <KeyValueGrid
          items={[
            { label: 'Issue type', value: issueMechanics.issueType },
            { label: 'Fresh issue', value: formatCr(issueMechanics.freshIssueCr) },
            { label: 'Offer for sale', value: formatCr(issueMechanics.offerForSaleCr) },
            { label: 'Price band', value: issueMechanics.priceBand },
            { label: 'Face value', value: formatInr(issueMechanics.faceValue) },
            { label: 'Lot size', value: `${issueMechanics.lotSize} shares` },
            { label: 'Total issue size', value: formatCr(issueMechanics.totalIssueSizeCr) },
          ]}
        />
      </Section>

      {ipo.useOfProceedsBreakdown.length > 0 && (
        <Section title="Use of proceeds breakdown">
          <DataTable
            head={['Bucket', 'Amount']}
            rows={ipo.useOfProceedsBreakdown.map((b) => [b.label, formatCr(b.amountCr)])}
          />
        </Section>
      )}

      <Section title="Full timeline">
        {timeline ? (
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            {timeline.map((step, i) => (
              <div
                key={step.label}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${i !== timeline.length - 1 ? 'border-b border-line' : ''}`}
              >
                <span className="text-sm text-ink">{step.label}</span>
                <span className="text-sm font-medium text-ink-muted">{formatEventDate(step.date)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-line bg-surface-sunken px-5 py-6 text-center text-sm text-ink-muted">
            This IPO is no longer open, so a live application timeline isn&rsquo;t applicable.
          </p>
        )}
      </Section>

      <Section title="Application tiers">
        <DataTable
          head={['Category', 'Min lots', 'Min shares', 'Min amount', 'Reservation']}
          rows={applicationTiers.map((t) => [
            t.category,
            t.lotsMin,
            t.sharesMin.toLocaleString('en-IN'),
            formatInr(t.amountMin),
            `${t.reservationPct}%`,
          ])}
        />
      </Section>

      <Section title="Allocation & anchor details">
        <div className="space-y-4">
          <DataTable
            head={['Category', 'Reservation', 'Subscribed']}
            rows={allocation.map((a) => [
              a.category,
              `${a.reservationPct}%`,
              typeof a.subscriptionTimesX === 'number' ? `${a.subscriptionTimesX}x` : '—',
            ])}
          />
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-sm text-ink">
              <span className="font-medium">{formatCr(anchor.allottedCr)}</span> allotted to anchor investors ahead of
              the issue opening.
            </p>
            <p className="mt-1.5 text-sm text-ink-muted">{anchor.lockInNote}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {anchor.marqueeInvestors.map((investor) => (
                <span key={investor} className="label-caps rounded-pill bg-surface-sunken px-2.5 py-1 text-ink-muted">
                  {investor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Capital history">
        <DataTable
          head={['Date', 'Event', 'Shares issued', 'Price / share']}
          rows={capitalHistory.map((c) => [
            c.date,
            c.event,
            c.shares.toLocaleString('en-IN'),
            formatInr(c.pricePerShare),
          ])}
        />
        <p className="mt-2 text-xs text-ink-faint">
          Promoter acquisition cost vs. issue price: earliest allotment at {formatInr(capitalHistory[0]?.pricePerShare ?? 0)}{' '}
          per share against an issue price band of {issueMechanics.priceBand}.
        </p>
      </Section>

      <Section title="Full financials (multi-year)">
        <DataTable
          head={['Period', 'Revenue', 'EBITDA', 'PAT', 'Net worth', 'Borrowings']}
          rows={financials.map((f) => [
            f.period,
            formatCr(f.revenueCr),
            formatCr(f.ebitdaCr),
            formatCr(f.patCr),
            formatCr(f.netWorthCr),
            formatCr(f.borrowingsCr),
          ])}
        />
      </Section>

      <Section title="Valuation ratios">
        <KeyValueGrid
          items={[
            { label: 'ROE', value: `${valuationRatios.roePct}%` },
            { label: 'ROCE', value: `${valuationRatios.rocePct}%` },
            { label: 'EBITDA margin', value: `${valuationRatios.ebitdaMarginPct}%` },
            { label: 'PAT margin', value: `${valuationRatios.patMarginPct}%` },
            { label: 'Debt / equity', value: `${valuationRatios.debtToEquity}x` },
            { label: 'EPS (pre-issue)', value: formatInr(valuationRatios.epsPreIssue) },
            { label: 'EPS (post-issue)', value: formatInr(valuationRatios.epsPostIssue) },
            { label: 'P/E (pre-issue EPS)', value: `${valuationRatios.peBasedOnPreIssueEps}x` },
            { label: 'P/E (post-issue EPS)', value: `${valuationRatios.peBasedOnPostIssueEps}x` },
            { label: 'RoNW', value: `${valuationRatios.ronwPct}%` },
            { label: 'NAV per share', value: formatInr(valuationRatios.navPerShare) },
            { label: 'P/BV', value: `${valuationRatios.priceToBookValue}x` },
          ]}
        />
      </Section>

      <Section title="Extended peer comparison">
        <DataTable
          head={['Company', 'Revenue', 'PAT margin', 'RoNW', 'P/E']}
          rows={extendedPeers.map((p) => [
            p.isSubject ? `${p.name} (this IPO)` : p.name,
            formatCr(p.revenueCr),
            `${p.patMarginPct}%`,
            `${p.ronwPct}%`,
            `${p.pe}x`,
          ])}
        />
      </Section>

      <Section title="Lead manager & registrar">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="label-caps mb-2 text-ink-faint">Book running lead manager</p>
            <p className="font-medium text-ink">{ipo.leadManager?.name ?? 'Not disclosed'}</p>
            {ipo.leadManager && (
              <p className="mt-1 text-sm text-ink-muted">
                {`${ipo.leadManager.belowIssuePriceCount} of ${ipo.leadManager.totalIssues} issues led in the past 3 years (${Math.round((ipo.leadManager.belowIssuePriceCount / ipo.leadManager.totalIssues) * 100)}%) closed below issue price on listing day.`}
              </p>
            )}
          </div>
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="label-caps mb-2 text-ink-faint">Registrar to the issue</p>
            <p className="font-medium text-ink">{registrar.name}</p>
          </div>
        </div>
      </Section>

      <Section title="Contingent liabilities & borrowings">
        <div className="space-y-4">
          <DataTable
            head={['Contingent liability', 'Amount']}
            rows={contingentLiabilities.map((c) => [c.description, formatCr(c.amountCr)])}
          />
          <DataTable
            head={['Lender', 'Facility', 'Outstanding']}
            rows={borrowings.map((b) => [b.lender, b.facilityType, formatCr(b.outstandingCr)])}
          />
        </div>
      </Section>

      <Section title="Official source links">
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          {sourceLinks.map((link, i) => (
            <div
              key={link.label}
              className={`flex items-center justify-between gap-4 px-4 py-3 ${i !== sourceLinks.length - 1 ? 'border-b border-line' : ''}`}
            >
              <span className="text-sm font-medium text-ink">{link.label}</span>
              <span className="text-sm text-ink-muted">{link.note}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-faint">
          Reference categories shown for this prototype — the production app links directly to each filing.
        </p>
      </Section>

      {isIpoListed(ipo) && ipo.postListing && (
        <>
          <Section title="Post-listing shareholding & insider activity" sourceLabel="From exchange filings">
            {ipo.postListing.insiderActivity.length === 0 ? (
              <p className="rounded-card border border-line bg-surface-sunken px-5 py-6 text-center text-sm text-ink-muted">
                No bulk deals, block deals, or insider trades reported since listing.
              </p>
            ) : (
              <div className="overflow-hidden rounded-card border border-line bg-surface">
                {ipo.postListing.insiderActivity.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start justify-between gap-4 px-4 py-3 ${
                      i !== ipo.postListing!.insiderActivity.length - 1 ? 'border-b border-line' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm text-ink">{item.description}</p>
                      <p className="label-caps mt-1 text-ink-faint">{ACTIVITY_LABEL[item.type]}</p>
                    </div>
                    <span className="shrink-0 text-sm text-ink-muted">{formatEventDate(dateDaysAgo(item.daysAgo))}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Material company updates" sourceLabel="From exchange filings">
            {ipo.postListing.updates.length === 0 ? (
              <p className="rounded-card border border-line bg-surface-sunken px-5 py-6 text-center text-sm text-ink-muted">
                No company-specific updates reported since listing.
              </p>
            ) : (
              <div className="space-y-3">
                {ipo.postListing.updates.map((update, i) => (
                  <div key={i} className="rounded-card border border-line bg-surface p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-ink">{update.title}</p>
                      <span className="shrink-0 text-xs text-ink-faint">{formatEventDate(dateDaysAgo(update.daysAgo))}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink-muted">{update.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </>
      )}

      <Section title="Frequently asked questions">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-card border border-line bg-surface p-4">
              <p className="font-medium text-ink">{faq.question}</p>
              <p className="mt-1.5 text-sm text-ink-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
