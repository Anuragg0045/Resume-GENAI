const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

// --------------------------------------------------
// Gemini AI Client
// --------------------------------------------------

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// --------------------------------------------------
// Zod Schema
// Used for validating Gemini's final response
// --------------------------------------------------

const interviewReportSchema = z.object({
    matchScore: z
        .number()
        .min(0)
        .max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    ),

    title: z.string()
});

// --------------------------------------------------
// Native JSON Schema for Gemini
// --------------------------------------------------

const interviewReportResponseSchema = {
    type: "object",

    properties: {
        matchScore: {
            type: "number",
            minimum: 0,
            maximum: 100
        },

        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string"
                    },
                    intention: {
                        type: "string"
                    },
                    answer: {
                        type: "string"
                    }
                },
                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string"
                    },
                    intention: {
                        type: "string"
                    },
                    answer: {
                        type: "string"
                    }
                },
                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: {
                        type: "string"
                    },
                    severity: {
                        type: "string",
                        enum: [
                            "low",
                            "medium",
                            "high"
                        ]
                    }
                },
                required: [
                    "skill",
                    "severity"
                ]
            }
        },

        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: {
                        type: "number"
                    },
                    focus: {
                        type: "string"
                    },
                    tasks: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                required: [
                    "day",
                    "focus",
                    "tasks"
                ]
            }
        },

        title: {
            type: "string"
        }
    },

    required: [
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
        "title"
    ]
};

// --------------------------------------------------
// Generate Interview Report
// --------------------------------------------------

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
You are an expert technical recruiter and interview preparation assistant.

Analyze the candidate's resume, self-description, and job description.

Generate a personalized interview preparation report.

========================
CANDIDATE RESUME
========================
${resume}

========================
SELF DESCRIPTION
========================
${selfDescription}

========================
JOB DESCRIPTION
========================
${jobDescription}

========================
STRICT REQUIREMENTS
========================

1. matchScore:
Return a number between 0 and 100.

2. title:
Return the actual job title/role from the job description.
Example:
"Backend Developer"

3. technicalQuestions:
Return EXACTLY 8 technical interview questions.

IMPORTANT:
Every item MUST be an OBJECT with exactly these fields:

{
    "question": "...",
    "intention": "...",
    "answer": "..."
}

Do NOT return technical questions as strings.

The questions should be based on:
- technologies mentioned in the resume
- projects mentioned in the resume
- technologies required by the job description
- backend concepts relevant to the role
- candidate's actual experience

4. behavioralQuestions:
Return EXACTLY 5 behavioral interview questions.

Every item MUST be an OBJECT:

{
    "question": "...",
    "intention": "...",
    "answer": "..."
}

Do NOT return behavioral questions as strings.

Questions should be personalized according to the candidate's projects, experience and background.

5. skillGaps:
Return EXACTLY 5 skill gaps.

Every item MUST be an OBJECT:

{
    "skill": "...",
    "severity": "low"
}

severity MUST be one of:
- low
- medium
- high

Do NOT return skill gaps as strings.

Only identify genuine gaps between the candidate's resume and the job description.

6. preparationPlan:
Return EXACTLY 7 objects, one for each day.

Every item MUST be:

{
    "day": 1,
    "focus": "...",
    "tasks": [
        "...",
        "...",
        "..."
    ]
}

The days MUST be numbered from 1 to 7.

Do NOT return preparation days as strings.

The preparation plan should be realistic and personalized.

7. Do not invent experience, projects, skills or qualifications that are not supported by the resume.

8. The response must strictly follow the JSON structure provided in the response schema.

9. Do not add explanations outside the JSON response.

10. Do not return arrays of strings where an array of objects is required.
`;

    try {

        const response = await ai.models.generateContent({

            model: "gemini-3-flash-preview",

            contents: prompt,

            config: {
                responseMimeType: "application/json",

                responseSchema:
                    interviewReportResponseSchema
            }
        });

        // --------------------------------------------
        // Parse Gemini response
        // --------------------------------------------

        const parsedResponse = JSON.parse(response.text);

        // --------------------------------------------
        // Validate response using Zod
        // --------------------------------------------

        const validatedResponse =
            interviewReportSchema.parse(parsedResponse);

        // --------------------------------------------
        // Extra safety checks
        // --------------------------------------------

        if (
            validatedResponse.technicalQuestions.length !== 8
        ) {
            throw new Error(
                "AI returned an incorrect number of technical questions"
            );
        }

        if (
            validatedResponse.behavioralQuestions.length !== 5
        ) {
            throw new Error(
                "AI returned an incorrect number of behavioral questions"
            );
        }

        if (
            validatedResponse.skillGaps.length !== 5
        ) {
            throw new Error(
                "AI returned an incorrect number of skill gaps"
            );
        }

        if (
            validatedResponse.preparationPlan.length !== 7
        ) {
            throw new Error(
                "AI returned an incorrect preparation plan length"
            );
        }

        return validatedResponse;

    } catch (error) {

        console.error(
            "Error generating interview report:",
            error
        );

        throw error;
    }
}

// --------------------------------------------------
// Generate PDF from HTML
// --------------------------------------------------

async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch();

    try {

        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0"
        });

        const pdfBuffer = await page.pdf({

            format: "A4",

            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;

    } finally {

        await browser.close();
    }
}

// --------------------------------------------------
// Generate ATS Optimized Resume PDF
// --------------------------------------------------

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumePdfSchema = z.object({
        html: z
            .string()
            .describe(
                "Complete HTML content of the ATS-friendly resume"
            )
    });

    const resumeResponseSchema = {
        type: "object",

        properties: {
            html: {
                type: "string"
            }
        },

        required: ["html"]
    };

    const prompt = `
You are an expert professional resume writer.

Create an ATS-friendly resume using the candidate's existing resume,
self-description and the target job description.

========================
CURRENT RESUME
========================
${resume}

========================
SELF DESCRIPTION
========================
${selfDescription}

========================
JOB DESCRIPTION
========================
${jobDescription}

========================
REQUIREMENTS
========================

1. Tailor the resume specifically for the target job.

2. Highlight relevant technical skills and projects.

3. Do NOT invent:
- work experience
- education
- certifications
- projects
- achievements
- technologies

4. Keep the resume concise and professional.

5. Ideally keep it between 1 and 2 pages.

6. Make it ATS friendly.

7. Use standard section headings such as:
- Summary
- Skills
- Education
- Projects
- Experience
- Certifications
- Achievements

Only include sections supported by the candidate's information.

8. The HTML should be clean and professional.

9. Avoid complex layouts that may cause ATS parsing problems.

10. Do not write anything outside the JSON response.

Return an object containing a single field:

{
    "html": "..."
}
`;

    try {

        const response = await ai.models.generateContent({

            model: "gemini-3-flash-preview",

            contents: prompt,

            config: {
                responseMimeType: "application/json",

                responseSchema:
                    resumeResponseSchema
            }
        });

        const jsonContent =
            JSON.parse(response.text);

        // Validate generated resume HTML
        const validatedContent =
            resumePdfSchema.parse(jsonContent);

        const pdfBuffer =
            await generatePdfFromHtml(
                validatedContent.html
            );

        return pdfBuffer;

    } catch (error) {

        console.error(
            "Error generating resume PDF:",
            error
        );

        throw error;
    }
}

// --------------------------------------------------
// Export functions
// --------------------------------------------------

module.exports = {
    generateInterviewReport,generateResumePdf

};