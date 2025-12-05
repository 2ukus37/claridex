
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const OPENROUTER_API_KEY = process.env.API_KEY;

const languageMap: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
};

const buildPrompt = (notes: string, labs: string, imagingType: string, language: string): string => {
  const imagingContext = (imagingType === 'Other')
    ? 'The user has provided a medical image of an unspecified type. First, identify the anatomical region or subject of the image (e.g., skin, dental, endoscopy). Then, proceed with the analysis.'
    : `The user has provided a ${imagingType}.`;
  
  const targetLanguage = languageMap[language] || 'English';
    
  return `
ROLE: You are ClariDx, an expert AI medical imaging co-pilot. You are powered by a highly capable, pre-trained model with deep understanding of medical imaging and diagnostics.

TASK: Perform a comprehensive analysis of the provided medical image in conjunction with the clinical notes and lab values. Generate a detailed, structured report that includes:
1.  Image Description: A concise description of the key findings in the image.
2.  Potential Diagnosis / Impressions: A list of potential diagnoses or impressions, ordered from most to least likely.
3.  Synthesis: A paragraph synthesizing the image findings with the clinical notes and lab values to explain your reasoning.
4.  Recommendations: Suggest next steps, such as further tests or correlations.

CRITICAL INSTRUCTIONS:
- Generate the entire report in ${targetLanguage}.
- Your analysis should be thorough and accurate, reflecting your expert capabilities.
- While providing potential diagnoses, frame them as possibilities to be confirmed by a qualified clinician. Use phrases like "Findings are suggestive of...", "Differential diagnoses include...", "This could represent...".
- Structure your output clearly using plain text headings: "Description:", "Impressions:", "Synthesis:", and "Recommendations:".
- Do not use markdown (like ** or ##) or any other formatting for headings.
- Do not add any disclaimers or text outside of this structured report.

INPUT DATA:

1. Clinical Context:
${imagingContext}

2. Clinical Notes:
${notes || 'No clinical notes provided.'}

3. Lab Values:
${labs || 'No lab values provided.'}

4. Image Analysis:
[Analyze the attached image and incorporate findings into your report]

OUTPUT:
[Generate the structured report here]
`;
};

export const generateDiagnosticSummary = async (
  imageBase64: string,
  clinicalNotes: string,
  labValues: string,
  imagingType: string,
  language: string
): Promise<string> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ClariDx Diagnostic Co-pilot',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-nano-12b-v2-vl:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: buildPrompt(clinicalNotes, labValues, imagingType, language),
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    return text.trim().replace(/\*\*/g, '');
  } catch (error) {
    console.error("OpenRouter API call failed:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
