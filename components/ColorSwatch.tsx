
import React, { useRef, useEffect } from 'react';
import { ColorSelection } from '../types';

// Declaring Pickr on the window object to satisfy TypeScript since it's loaded from a script tag
declare global {
    interface Window {
        Pickr: any;
    }
}

interface ColorSwatchProps {
  selection: ColorSelection;
  onEdit: (id: number, newColor: string) => void;
  onDelete: (id: number) => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ selection, onEdit, onDelete }) => {
  const pickrContainerRef = useRef<HTMLDivElement>(null);
  const pickrInstance = useRef<any>(null);

  useEffect(() => {
    // Cleanup function to destroy pickr instance on component unmount
    return () => {
      if (pickrInstance.current) {
        pickrInstance.current.destroyAndRemove();
      }
    };
  }, []);
  
  const handleEditClick = () => {
      if (pickrInstance.current) {
          pickrInstance.current.destroyAndRemove();
          pickrInstance.current = null;
          return;
      }

      if (pickrContainerRef.current) {
          const pickr = window.Pickr.create({
              el: pickrContainerRef.current,
              theme: 'classic',
              default: selection.color,
              components: {
                  preview: true,
                  opacity: false,
                  hue: true,
                  interaction: {
                      hex: true,
                      rgba: true,
                      hsla: false,
                      hsva: false,
                      cmyk: false,
                      input: true,
                      clear: false,
                      save: true
                  }
              }
          });

          pickr.on('save', (color: any) => {
              const newColor = color.toHEXA().toString(0);
              onEdit(selection.id, newColor);
              pickr.hide();
          });
          
          pickr.on('hide', () => {
            pickr.destroyAndRemove();
            pickrInstance.current = null;
          });
          
          pickrInstance.current = pickr;
          pickr.show();
      }
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg shadow-sm">
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-md border border-gray-200" 
          style={{ backgroundColor: selection.color }}
        ></div>
        <span className="font-mono text-sm text-gray-700">{selection.color.toUpperCase()}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div ref={pickrContainerRef}></div>
        <button onClick={handleEditClick} title="Edit color" className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
        </button>
        <button onClick={() => onDelete(selection.id)} title="Delete color" className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ColorSwatch;
