import { useNavigate } from "react-router-dom";
import momImg from "../assets/mom.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#fff" }}>
        <img
          src={momImg}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>
      {/* Subtle gradient overlay at bottom for button readability */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "180px",
          background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 32px",
          gap: "16px",
        }}
      >
        <p style={{ color: "#fff", fontSize: "18px", fontWeight: "600", textAlign: "center", textShadow: "0 2px 4px rgba(0,0,0,0.5)", fontFamily: "Poppins, sans-serif" }}>
          Track Every Moment With Care
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            maxWidth: "320px",
            padding: "16px 0",
            borderRadius: "9999px",
            background: "linear-gradient(to right, #fb7185, #ec4899)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(244,63,94,0.4)",
            fontFamily: "Poppins, sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
