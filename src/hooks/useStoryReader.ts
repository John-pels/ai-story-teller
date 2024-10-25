import { useState, useRef, useEffect } from "react";

interface UseStoryReaderProps {
  story: string;
}

interface UseStoryReader {
  currentPage: number;
  pages: string[];
  isSpeaking: boolean;
  transcription: string;
  selectedVoice: SpeechSynthesisVoice | null;
  availableVoices: SpeechSynthesisVoice[];
  estimatedTotalMinutes: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleTextToSpeech: () => void;
  handleVoiceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function useStoryReader({ story }: UseStoryReaderProps): UseStoryReader {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const processedPages = story.split("\n\n");
    setPages(processedPages);
  }, [story]);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance();
      utteranceRef.current = utterance;

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);

        const femaleVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("lisa") ||
            voice.name.toLowerCase().includes("victoria")
        );

        if (femaleVoice) {
          setSelectedVoice(femaleVoice);
          utterance.voice = femaleVoice;
        }

        utterance.pitch = 1.1;
        utterance.rate = 0.9;
        utterance.volume = 1.0;
      };

      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();

      utterance.onboundary = (event) => {
        const text = pages[currentPage];
        setTranscription(text.substring(0, event.charIndex));
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setTranscription("");
      };

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, [pages, currentPage]);

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      setTranscription("");
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setTranscription("");
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }
  };

  const handleTextToSpeech = () => {
    if ("speechSynthesis" in window && utteranceRef.current) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setTranscription("");
      } else {
        utteranceRef.current.text = pages[currentPage];
        window.speechSynthesis.speak(utteranceRef.current);
        setIsSpeaking(true);
      }
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voice = availableVoices.find((v) => v.name === e.target.value);
    if (voice && utteranceRef.current) {
      setSelectedVoice(voice);
      utteranceRef.current.voice = voice;
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        utteranceRef.current.text = pages[currentPage];
        window.speechSynthesis.speak(utteranceRef.current);
      }
    }
  };

  const estimatedTotalMinutes = Math.ceil(
    pages.join(" ").split(" ").length / 200
  );

  return {
    currentPage,
    pages,
    isSpeaking,
    transcription,
    selectedVoice,
    availableVoices,
    estimatedTotalMinutes,
    handleNextPage,
    handlePrevPage,
    handleTextToSpeech,
    handleVoiceChange,
  };
}
