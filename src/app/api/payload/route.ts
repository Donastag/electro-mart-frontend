// Route removed as part of architecture separation
// Payload CMS is now running as a separate backend service
// Frontend now calls the backend via HTTP API calls
// Admin panel is available at http://localhost:3001/admin

export async function GET() {
  return new Response('Payload API route removed - use separate backend service', { status: 410 })
}

export async function POST() {
  return new Response('Payload API route removed - use separate backend service', { status: 410 })
}

export async function PUT() {
  return new Response('Payload API route removed - use separate backend service', { status: 410 })
}

export async function DELETE() {
  return new Response('Payload API route removed - use separate backend service', { status: 410 })
}
