const body = process.env.PR_BODY ?? ''

const requiredSections = [
  'Summary',
  'AI assistance',
  'Validation',
  'Database impact',
  'Security impact',
  'Risk',
  'Rollback',
  'Human review',
]

const missing = requiredSections.filter((section) => {
  const heading = new RegExp(`^##\\s+${section}(?:\\s|$)`, 'im')
  return !heading.test(body)
})

if (missing.length > 0) {
  console.error(
    `Pull request is missing required evidence section(s): ${missing.join(', ')}`,
  )
  process.exit(1)
}

if (body.length < 200) {
  console.error('Pull request description is too short to be review-ready.')
  process.exit(1)
}

console.log('Pull request evidence sections are present.')
