export const dynamic = "force-static";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to store mock calendar events for Simulated Mode
const SIMULATED_DB_PATH = path.join(process.cwd(), "simulated_calendar.json");

// Helper to read simulated events
function readSimulatedEvents() {
  if (!fs.existsSync(SIMULATED_DB_PATH)) {
    // Generate default mock events matching existing case / inquiry data
    const defaults = [
      {
        id: "mock-inq-001",
        summary: "Inquiry Hearing: INQ/2026/001",
        description: "Formal disciplinary inquiry - Student misconduct at Royal College",
        start: { dateTime: "2026-07-05T10:00:00+05:30" },
        end: { dateTime: "2026-07-05T12:00:00+05:30" },
        location: "Discipline Branch, Ministry of Education, Isurupaya",
        source: "Inquiry Target Date"
      },
      {
        id: "mock-inq-002",
        summary: "Inquiry Hearing: INQ/2026/002",
        description: "Preliminary investigation on teacher absenteeism - Jaffna Office",
        start: { dateTime: "2026-07-12T09:30:00+05:30" },
        end: { dateTime: "2026-07-12T11:30:00+05:30" },
        location: "Zonal Education Office, Jaffna",
        source: "Inquiry Target Date"
      },
      {
        id: "mock-inq-003",
        summary: "Inquiry Hearing: INQ/2026/003",
        description: "Inquiry into safety guidelines violation - Annual Sports Meet",
        start: { dateTime: "2026-07-20T14:00:00+05:30" },
        end: { dateTime: "2026-07-20T16:00:00+05:30" },
        location: "Discipline Branch, Ministry of Education, Isurupaya",
        source: "Inquiry Target Date"
      },
      {
        id: "mock-appt-001",
        summary: "Officer Appointment: DCMMS/2026/001",
        description: "Inquiry Officer appointment date for Student Misconduct case.",
        start: { dateTime: "2026-07-10T09:00:00+05:30" },
        end: { dateTime: "2026-07-10T10:00:00+05:30" },
        location: "Discipline Branch, Isurupaya",
        source: "Officer Appointment Date"
      }
    ];
    fs.writeFileSync(SIMULATED_DB_PATH, JSON.stringify(defaults, null, 2), "utf8");
    return defaults;
  }
  try {
    const raw = fs.readFileSync(SIMULATED_DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read simulated calendar database", e);
    return [];
  }
}

// Helper to write simulated events
function writeSimulatedEvents(events: any[]) {
  try {
    fs.writeFileSync(SIMULATED_DB_PATH, JSON.stringify(events, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to write to simulated calendar database", e);
  }
}

export async function GET() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  const isConfigured = !!(clientEmail && privateKey && calendarId);

  if (!isConfigured) {
    // Return mock events in Simulated Mode
    const events = readSimulatedEvents();
    return NextResponse.json({
      configured: false,
      mode: "Simulated Google Calendar API Mode",
      events,
    });
  }

  // Format private key (replace escaped newlines if passed in via single line env value)
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  try {
    // Dynamic import to prevent bundler errors if googleapis is still loading
    const { google } = await import("googleapis");

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const calendar = google.calendar({ version: "v3", auth });
    
    // Fetch events from real Google Calendar API
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date("2026-01-01").toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const googleEvents = (response.data.items || []).map((item: any) => ({
      id: item.id,
      summary: item.summary || "No Title",
      description: item.description || "",
      start: item.start || {},
      end: item.end || {},
      location: item.location || "",
      source: "Google Calendar Live"
    }));

    return NextResponse.json({
      configured: true,
      mode: "Live Google Calendar API Mode",
      events: googleEvents,
    });
  } catch (e: any) {
    console.error("Failed to fetch from live Google Calendar API:", e);
    // Graceful fallback to simulated events with error message
    const events = readSimulatedEvents();
    return NextResponse.json({
      configured: false,
      mode: "Live Google Calendar API Mode (Error Fallback)",
      error: e.message || "Failed to authenticate or fetch calendar data",
      events,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { summary, description, startDateTime, endDateTime, location, source, metadata } = body;

    if (!summary || !startDateTime || !endDateTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    const isConfigured = !!(clientEmail && privateKey && calendarId);

    const newEvent = {
      summary,
      description: description || "",
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
      location: location || "",
      source: source || "User Input",
    };

    if (!isConfigured) {
      // Create a new simulated event
      const events = readSimulatedEvents();
      
      // If updating an event with same summary or ID (for case/inquiry synchronization)
      let eventId = body.id || `mock-${Date.now()}`;
      const index = events.findIndex((e: any) => e.id === eventId || (metadata?.inquiryNo && e.summary.includes(metadata.inquiryNo)));
      
      const eventToSave = {
        id: eventId,
        ...newEvent,
      };

      if (index !== -1) {
        events[index] = { ...events[index], ...eventToSave };
      } else {
        events.push(eventToSave);
      }

      writeSimulatedEvents(events);

      return NextResponse.json({
        success: true,
        configured: false,
        mode: "Simulated Google Calendar API Mode",
        event: eventToSave,
      });
    }

    // Live API integration
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    const { google } = await import("googleapis");

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // For updates, let's search if event with this inquiry number exists
    let existingEventId = body.id;
    if (!existingEventId && metadata?.inquiryNo) {
      // Find event with this inquiry number
      const searchRes = await calendar.events.list({
        calendarId,
        q: metadata.inquiryNo,
        singleEvents: true,
      });
      if (searchRes.data.items && searchRes.data.items.length > 0) {
        existingEventId = searchRes.data.items[0].id;
      }
    }

    let result;
    if (existingEventId) {
      // Update existing Google Calendar event
      result = await calendar.events.update({
        calendarId,
        eventId: existingEventId,
        requestBody: newEvent,
      });
    } else {
      // Insert new Google Calendar event
      result = await calendar.events.insert({
        calendarId,
        requestBody: newEvent,
      });
    }

    return NextResponse.json({
      success: true,
      configured: true,
      mode: "Live Google Calendar API Mode",
      event: result.data,
    });
  } catch (e: any) {
    console.error("Failed to write to Google Calendar API:", e);
    return NextResponse.json({
      success: false,
      error: e.message || "Failed to modify Google Calendar events",
    }, { status: 500 });
  }
}
