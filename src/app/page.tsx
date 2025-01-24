import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center h-100">
        <Link
          href="/form"
          className="btn btn-lg bg-secondary fs-1 fw-bold"
          style={{
            height: "auto", // Set height to auto to allow responsive resizing
            padding: "1rem 2rem", // Adjust padding for a more consistent look
            maxWidth: "80%", // Button won't exceed 80% of the parent container's width
            width: "100%", // Allow the button to take the full width of its container, scaling on smaller screens
          }}>
          Start
        </Link>
      </div>
    </>
  );
}
