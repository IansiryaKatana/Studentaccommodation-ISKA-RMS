// Dynamic API endpoint for lead options
// This fetches real data from Supabase

const SUPABASE_URL = 'https://vwgczfdedacpymnxzxcp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTYzMzksImV4cCI6MjA2OTY5MjMzOX0.-Be0-yqpi5dYGlZF7-5hDWasoyqXzI3VpFlhdnNB7ew';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

// Handle the request
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).json({ message: 'OK' });
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Fetch room grades and duration types from Supabase
    const [roomGradesResponse, durationTypesResponse] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/lead_room_grades?select=id,name,description&is_active=eq.true`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }),
      fetch(`${SUPABASE_URL}/rest/v1/lead_duration_types?select=id,name,description&is_active=eq.true`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      })
    ]);

    if (!roomGradesResponse.ok || !durationTypesResponse.ok) {
      throw new Error('Failed to fetch data from Supabase');
    }

    const roomGrades = await roomGradesResponse.json();
    const durationTypes = await durationTypesResponse.json();

    const result = {
      room_grades: roomGrades,
      duration_types: durationTypes
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching lead options:', error);
    
    // Fallback to static data if database fetch fails
    const fallbackData = {
      room_grades: [
        {
          "id": "770e8400-e29b-41d4-a716-446655440001",
          "name": "Standard",
          "description": "Standard room grade"
        },
        {
          "id": "770e8400-e29b-41d4-a716-446655440002", 
          "name": "Deluxe",
          "description": "Deluxe room grade"
        },
        {
          "id": "770e8400-e29b-41d4-a716-446655440003",
          "name": "Premium", 
          "description": "Premium room grade"
        }
      ],
      duration_types: [
        {
          "id": "770e8400-e29b-41d4-a716-446655440001",
          "name": "1 Week",
          "description": "One week stay"
        },
        {
          "id": "770e8400-e29b-41d4-a716-446655440002",
          "name": "2 Weeks", 
          "description": "Two weeks stay"
        },
        {
          "id": "770e8400-e29b-41d4-a716-446655440003",
          "name": "1 Month",
          "description": "One month stay"
        },
        {
          "id": "770e8400-e29b-41d4-a716-446655440004",
          "name": "3 Months",
          "description": "Three months stay"
        },
        {
          "id": "770e8400-e29b-41d4-a716-446655440005",
          "name": "6 Months",
          "description": "Six months stay"
        },
        {
          "id": "770e8400-e29b-41d4-a716-446655440006",
          "name": "1 Year",
          "description": "One year stay"
        }
      ]
    };
    
    res.status(200).json(fallbackData);
  }
}
