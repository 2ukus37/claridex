import React, { useState, useCallback } from 'react';
import { ImageIcon, DocumentIcon, BeakerIcon, SparklesIcon } from './IconComponents';
import { Spinner } from './Spinner';
import { generateDiagnosticSummary } from '../services/geminiService';

// A default placeholder image URL. A real CXR image is recommended for actual use.
const DEFAULT_CXR_IMAGE = 'https://picsum.photos/seed/claridx/512/512';

type ImagingType = 'X-ray' | 'CT Scan' | 'Other';
const IMAGING_TYPES: ImagingType[] = ['X-ray', 'CT Scan', 'Other'];

interface DiagnosticCopilotProps {
    t: any; // Translation object
    language: string;
}

export const DiagnosticCopilot: React.FC<DiagnosticCopilotProps> = ({ t, language }) => {
  const [imagingType, setImagingType] = useState<ImagingType>('X-ray');
  const [xrayImage, setXrayImage] = useState<{ file: File | null; base64: string; previewUrl: string }>({
    file: null,
    base64: '',
    previewUrl: DEFAULT_CXR_IMAGE,
  });
  const [clinicalNotes, setClinicalNotes] = useState<string>('65-year-old male presents with a 3-day history of productive cough, fever, and shortness of breath.');
  const [labValues, setLabValues] = useState<string>('WBC: 14.2 x 10^9/L (Elevated)\nCRP: 120 mg/L (Elevated)');
  
  const [generatedSummary, setGeneratedSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setXrayImage({
          file: file,
          base64: base64String,
          previewUrl: URL.createObjectURL(file),
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Fetch the default image and convert to base64 on initial load
  React.useEffect(() => {
    const fetchAndConvertDefaultImage = async () => {
       if (xrayImage.previewUrl === DEFAULT_CXR_IMAGE && !xrayImage.base64) {
         try {
            const response = await fetch(DEFAULT_CXR_IMAGE);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setXrayImage(prev => ({ ...prev, base64: base64String }));
            };
            reader.readAsDataURL(blob);
         } catch (e) {
            console.error("Failed to load default image:", e);
            setError("Could not load the default placeholder image.");
         }
       }
    };
    fetchAndConvertDefaultImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateSummary = useCallback(async () => {
    if (!xrayImage.base64 || !clinicalNotes || !labValues) {
      setError('Please provide all inputs: an imaging scan, Clinical Notes, and Lab Values.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedSummary('');

    try {
      const summary = await generateDiagnosticSummary(xrayImage.base64, clinicalNotes, labValues, imagingType, language);
      setGeneratedSummary(summary);
    } catch (e) {
      console.error(e);
      setError('Failed to generate summary. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [xrayImage.base64, clinicalNotes, labValues, imagingType, language]);

  const isGenerateDisabled = !xrayImage.base64 || !clinicalNotes || !labValues || isLoading;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Input Panels */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imaging Input */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
          <div className="flex items-center mb-4">
            <ImageIcon className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-lg font-semibold text-slate-700">{imagingType}</h2>
          </div>
          <div className="mb-4">
            <div className="flex rounded-lg p-1 bg-slate-200">
              {IMAGING_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setImagingType(type)}
                  className={`w-full text-center text-sm font-medium py-2 rounded-md transition-colors duration-200 ${
                    imagingType === type
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-slate-600 hover:bg-slate-300'
                  }`}
                  aria-pressed={imagingType === type}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center bg-slate-100 rounded-lg p-4 border-2 border-dashed border-slate-300">
            <img src={xrayImage.previewUrl} alt={`${imagingType} preview`} className="max-h-48 w-auto rounded-md object-contain mb-4" />
            <label htmlFor="image-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">
              {t.uploadImage}
            </label>
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <p className="text-xs text-slate-500 mt-2">{xrayImage.file?.name || t.usingPlaceholder}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Clinical Notes Input */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
            <div className="flex items-center mb-4">
              <DocumentIcon className="h-6 w-6 text-green-500 mr-3" />
              <h2 className="text-lg font-semibold text-slate-700">{t.clinicalNotes}</h2>
            </div>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder={t.clinicalNotesPlaceholder}
              className="w-full flex-grow p-3 bg-slate-100 rounded-md border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
              rows={6}
              aria-label="Clinical Notes"
            />
          </div>

          {/* Lab Values Input */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
            <div className="flex items-center mb-4">
              <BeakerIcon className="h-6 w-6 text-purple-500 mr-3" />
              <h2 className="text-lg font-semibold text-slate-700">{t.labValues}</h2>
            </div>
             <textarea
              value={labValues}
              onChange={(e) => setLabValues(e.target.value)}
              placeholder={t.labValuesPlaceholder}
              className="w-full flex-grow p-3 bg-slate-100 rounded-md border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm"
              rows={4}
              aria-label="Lab Values"
            />
          </div>
        </div>
      </div>

      {/* AI Summary Output */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <SparklesIcon className="h-6 w-6 text-amber-500 mr-3" />
          <h2 className="text-lg font-semibold text-slate-700">{t.aiSummary}</h2>
        </div>
        <div className="flex-grow bg-slate-100 rounded-lg p-4 flex flex-col justify-center min-h-[300px]" aria-live="polite">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center text-slate-500">
               <Spinner />
               <p className="mt-2 text-sm">{t.synthesizing}</p>
             </div>
          ) : error ? (
            <div className="text-center text-red-500 text-sm" role="alert">
              <p><strong>{t.errorPrefix}</strong> {error}</p>
            </div>
          ) : generatedSummary ? (
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{generatedSummary}</p>
          ) : (
            <div className="text-center text-slate-500">
              <p>{t.beginAnalysis}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={isGenerateDisabled}
          className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-indigo-500/50"
        >
          {isLoading ? t.generating : t.generate}
        </button>
      </div>
    </div>
  );
};
