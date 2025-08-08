export interface UploadResponse {
  success: boolean
  hash: string
  message?: string
  filename?: string
  existing?: boolean
}

export async function uploadAudio(file: File, caseName?: string): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('audio', file)
  if (caseName) formData.append('case_name', caseName)

  const res = await fetch('http://localhost:5001/api/audio/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }

  return res.json()
}
