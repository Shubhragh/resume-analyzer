from typing import List, Dict, Any
import re

class ScoreCalculator:
    
    @staticmethod
    def calculate_keyword_match_score(
        resume_keywords: List[str],
        job_keywords: List[str]
    ) -> float:
        """Calculate keyword match percentage"""
        
        if not job_keywords:
            return 0.0
        
        resume_set = set(k.lower() for k in resume_keywords)
        job_set = set(k.lower() for k in job_keywords)
        
        matches = resume_set.intersection(job_set)
        
        score = (len(matches) / len(job_set)) * 100
        return min(score, 100.0)
    
    @staticmethod
    def calculate_skill_match_score(
        resume_skills: List[str],
        required_skills: List[str]
    ) -> float:
        """Calculate skill match percentage"""
        
        if not required_skills:
            return 100.0
        
        resume_set = set(s.lower() for s in resume_skills)
        required_set = set(s.lower() for s in required_skills)
        
        matches = resume_set.intersection(required_set)
        
        score = (len(matches) / len(required_set)) * 100
        return min(score, 100.0)
    
    @staticmethod
    def calculate_experience_score(
        candidate_years: int,
        required_years: int
    ) -> float:
        """Calculate experience match score"""
        
        if required_years == 0:
            return 100.0
        
        if candidate_years >= required_years:
            return 100.0
        
        score = (candidate_years / required_years) * 100
        return max(score, 0.0)
    
    @staticmethod
    def calculate_overall_score(
        ats_score: float,
        keyword_score: float,
        skill_score: float,
        experience_score: float,
        education_score: float
    ) -> float:
        """Calculate weighted overall score"""
        
        weights = {
            'ats': 0.20,
            'keyword': 0.25,
            'skill': 0.30,
            'experience': 0.15,
            'education': 0.10
        }
        
        overall = (
            ats_score * weights['ats'] +
            keyword_score * weights['keyword'] +
            skill_score * weights['skill'] +
            experience_score * weights['experience'] +
            education_score * weights['education']
        )
        
        return min(overall, 100.0)

score_calculator = ScoreCalculator()