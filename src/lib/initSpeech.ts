
export function initSpeechPermission() {
  if (typeof window !== "undefined") {
    const dummy = new SpeechSynthesisUtterance(" ");
    dummy.volume = 0;
    dummy.lang = "en-US";
    dummy.rate = 1;
    window.speechSynthesis.speak(dummy);
  }
}
