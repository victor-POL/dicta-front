const caseMap = new Map<string, string>()

export function setCaseId(hash: string, caseId: string) {
  caseMap.set(hash, caseId)
}

export function getCaseId(hash: string): string | undefined {
  return caseMap.get(hash)
}
