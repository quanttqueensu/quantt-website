"use client";

import { useEffect, useState } from "react";

const phrases = ["Quantitative Finance", "Algo Trading", "Data Science"];

export default function RotatingText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block bg-gradient-to-r from-blue-light to-blue-accent bg-clip-text text-transparent transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {phrases[index]}
    </span>
  );
}
