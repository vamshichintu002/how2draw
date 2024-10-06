import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeModal from './WelcomeModal';

const drawingFacts = [
  "Did you know? Leonardo da Vinci often wrote backwards, making his notes readable only with a mirror.",
  "The world's largest drawing is over 1.5 miles long, created in the Atacama Desert, Chile.",
  "The first known drawings date back over 40,000 years, found in Indonesian caves.",
  "Graphite, used in pencils, is a form of carbon, just like diamonds.",
  "The Mona Lisa has no visible eyebrows or eyelashes.",
  "Vincent van Gogh only sold one painting during his lifetime.",
  "The average pencil can draw a line 35 miles long.",
  "Pablo Picasso produced over 147,000 artworks in his lifetime.",
  "Drawing can improve memory and increase creativity.",
  "The world's most expensive pencil costs over $12,000 and is made of white gold."
];

const ImageGenerationUI: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [currentFact, setCurrentFact] = useState<string>('');
  const [generationTime, setGenerationTime] = useState<number>(0);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setCurrentFact(drawingFacts[Math.floor(Math.random() * drawingFacts.length)]);
      interval = setInterval(() => {
        setCurrentFact(drawingFacts[Math.floor(Math.random() * drawingFacts.length)]);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const currentTime = Date.now();
        setGenerationTime((currentTime - startTime) / 1000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setGeneratedImage(null);
    setLoadingStage('Initializing');
    setLoadingProgress(0);
    setGenerationTime(0);

    const startTime = Date.now();

    try {
      await simulateLoadingStage('Processing prompt', 20);
      await simulateLoadingStage('Generating initial sketch', 40);
      await simulateLoadingStage('Refining details', 60);
      await simulateLoadingStage('Adding final touches', 80);

      const response = await fetch('https://api-inference.huggingface.co/models/glif/how2draw', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (response.ok) {
        const blob = await response.blob();
        setGeneratedImage(URL.createObjectURL(blob));
        setLoadingStage('Complete');
        setLoadingProgress(100);
      } else {
        console.error('API request failed');
        setLoadingStage('Error occurred');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setLoadingStage('Error occurred');
    } finally {
      setIsLoading(false);
      const endTime = Date.now();
      setGenerationTime((endTime - startTime) / 1000);
    }
  };

  const simulateLoadingStage = async (stage: string, progress: number) => {
    setLoadingStage(stage);
    setLoadingProgress(progress);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second per stage
  };

  return (
    <>
      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <motion.h1 
          initial={{ y: -20 }} 
          animate={{ y: 0 }} 
          className="text-4xl font-bold mb-6"
        >
          Master the Art of Drawing: Step-by-Step Guides
        </motion.h1>
        <div className="flex mb-6">
          <Input
            type="text"
            placeholder="Describe what you want to see"
            value={prompt}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
            className="flex-grow mr-2 bg-gray-800 text-white border-gray-700 focus:border-blue-500 transition-colors duration-300"
          />
          <Button 
            onClick={handleGenerate} 
            className="bg-white text-black hover:bg-gray-200 transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Generate
          </Button>
        </div>
        <motion.div 
          className="flex space-x-2 mb-6 overflow-x-auto pb-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Button variant="outline" className="bg-white text-black hover:bg-gray-200 transition-colors duration-300">Explore</Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white transition-colors duration-300">My images</Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white transition-colors duration-300">All</Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white transition-colors duration-300">Realistic</Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white transition-colors duration-300">Design</Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white transition-colors duration-300">3D</Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white transition-colors duration-300">Anime</Button>
        </motion.div>
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 bg-gray-800 rounded-lg p-4 aspect-square flex items-center justify-center relative overflow-hidden"
        >
          {generatedImage ? (
            <motion.div className="text-center">
              <motion.img 
                src={generatedImage} 
                alt="Generated" 
                className="max-w-full h-auto rounded-lg mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <p className="text-sm text-gray-300">
                Generation time: {generationTime.toFixed(2)} seconds
              </p>
            </motion.div>
          ) : isLoading ? (
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin mb-4 mx-auto" />
              <p className="text-lg font-semibold mb-2">{loadingStage}</p>
              <div className="w-64 bg-gray-700 rounded-full h-2.5 mb-4 mx-auto">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${loadingProgress}%` }}></div>
              </div>
              <p className="text-sm text-gray-400 mb-4">Time elapsed: {generationTime.toFixed(1)} seconds</p>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={currentFact}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm text-gray-300 max-w-md mx-auto"
                >
                  {currentFact}
                </motion.p>
              </AnimatePresence>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default ImageGenerationUI;