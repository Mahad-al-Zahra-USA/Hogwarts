import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface StudentRanking {
  id: string;
  first_name: string;
  last_name: string;
  total_points: number;
  rank: number;
  is_male: boolean;
  house_id: number;
}

export async function GET() {
  try {
    // Get all current students with gender and house information, excluding dev students (NULL house_id)
    const { data: allStudents, error: studentsError } = await supabase
      .from("students")
      .select("id, first_name, last_name, is_male, house_id")
      .eq("current_student", true)
      .not("house_id", "is", null); // Exclude dev students with NULL house_id

    if (studentsError) {
      console.error("Error fetching students:", studentsError.message);
      return NextResponse.json({ success: false, error: studentsError.message }, { status: 500 });
    }

    if (!allStudents || allStudents.length === 0) {
      return NextResponse.json({ success: false, error: "No active students found" }, { status: 404 });
    }

    console.log("Found students:", allStudents.length);

    // Get all event participations with points and custom points
    const { data: eventData, error: eventError } = await supabase
      .from("event_participants")
      .select(`
        student_id,
        event_log!inner(
          event_details,
          event_types!inner(
            points
          )
        )
      `);

    if (eventError) {
      console.error("Error fetching event data:", eventError.message);
      // Continue with 0 points for all students if no events found
    }

    console.log("Event data found:", eventData?.length || 0);

    // Calculate total points for each student
    const studentPoints = new Map<string, number>();

    // Initialize all students with 0 points
    allStudents.forEach(student => {
      studentPoints.set(student.id, 0);
    });

    // Add up points for students who have events
    if (eventData && Array.isArray(eventData)) {
      eventData.forEach((participation: unknown) => {
        const participationData = participation as { 
          student_id: string; 
          event_log?: { 
            event_details?: string;
            event_types?: { points?: number } 
          } 
        };
        const studentId = participationData.student_id;
        
        // Check for custom points in event_details first
        let points = participationData.event_log?.event_types?.points || 0;
        
        if (participationData.event_log?.event_details) {
          try {
            const eventDetails = JSON.parse(participationData.event_log.event_details);
            if (typeof eventDetails.customPoints === 'number') {
              points = eventDetails.customPoints; // Use custom points if available
            }
          } catch (error) {
            // If JSON parsing fails, fall back to default points
            console.warn('Failed to parse event_details JSON:', error);
          }
        }
        
        if (studentId && typeof points === 'number') {
          const currentPoints = studentPoints.get(studentId) || 0;
          studentPoints.set(studentId, currentPoints + points);
        }
      });
    }
    

    // Separate students by gender and rank each group independently
    const allStudentsWithPoints = allStudents.map(student => ({
      id: student.id,
      first_name: student.first_name,
      last_name: student.last_name,
      total_points: studentPoints.get(student.id) || 0,
      rank: 0, // Will be calculated below
      is_male: student.is_male,
      house_id: student.house_id
    }));

    // Separate by gender
    const maleStudents = allStudentsWithPoints.filter(student => student.is_male === true);
    const femaleStudents = allStudentsWithPoints.filter(student => student.is_male === false);

    // Function to rank a group of students with tie handling
    const rankStudents = (students: StudentRanking[]): StudentRanking[] => {
      // Sort by points (descending) then alphabetically
      const sorted = students.sort((a, b) => {
        // First by points (descending)
        if (b.total_points !== a.total_points) {
          return b.total_points - a.total_points;
        }
        // Then alphabetically by full name
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });

      // Assign ranks with proper tie handling
      const ranked: StudentRanking[] = [];
      let currentRank = 1;
      
      for (let i = 0; i < sorted.length; i++) {
        const student = sorted[i];
        
        // If this is not the first student and points are different from previous student,
        // update the rank to be 1 + number of students processed so far
        if (i > 0 && student.total_points !== sorted[i - 1].total_points) {
          currentRank = i + 1;
        }
        
        ranked.push({
          ...student,
          rank: currentRank
        });
      }
      
      return ranked;
    };

    // Rank each gender group separately
    const rankedMales = rankStudents(maleStudents);
    const rankedFemales = rankStudents(femaleStudents);

    // Combine both groups for the final result
    const rankings: StudentRanking[] = [...rankedMales, ...rankedFemales];

    console.log("Total rankings created:", rankings.length);
    console.log("Sample student data:", rankings.slice(0, 3));

    // Add cache control headers to prevent caching
    const response = NextResponse.json({ success: true, data: rankings }, { status: 200 });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (err) {
    console.error("Unexpected error:", err);
    const errorResponse = NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return errorResponse;
  }
}
