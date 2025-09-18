"use client";

import styles from "./page.module.css";
import { useEffect, useState, useCallback } from "react";

interface StudentRanking {
  id: string;
  first_name: string;
  last_name: string;
  total_points: number;
  rank: number;
  is_male: boolean;
  house_id: number;
}

export default function Leaderboard() {
  const [maleStudents, setMaleStudents] = useState<StudentRanking[]>([]);
  const [femaleStudents, setFemaleStudents] = useState<StudentRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchStudentRankings = useCallback(async () => {
    setLoading(true);
    
    try {
      console.log("Fetching student rankings...");
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/getStudentRankings?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get response text first to see what we're actually getting
      const responseText = await response.text();
      console.log("Raw response text:", responseText.substring(0, 500));
      
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);
      
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", responseText.substring(0, 200));
        throw new Error("Server returned HTML instead of JSON. Check API endpoint.");
      }
      
      // Parse the JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed JSON data:", data);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Response text that failed to parse:", responseText);
        throw new Error("Failed to parse JSON response");
      }
      
      if (data.success) {
        console.log("Setting students data:", data.data);
        
        // Separate students by gender but preserve global ranks from API
        const allStudents = data.data;
        
        // Filter male students (Dikrao) and preserve their global ranks
        const males = allStudents
          .filter((student: StudentRanking) => student.is_male === true);
        
        // Filter female students (Dikrio) and preserve their global ranks  
        const females = allStudents
          .filter((student: StudentRanking) => student.is_male === false);
        
        console.log("Male students (Dikrao):", males.length, "total");
        console.log("Female students (Dikrio):", females.length, "total");
        
        setMaleStudents(males);
        setFemaleStudents(females);
        setError(null);
      } else {
        console.error("API returned success: false", data);
        setError(data.error || "Failed to fetch rankings");
      }
    } catch (err) {
      console.error("Error fetching student rankings:", err);
      setError(err instanceof Error ? err.message : "Failed to load leaderboard");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchStudentRankings();
    }
  }, [mounted, fetchStudentRankings]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      console.log("Auto-refreshing leaderboard...");
      fetchStudentRankings();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [mounted, fetchStudentRankings]);

  const getCardColorByHouse = (house_id: number): string => {
    switch (house_id) {
      case 1:
      case 8:
        return "#1C3510"; // Green
      case 2:
      case 5:
        return "#9B2323"; // Red
      case 3:
      case 6:
        return "#1D1260"; // Blue
      case 4:
      case 7:
        return "#E8B853"; // Yellow
      default:
        return "#3b4ca8"; // Default blue fallback
    }
  };

  console.log("Render state:", { 
    mounted, 
    loading, 
    error, 
    maleCount: maleStudents.length, 
    femaleCount: femaleStudents.length 
  });

  // Prevent hydration mismatch
  if (!mounted) {
    console.log("Not mounted yet, returning null");
    return null;
  }

  if (loading) {
    console.log("Loading state, showing loading message");
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    console.log("Error state:", error);
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div>Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle case when no students are found
  if (maleStudents.length === 0 && femaleStudents.length === 0) {
    console.log("No students found");
    return (
      <div className={styles.container}>
        <div className={styles.error}>No active students found in the roster.</div>
      </div>
    );
  }

  console.log("Rendering leaderboard with all male and female students");

  return (
    <div className={styles.container}>
      <div className={styles.leaderboardsWrapper}>
        {/* Dikrao Leaderboard (Males) */}
        <div className={styles.leaderboardSection}>
          <div className={styles.leaderboardTitle}>Dikrao Leaderboard</div>
          <div className={styles.studentsList}>
            {maleStudents.map((student) => (
              <div
                key={student.id}
                className={`${styles.studentCard} ${(student.house_id === 4 || student.house_id === 7) ? styles.yellowHouse : ''}`}
                style={{ backgroundColor: getCardColorByHouse(student.house_id) }}
              >
                <span className={styles.rank}>{student.rank}</span>
                <span className={styles.studentName}>
                  {student.first_name} {student.last_name}
                </span>
                <span className={styles.points}>{student.total_points} PTS</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dikrio Leaderboard (Females) */}
        <div className={styles.leaderboardSection}>
          <div className={styles.leaderboardTitle}>Dikrio Leaderboard</div>
          <div className={styles.studentsList}>
            {femaleStudents.map((student) => (
              <div
                key={student.id}
                className={`${styles.studentCard} ${(student.house_id === 4 || student.house_id === 7) ? styles.yellowHouse : ''}`}
                style={{ backgroundColor: getCardColorByHouse(student.house_id) }}
              >
                <span className={styles.rank}>{student.rank}</span>
                <span className={styles.studentName}>
                  {student.first_name} {student.last_name}
                </span>
                <span className={styles.points}>{student.total_points} PTS</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
