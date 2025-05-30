"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";

interface RewardPopupProps {
  message: string;
  onClose: () => void;
}

const RewardPopup = ({ message, onClose }: RewardPopupProps) => {
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
    });

    const timer = setTimeout(() => {
      onClose();
    }, 2500); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 animate-bounce">
      <span className="text-lg font-bold">{message}</span>
    </div>
  );
};

export default RewardPopup;
