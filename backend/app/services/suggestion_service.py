from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List
from app.models.resume import Resume
from app.models.job import Job
from app.models.analysis import Analysis
from app.services.ai_service import ai_service
from loguru import logger

class SuggestionService:
    
    async def generate_improvement_suggestions(
        self,
        db: AsyncSession,
        resume: Resume,
        job: Job = None,
        analysis: Analysis = None
    ) -> List[Dict[str, Any]]:
        """Generate comprehensive improvement suggestions"""
        
        suggestions = []
        
        # AI-powered suggestions
        if job:
            try:
                ai_suggestions = await ai_service.generate_suggestions(
                    resume.raw_text,
                    job.description,
                    analysis.structured_data if analysis else {}
                )
                suggestions.extend(ai_suggestions)
            except Exception as e:
                logger.error(f"AI suggestion generation failed: {str(e)}")
        
        # Rule-based suggestions
        rule_based = self._generate_rule_based_suggestions(resume, job)
        suggestions.extend(rule_based)
        
        # ATS optimization suggestions
        ats_suggestions = await self._generate_ats_suggestions(resume)
        suggestions.extend(ats_suggestions)
        
        # Prioritize and deduplicate
        suggestions = self._prioritize_suggestions(suggestions)
        
        return suggestions
    
    def _generate_rule_based_suggestions(
        self,
        resume: Resume,
        job: Job = None
    ) -> List[Dict[str, Any]]:
        """Generate rule-based suggestions"""
        
        suggestions = []
        
        # Check resume length
        if resume.raw_text:
            word_count = len(resume.raw_text.split())
            if word_count < 200:
                suggestions.append({
                    "category": "content",
                    "priority": "high",
                    "title": "Resume Too Short",
                    "description": "Your resume appears to be too brief. Aim for 400-800 words.",
                    "action_items": [
                        "Add more details to your work experience",
                        "Include quantifiable achievements",
                        "Add relevant projects or certifications"
                    ]
                })
            elif word_count > 1000:
                suggestions.append({
                    "category": "content",
                    "priority": "medium",
                    "title": "Resume Too Long",
                    "description": "Your resume might be too lengthy. Keep it concise.",
                    "action_items": [
                        "Remove outdated experiences",
                        "Focus on relevant achievements",
                        "Use bullet points instead of paragraphs"
                    ]
                })
        
        # Check for quantifiable achievements
        if resume.raw_text and not any(char.isdigit() for char in resume.raw_text):
            suggestions.append({
                "category": "content",
                "priority": "high",
                "title": "Add Quantifiable Achievements",
                "description": "Include numbers, percentages, or metrics to demonstrate impact.",
                "action_items": [
                    "Add metrics to your achievements (e.g., '30% increase in sales')",
                    "Include team sizes you've managed",
                    "Quantify project outcomes"
                ]
            })
        
        # Check skills match if job provided
        if job and resume.skills and job.required_skills:
            missing_skills = set(job.required_skills) - set(resume.skills)
            if missing_skills:
                suggestions.append({
                    "category": "skills",
                    "priority": "high",
                    "title": "Missing Required Skills",
                    "description": f"Your resume is missing {len(missing_skills)} required skills.",
                    "action_items": [
                        f"Consider adding: {', '.join(list(missing_skills)[:5])}",
                        "Highlight transferable skills",
                        "Add relevant certifications"
                    ]
                })
        
        return suggestions
    
    async def _generate_ats_suggestions(
        self,
        resume: Resume
    ) -> List[Dict[str, Any]]:
        """Generate ATS optimization suggestions"""
        
        suggestions = []
        
        try:
            ats_analysis = await ai_service.optimize_for_ats(resume.raw_text)
            
            if ats_analysis.get('score', 100) < 70:
                suggestions.append({
                    "category": "formatting",
                    "priority": "high",
                    "title": "ATS Compatibility Issues",
                    "description": "Your resume may not be ATS-friendly.",
                    "action_items": ats_analysis.get('recommendations', [])
                })
        except Exception as e:
            logger.error(f"ATS analysis failed: {str(e)}")
        
        return suggestions
    
    def _prioritize_suggestions(
        self,
        suggestions: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Prioritize and deduplicate suggestions"""
        
        # Remove duplicates based on title
        seen_titles = set()
        unique_suggestions = []
        
        for suggestion in suggestions:
            title = suggestion.get('title')
            if title not in seen_titles:
                seen_titles.add(title)
                unique_suggestions.append(suggestion)
        
        # Sort by priority
        priority_order = {"high": 0, "medium": 1, "low": 2}
        unique_suggestions.sort(
            key=lambda x: priority_order.get(x.get('priority', 'low'), 3)
        )
        
        return unique_suggestions
    
    async def generate_company_specific_suggestions(
        self,
        db: AsyncSession,
        resume: Resume,
        company_id: str
    ) -> List[Dict[str, Any]]:
        """Generate company-specific customization suggestions"""
        
        from app.services.company_service import company_service
        
        company = await company_service.get_company(db, company_id)
        
        company_info = {
            'name': company.name,
            'industry': company.industry,
            'culture': company.culture,
            'values': company.values,
            'tech_stack': company.tech_stack
        }
        
        try:
            customization = await ai_service.customize_for_company(
                resume.raw_text,
                company_info
            )
            
            suggestions = [{
                "category": "customization",
                "priority": "high",
                "title": f"Customize for {company.name}",
                "description": "Tailor your resume to match company culture and requirements.",
                "action_items": customization.get('recommendations', [])
            }]
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Company customization failed: {str(e)}")
            return []

# Singleton
suggestion_service = SuggestionService()