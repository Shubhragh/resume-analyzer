from groq import Groq
from typing import Dict, List, Any, Optional
import json
from app.config import settings
from loguru import logger

class AIService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL
        
    async def analyze_resume(
        self, 
        resume_text: str, 
        job_description: Optional[str] = None
    ) -> Dict[str, Any]:
        """Comprehensive AI-powered resume analysis using Groq"""
        
        prompt = self._build_analysis_prompt(resume_text, job_description)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                temperature=settings.AI_TEMPERATURE,
                max_tokens=settings.MAX_TOKENS,
            )
            
            result = self._extract_json_from_response(response.choices[0].message.content)
            return result
            
        except Exception as e:
            logger.error(f"AI analysis failed: {str(e)}")
            raise
    
    async def generate_suggestions(
        self, 
        resume_text: str, 
        job_description: str,
        analysis_results: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate specific improvement suggestions using Groq"""
        
        prompt = f"""
        Based on this analysis, provide 5-10 specific, actionable suggestions to improve the resume.
        Return ONLY a valid JSON object with a "suggestions" array.
        
        Resume (first 2000 chars): {resume_text[:2000]}
        Job Description (first 1000 chars): {job_description[:1000]}
        Current Analysis: {json.dumps(analysis_results, indent=2)}
        
        Format each suggestion with:
        - category: One of [formatting, content, keywords, skills, experience, education, ats]
        - priority: One of [high, medium, low]
        - title: Brief title (max 50 chars)
        - description: Detailed explanation (100-200 chars)
        - action_items: Array of 2-4 specific actionable steps
        
        Return ONLY valid JSON, no markdown.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert resume consultant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
            )
            
            result = self._extract_json_from_response(response.choices[0].message.content)
            return result.get("suggestions", [])
            
        except Exception as e:
            logger.error(f"Suggestion generation failed: {str(e)}")
            return []
    
    async def optimize_for_ats(self, resume_text: str) -> Dict[str, Any]:
        """Analyze and optimize resume for ATS systems using Groq"""
        
        prompt = f"""
        Analyze this resume for ATS (Applicant Tracking System) compatibility.
        Return ONLY a valid JSON object.
        
        Resume:
        {resume_text}
        
        Return this exact JSON structure:
        {{
            "ats_score": <number 0-100>,
            "formatting_issues": [
                {{
                    "issue": "Description of issue",
                    "severity": "high|medium|low",
                    "location": "Where in resume"
                }}
            ],
            "missing_sections": ["section names"],
            "keyword_analysis": {{
                "keyword_count": <number>,
                "keyword_density": <percentage>,
                "strategic_placement": "good|fair|poor"
            }},
            "recommendations": [
                "Specific recommendation 1",
                "Specific recommendation 2"
            ],
            "strengths": ["ATS strength 1", "ATS strength 2"],
            "overall_assessment": "Brief summary"
        }}
        
        Return ONLY valid JSON, no markdown.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an ATS optimization expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
            )
            
            result = self._extract_json_from_response(response.choices[0].message.content)
            return result
            
        except Exception as e:
            logger.error(f"ATS optimization failed: {str(e)}")
            raise
    
    async def customize_for_company(
        self, 
        resume_text: str, 
        company_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Customize resume for specific company"""
        
        prompt = f"""
        Customize this resume to align with the company's culture and values.
        Return ONLY a valid JSON object.
        
        Company: {company_info.get('name', 'N/A')}
        Industry: {company_info.get('industry', 'N/A')}
        Culture: {company_info.get('culture', 'N/A')}
        Values: {json.dumps(company_info.get('values', []))}
        Tech Stack: {json.dumps(company_info.get('tech_stack', []))}
        
        Resume (first 2000 chars):
        {resume_text[:2000]}
        
        Provide customization in this JSON format:
        {{
            "keyword_adjustments": [],
            "experience_highlights": [],
            "skills_emphasis": [],
            "cultural_fit_improvements": [],
            "customized_summary": "",
            "action_verbs": [],
            "overall_strategy": ""
        }}
        
        Return ONLY valid JSON.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a career advisor."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
            )
            
            result = self._extract_json_from_response(response.choices[0].message.content)
            return result
            
        except Exception as e:
            logger.error(f"Company customization failed: {str(e)}")
            raise
    
    async def extract_skills(self, text: str) -> List[str]:
        """Extract technical and soft skills"""
        
        prompt = f"""
        Extract all skills from this text.
        Return ONLY a JSON object with a "skills" array.
        
        Text: {text[:3000]}
        
        Return format:
        {{
            "skills": ["skill1", "skill2", "skill3"]
        }}
        
        Return ONLY valid JSON, no markdown.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a skill extraction expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
            )
            
            result = self._extract_json_from_response(response.choices[0].message.content)
            return result.get("skills", [])
            
        except Exception as e:
            logger.error(f"Skill extraction failed: {str(e)}")
            return []
    
    async def compare_resume_with_job(
        self,
        resume_text: str,
        job_description: str
    ) -> Dict[str, Any]:
        """Deep comparison between resume and job"""
        
        prompt = f"""
        Compare resume with job description.
        Return ONLY valid JSON.
        
        Resume: {resume_text[:2500]}
        Job: {job_description[:2500]}
        
        Return this structure:
        {{
            "match_percentage": <0-100>,
            "skill_match": {{"matched": [], "missing": [], "match_rate": <0-100>}},
            "experience_match": {{"assessment": "", "relevant_experience": []}},
            "education_match": {{"meets_requirement": true}},
            "keyword_analysis": {{"job_keywords": [], "resume_coverage": <0-100>, "missing_keywords": []}},
            "strengths": [],
            "gaps": [],
            "recommendations": [],
            "fit_assessment": "excellent|good|fair|poor",
            "summary": ""
        }}
        
        Return ONLY valid JSON.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a resume analysis expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
            )
            
            result = self._extract_json_from_response(response.choices[0].message.content)
            return result
            
        except Exception as e:
            logger.error(f"Comparison failed: {str(e)}")
            raise
    
    def _extract_json_from_response(self, text: str) -> Dict[str, Any]:
        """Extract JSON from response"""
        text = text.strip()
        
        # Remove markdown
        if text.startswith('```json'):
            text = text[7:]
        elif text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        
        text = text.strip()
        
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}\nText: {text[:500]}")
            import re
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except:
                    pass
            raise ValueError(f"Invalid JSON: {text[:200]}")
    
    def _get_system_prompt(self) -> str:
        return """You are an expert resume analyzer with deep knowledge of ATS systems, 
        job market trends, and professional development. Provide detailed, actionable 
        analysis in JSON format."""
    
    def _build_analysis_prompt(self, resume_text: str, job_description: Optional[str]) -> str:
        return f"""
    You are an ATS-level resume analyzer.

    STRICT RULES:
    - Use ONLY the provided Resume and Job Description
    - Do NOT assume or invent skills not present in text
    - Do NOT use external knowledge
    - If a skill is not explicitly in resume or JD, mark it missing

    TASK:
    Compare resume with job description and produce structured JSON output.

    RESUME:
    {resume_text}

    JOB DESCRIPTION:
    {job_description if job_description else "NOT PROVIDED"}

    OUTPUT FORMAT (STRICT JSON ONLY):
    {{
        "overall_score": 0,
        "ats_score": 0,
        "keyword_match_score": 0,
        "experience_match_score": 0,
        "skill_match_score": 0,
        "education_match_score": 0,
        "matched_skills": [],
        "missing_skills": [],
        "matched_keywords": [],
        "missing_keywords": [],
        "strengths": [],
        "weaknesses": [],
        "improvement_areas": [],
        "summary": ""
    }}

    IMPORTANT:
    - Only use evidence from text
    - Do NOT hallucinate skills
    - If JD mentions Python but resume doesn't → it MUST be in missing_skills
    """
        return base

# Singleton
ai_service = AIService()