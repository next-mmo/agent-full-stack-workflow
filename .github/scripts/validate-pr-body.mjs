const author = process.env.PR_AUTHOR ?? ''
const title = process.env.PR_TITLE ?? ''
const body = process.env.PR_BODY ?? ''

const isDependabot = author === 'dependabot[bot]'
const isDependencyTitle = /^chore\(deps(?:-dev)?\):\s+bump\b/i.test(title)

if (isDependabot) {
  if (!isDependencyTitle) {
    console.error(
      'Dependabot-authored PR does not match the approved dependency-update title pattern.',
    )
    process.exit(1)
  }

  console.log(
    'Verified Dependabot dependency PR: human PR-body evidence sections are not required. Normal CI, security checks, and human approval still apply.',
  )
  process.exit(0)
}

const requiredSections = [
  'Summary',
  'Links / source context',
  'AI assistance',
  'Architecture impact',
  'Validation',
  'Database impact',
  'Security / privacy impact',
  'Dependency / supply-chain impact',
  'Release / operations impact',
  'Risk',
  'Rollback plan',
  'Human review',
]

const missing = requiredSections.filter((section) => {
  const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const heading = new RegExp(`^##\\s+${escaped}(?:\\s|$)`, 'im')
  return !heading.test(body)
})

if (missing.length > 0) {
  console.error(
    `Pull request is missing required evidence section(s): ${missing.join(', ')}`,
  )
  process.exit(1)
}

if (body.length < 400) {
  console.error('Pull request description is too short to be review-ready.')
  process.exit(1)
}

const unresolvedTemplatePrompts = [
  'Describe what changed and why.',
  'Explain any module/service boundary',
  'Explain how to safely revert',
]

const unresolved = unresolvedTemplatePrompts.filter((prompt) => body.includes(prompt))

if (unresolved.length > 0) {
  console.error(
    'Pull request still contains unresolved template instructions. Replace them with real evidence or N/A with rationale.',
  )
  process.exit(1)
}

console.log('Pull request enterprise evidence sections are present.')
