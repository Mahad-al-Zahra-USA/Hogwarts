"use client";

import classNames from "classnames";
import styles from "./page.module.css";
import { useEffect, useState, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select"; // Library for custom select dropdowns

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  house_id: number;
}

interface StudentOption {
  value: string;
  label: string;
}

interface Event {
  id: number; // This is actually the event_types_id
  name: string;
  category: string;
  description: string;
  points: number;
  send_email: boolean;
}

export default function Form() {
  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [selectedStudents, setSelectedStudents] = useState<StudentOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [isTashjee, setIsTashjee] = useState<boolean>();
  // const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Called one time when the component is first rendered.
    async function fetchData() {
      try {
        const [studentsRes, categoriesRes, eventsRes] = await Promise.all([
          fetch("/api/getStudent"),
          fetch("/api/getCategory"),
          fetch("/api/getEvent"),
        ]);

        const studentsData = await studentsRes.json();
        // console.log(studentsData);
        const categoriesData = await categoriesRes.json();
        // console.log(categoriesData);
        const eventsData = await eventsRes.json();
        // console.log(eventsData);

        setStudents(studentsData.data);
        setCategories(categoriesData.data);
        setEvents(eventsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Map students to options asrequired by Select component
  const studentOptions: { value: string; label: string }[] = students.map((student) => ({
    value: student.id,
    label: `${student.first_name} ${student.last_name}`,
  }));

  const filterEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesType = isTashjee ? event.points > 0 : event.points < 0;
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      return matchesType && matchesCategory; // Return true if both conditions are met
    });
  }, [events, selectedCategory, isTashjee]);

  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const eventTypeId = parseInt(event.target.value, 10);
    const eventObj = events.find((e) => e.id === eventTypeId) || null;
    
    // Only update points if a different event is selected (not re-selecting the same event)
    if (eventObj && selectedEvent !== eventTypeId) {
      setPoints(eventObj.points); // Pre-fill with default points only for new event selection
      setSendEmail(eventObj.send_email);
      setSelectedEvent(eventTypeId);
    } else if (eventObj && selectedEvent === eventTypeId) {
      // Same event selected, only update email setting but preserve custom points
      setSendEmail(eventObj.send_email);
    } else {
      // No event selected (default option)
      setPoints(0);
      setSendEmail(false);
      setSelectedEvent(null);
    }
  };

  // Router hook to redirect after form submission
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Get all selected student IDs
    const studentIds = selectedStudents.map((student) => student.value);
    const eventTypeId = formData.get("event");
    const notes = formData.get("notes");
    const sendEmail = formData.get("sendEmail") === "on";
    const customPoints = formData.get("points");

    // Validate multiple students
    if (!studentIds.length) {
      alert("Please select at least one student");
      return;
    }

    // Add validation
    if (!eventTypeId || eventTypeId === "Select event") {
      alert("Please select an event");
      return;
    }

    try {
      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentIds: studentIds.map(String), // Ensure UUIDs are passed as strings
          eventTypeId: Number(eventTypeId),
          points: Number(customPoints), // Include custom points value
          notes: notes || null,
          sendEmail,
        }),
      });

      const result = await response.json();
      console.log("API Response:", result);
      if (response.ok) {
        // Redirect to the form submission page
        router.push("/form/form-submit");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center align-content-center">
          <div className="col-sm-8 h-75">
            <div className="card bg-secondary p-2 my-3">
              <form onSubmit={handleSubmit}>
                <div className={styles.form_group}>
                  <label htmlFor="studentName" className={styles.form_label}>
                    Student:
                  </label>
                  <Select
                    isMulti
                    name="studentName"
                    options={studentOptions}
                    className={styles.react_select_container}
                    classNamePrefix="react-select"
                    value={selectedStudents}
                    onMenuOpen={() => console.log(document.querySelectorAll('[class^="custom-select"]'))}
                    onChange={(newValue) => setSelectedStudents(newValue as StudentOption[])}
                    placeholder="Select students"
                    // Prevents Hydration Errors
                    instanceId="student-selector"
                    id="student-selector"
                    aria-activedescendant={undefined}
                  />
                </div>
                <div className={styles.form_group}>
                  <label className={styles.form_label}>Type:</label>

                  <div>
                    <input
                      className="mx-3"
                      type="radio"
                      id="tambeeh"
                      name="type"
                      value="tambeeh"
                      onChange={() => setIsTashjee(false)}
                    />
                    <label htmlFor="tambeeh" className="form-check-label">
                      Tambeeh
                    </label>
                  </div>
                  <div>
                    <input
                      className="mx-3"
                      type="radio"
                      id="tashjee"
                      name="type"
                      value="tashjee"
                      onChange={() => setIsTashjee(true)}
                    />
                    <label htmlFor="tashjee" className="form-check-label">
                      Tashjee
                    </label>
                  </div>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="category" className={styles.form_label}>
                    Category:
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option> Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="event" className={styles.form_label}>
                    Situation:
                  </label>
                  <select className="form-select" id="event" name="event" onChange={handleEventChange}>
                    <option>Select event</option>
                    {filterEvents.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="points" className={styles.form_label}>
                    Points:
                  </label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="points" 
                    name="points"
                    value={points} 
                    onChange={(e) => setPoints(Number(e.target.value))}
                    min="0"
                    step="1"
                    placeholder="Enter custom points"
                  />
                </div>
                <div className={(classNames(styles.form_group), "d-block")}>
                  <label htmlFor="notes" className={styles.form_label}>
                    Notes (Optional):
                  </label>
                  <textarea className="form-control" id="notes" name="notes" rows={3}></textarea>
                </div>
                <div className={(classNames(styles.form_group), "form-check mt-3 ")} hidden>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sendEmail"
                    name="sendEmail"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                  />
                  Send Email
                  <label className="form-check-label" htmlFor="sendEmail"></label>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
