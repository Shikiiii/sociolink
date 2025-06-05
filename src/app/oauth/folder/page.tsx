"use client";
import { useEffect } from "react";

const SuccessPage = () => {
  useEffect(() => {
    window.location.href = "/profile";
  }, []);

  return null;
};

export default SuccessPage;
