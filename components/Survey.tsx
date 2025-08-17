
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SurveyImage, ColorSelection } from '../types';
import { REQUIRED_SELECTIONS } from '../constants';
import ColorSwatch from './ColorSwatch';

interface SurveyProps {
  surveyData: SurveyImage[];
  setSurveyData: React.Dispatch<React.SetStateAction<SurveyImage[]>>;
  onSubmit: (data: SurveyImage[]) => void;
  isSubmitting: boolean;
  submissionError: string | null;
}

const Magnifier: React.FC = () => (
    <div id="magnifier-wrapper" className="absolute hidden w-32 h-32 pointer-events-none border-4 border-white rounded-full shadow-2xl overflow-hidden z-50 bg-gray-200">
      <canvas id="magnifier" className="w-full h-full block"></canvas>
      {/* Red 'X' crosshair to pinpoint the exact pixel */}
      <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-red-500 opacity-75 transform -translate-y-1/2 -translate-x-1/2 rotate-45"></div>
      <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-red-500 opacity-75 transform -translate-y-1/2 -translate-x-1/2 -rotate-45"></div>
    </div>
);

const Survey: React.FC<SurveyProps> = ({ surveyData, setSurveyData, onSubmit, isSubmitting, submissionError }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isMagnifierActive = useRef(false);

  const currentSelections = surveyData[currentImageIndex].selections;
  const canProceed = currentSelections.length === REQUIRED_SELECTIONS;

  const updateSurveyData = (selections: ColorSelection[]) => {
    const newData = [...surveyData];
    newData[currentImageIndex].selections = selections;
    setSurveyData(newData);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image && image.complete) {
      setIsLoading(false);
      const container = imageContainerRef.current;
      if (container) {
          const containerWidth = container.clientWidth;
          const scale = containerWidth / image.naturalWidth;
          canvas.width = containerWidth;
          canvas.height = image.naturalHeight * scale;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          }
      }
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = surveyData[currentImageIndex].image;
    imageRef.current = img;
    img.onload = drawCanvas;
    // Add resize listener
    window.addEventListener('resize', drawCanvas);
    return () => window.removeEventListener('resize', drawCanvas);
  }, [currentImageIndex, surveyData, drawCanvas]);


  const getMousePos = (e: MouseEvent | React.MouseEvent<HTMLCanvasElement, MouseEvent>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const updateMagnifier = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    const magnifierWrapper = document.getElementById('magnifier-wrapper');
    const magnifierCanvas = document.getElementById('magnifier') as HTMLCanvasElement;
    const container = imageContainerRef.current;

    if (!canvas || !magnifierWrapper || !magnifierCanvas || !isMagnifierActive.current || !container) return;

    const containerRect = container.getBoundingClientRect();

    // Position magnifier relative to its container by converting viewport coords (e.clientX/Y)
    const magnifierX = e.clientX - containerRect.left;
    const magnifierY = e.clientY - containerRect.top;

    magnifierWrapper.style.left = `${magnifierX - magnifierWrapper.offsetWidth / 2}px`;
    magnifierWrapper.style.top = `${magnifierY - magnifierWrapper.offsetHeight / 2}px`;

    // The content drawing logic uses getMousePos, which is already correct for sampling from the canvas
    const pos = getMousePos(e);
    const zoomLevel = 8;
    const magnifierCtx = magnifierCanvas.getContext('2d');
    if (!magnifierCtx) return;

    magnifierCanvas.width = magnifierWrapper.offsetWidth;
    magnifierCanvas.height = magnifierWrapper.offsetHeight;
    
    magnifierCtx.imageSmoothingEnabled = false;

    const sourceSize = magnifierCanvas.width / zoomLevel;
    const sx = pos.x - sourceSize / 2;
    const sy = pos.y - sourceSize / 2;
    
    magnifierCtx.drawImage(
      canvas,
      sx, sy, sourceSize, sourceSize,
      0, 0, magnifierCanvas.width, magnifierCanvas.height
    );
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (currentSelections.length >= REQUIRED_SELECTIONS) return;
    isMagnifierActive.current = true;
    const magnifierWrapper = document.getElementById('magnifier-wrapper');
    if (magnifierWrapper) magnifierWrapper.style.display = 'block';
    updateMagnifier(e.nativeEvent);
    
    const onMouseMove = (moveEvent: MouseEvent) => updateMagnifier(moveEvent);
    const onMouseUp = (upEvent: MouseEvent) => {
        isMagnifierActive.current = false;
        if (magnifierWrapper) magnifierWrapper.style.display = 'none';
        pickColorAt(upEvent);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const pickColorAt = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || currentSelections.length >= REQUIRED_SELECTIONS) return;
    const ctx = canvas.getContext('2d');
    const pos = getMousePos(e);
    if (!ctx) return;
    try {
        const pixelData = ctx.getImageData(pos.x, pos.y, 1, 1).data;
        const hexColor = "#" + ("000000" + ((pixelData[0] << 16) | (pixelData[1] << 8) | pixelData[2]).toString(16)).slice(-6);
        const newSelection: ColorSelection = {
            id: Date.now(),
            x: pos.x,
            y: pos.y,
            color: hexColor
        };
        updateSurveyData([...currentSelections, newSelection]);
    } catch(err) {
        console.error("Could not pick color. This might be a CORS issue with the image source.", err);
        alert("Could not pick the color. Please ensure you are using images that allow cross-origin access.");
    }
  };
  
  const handleDelete = (id: number) => {
    updateSurveyData(currentSelections.filter(s => s.id !== id));
  };
  
  const handleEdit = (id: number, newColor: string) => {
    updateSurveyData(currentSelections.map(s => s.id === id ? { ...s, color: newColor } : s));
  };

  const prevImage = () => {
    if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
  };

  const nextImage = () => {
    if (currentImageIndex < surveyData.length - 1) setCurrentImageIndex(currentImageIndex + 1);
  };

  const isLastImage = currentImageIndex === surveyData.length - 1;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full animate-fade-in">
        <header className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-darkgray">Image {currentImageIndex + 1} of {surveyData.length}</h2>
            <p className="text-gray-600 mt-1">
                {currentSelections.length < REQUIRED_SELECTIONS ? `Please select ${REQUIRED_SELECTIONS - currentSelections.length} more color(s).` : "Great! You can proceed to the next image."}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${(currentSelections.length / REQUIRED_SELECTIONS) * 100}%` }}></div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div ref={imageContainerRef} className="lg:col-span-2 relative w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {isLoading && <div className="text-gray-500">Loading image...</div>}
                <canvas ref={canvasRef} onMouseDown={handleMouseDown} className={`cursor-crosshair transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`} />
                {currentSelections.map(sel => (
                    <div key={sel.id} className="color-marker absolute w-3 h-3 border-2 border-white rounded-full shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2" style={{ left: sel.x, top: sel.y, backgroundColor: sel.color }}></div>
                ))}
                <Magnifier />
            </div>

            <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-darkgray mb-4">Picked Colors ({currentSelections.length}/{REQUIRED_SELECTIONS})</h3>
                <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                    {currentSelections.map(selection => (
                        <ColorSwatch key={selection.id} selection={selection} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                    {currentSelections.length < REQUIRED_SELECTIONS && (
                         <div className="text-center text-gray-500 p-4 border-2 border-dashed rounded-lg">
                            Click and hold on the image to pick a color.
                         </div>
                    )}
                </div>
            </div>
        </div>

        <footer className="mt-8 flex items-center justify-between">
            <button onClick={prevImage} disabled={currentImageIndex === 0} className="px-6 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
            </button>

            {isLastImage ? (
                <button onClick={() => onSubmit(surveyData)} disabled={!canProceed || isSubmitting} className="px-8 py-3 text-lg font-semibold text-white bg-secondary rounded-md shadow-sm hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:bg-gray-400">
                    {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                </button>
            ) : (
                <button onClick={nextImage} disabled={!canProceed} className="px-6 py-2 text-base font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:bg-gray-400">
                    Next
                </button>
            )}
        </footer>
        {submissionError && <p className="text-red-500 text-sm text-center mt-4">{submissionError}</p>}
    </div>
  );
};

export default Survey;