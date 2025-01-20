import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validate as isUUID } from "uuid";
import { getAuthenticatedUser } from "@/utils/supabase/user";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface RequestBody {
  studentIds: string[]; // Array of student UUIDs
  eventTypeId: number;
  notes?: string; // Optional event notes
  sendEmail: boolean; // Flag to send an email or not
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();

  try {
    const { studentIds, eventTypeId, notes, sendEmail }: RequestBody = await req.json();

    // Log email for MVP Build (remove later)
    console.log("Email flag:", sendEmail);

    // Validation stage - can be improved further

    // Validate student IDs array
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ error: "At least one student must be selected" }, { status: 400 });
    }

    // Validate each student ID format
    if (!studentIds.every((id) => typeof id === "string" && isUUID(id))) {
      return NextResponse.json({ error: "Invalid student ID format" }, { status: 400 });
    }

    if (!Number.isInteger(eventTypeId)) {
      return NextResponse.json({ error: "Invalid event type ID format" }, { status: 400 });
    }

    // Create the event instance once in the event_log table for all participating students
    const { data: newEvent, error: createEventError } = await supabase
      .from("event_log")
      .insert({ event_type_id: eventTypeId, event_details: notes, user_id: user?.id })
      .select("*")
      .single();

    if (createEventError) {
      console.error("Create event error:", createEventError);
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }

    // Add all participating students to the event_participants table
    const participantInserts = studentIds.map((studentId) => ({
      event_id: newEvent.id,
      student_id: studentId,
    }));

    const { error: participantError } = await supabase.from("event_participants").insert(participantInserts);

    if (participantError) {
      console.error("Participant insert error:", participantError);
      return NextResponse.json({ error: "Failed to add participant" }, { status: 500 });
    }

    // 3. Send email if required (TODO - maybe another api endpoint)

    // 4. Return the success response with the event ID
    return NextResponse.json(
      { message: "Event logged successfully", eventId: newEvent.id, participants: studentIds },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
