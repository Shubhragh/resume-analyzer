import pdfplumber
import docx
from typing import Dict, Any, List
import re
from loguru import logger
from pathlib import Path

class ResumeParser:
    
    def __init__(self):
        self.section_keywords = {
            'experience': ['experience', 'work history', 'employment', 'professional experience'],
            'education': ['education', 'academic', 'qualification'],
            'skills': ['skills', 'technical skills', 'competencies', 'expertise'],
            'projects': ['projects', 'portfolio'],
            'certifications': ['certifications', 'certificates', 'licenses'],
            'summary': ['summary', 'objective', 'profile', 'about'],
        }
    
    async def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """Parse resume from file and extract structured data"""
        
        file_extension = Path(file_path).suffix.lower()
        
        if file_extension == '.pdf':
            text = await self._parse_pdf(file_path)
        elif file_extension in ['.docx', '.doc']:
            text = await self._parse_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
        
        # Extract structured information
        structured_data = await self._extract_sections(text)
        contact_info = self._extract_contact_info(text)
        
        return {
            'raw_text': text,
            'structured_data': structured_data,
            'contact_info': contact_info,
            'sections': list(structured_data.keys())
        }
    
    async def _parse_pdf(self, file_path: str) -> str:
        """Extract text from PDF"""
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() + "\n"
            return text
        except Exception as e:
            logger.error(f"PDF parsing failed: {str(e)}")
            raise
    
    async def _parse_docx(self, file_path: str) -> str:
        """Extract text from DOCX"""
        try:
            doc = docx.Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            logger.error(f"DOCX parsing failed: {str(e)}")
            raise
    
    async def _extract_sections(self, text: str) -> Dict[str, str]:
        """Extract different sections from resume text"""
        
        sections = {}
        lines = text.split('\n')
        current_section = None
        current_content = []
        
        for line in lines:
            line_lower = line.lower().strip()
            
            # Check if line is a section header
            section_found = False
            for section_name, keywords in self.section_keywords.items():
                if any(keyword in line_lower for keyword in keywords):
                    # Save previous section
                    if current_section:
                        sections[current_section] = '\n'.join(current_content).strip()
                    
                    current_section = section_name
                    current_content = []
                    section_found = True
                    break
            
            if not section_found and current_section:
                current_content.append(line)
        
        # Save last section
        if current_section:
            sections[current_section] = '\n'.join(current_content).strip()
        
        return sections
    
    def _extract_contact_info(self, text: str) -> Dict[str, Any]:
        """Extract contact information"""
        
        contact = {}
        
        # Email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact['email'] = emails[0]
        
        # Phone
        phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        if phones:
            contact['phone'] = phones[0]
        
        # LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.findall(linkedin_pattern, text.lower())
        if linkedin:
            contact['linkedin'] = f"https://{linkedin[0]}"
        
        # GitHub
        github_pattern = r'github\.com/[\w-]+'
        github = re.findall(github_pattern, text.lower())
        if github:
            contact['github'] = f"https://{github[0]}"
        
        return contact
    
    async def extract_experience(self, text: str) -> List[Dict[str, Any]]:
        """Extract work experience with details"""
        # This would use more sophisticated NLP
        # For now, return structured placeholder
        return []
    
    async def extract_education(self, text: str) -> List[Dict[str, Any]]:
        """Extract education details"""
        # This would use more sophisticated NLP
        return []


# Singleton
parser_service = ResumeParser()