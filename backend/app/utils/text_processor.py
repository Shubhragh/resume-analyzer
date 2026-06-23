import re
from typing import List, Dict
import string

class TextProcessor:
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text"""
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep punctuation
        text = text.strip()
        
        return text
    
    @staticmethod
    def extract_emails(text: str) -> List[str]:
        """Extract email addresses from text"""
        
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return re.findall(email_pattern, text)
    
    @staticmethod
    def extract_phone_numbers(text: str) -> List[str]:
        """Extract phone numbers from text"""
        
        phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        return re.findall(phone_pattern, text)
    
    @staticmethod
    def extract_urls(text: str) -> List[str]:
        """Extract URLs from text"""
        
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        return re.findall(url_pattern, text)
    
    @staticmethod
    def extract_dates(text: str) -> List[str]:
        """Extract dates from text"""
        
        # Common date patterns
        patterns = [
            r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',  # 12/31/2023
            r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b',  # Jan 2023
            r'\b\d{4}\b',  # 2023
        ]
        
        dates = []
        for pattern in patterns:
            dates.extend(re.findall(pattern, text, re.IGNORECASE))
        
        return dates
    
    @staticmethod
    def tokenize(text: str) -> List[str]:
        """Tokenize text into words"""
        
        # Remove punctuation and split
        text = text.translate(str.maketrans('', '', string.punctuation))
        tokens = text.lower().split()
        
        return tokens
    
    @staticmethod
    def extract_keywords(text: str, top_n: int = 20) -> List[str]:
        """Extract top keywords from text"""
        
        from collections import Counter
        
        # Common stop words
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
            'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
        }
        
        tokens = TextProcessor.tokenize(text)
        
        # Filter out stop words and short words
        keywords = [
            word for word in tokens 
            if word not in stop_words and len(word) > 2
        ]
        
        # Count frequency
        counter = Counter(keywords)
        
        # Return top N
        return [word for word, _ in counter.most_common(top_n)]
    
    @staticmethod
    def calculate_readability_score(text: str) -> Dict[str, float]:
        """Calculate readability metrics"""
        
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        words = TextProcessor.tokenize(text)
        
        if not sentences or not words:
            return {
                'avg_sentence_length': 0,
                'avg_word_length': 0,
                'total_words': 0,
                'total_sentences': 0
            }
        
        avg_sentence_length = len(words) / len(sentences)
        avg_word_length = sum(len(word) for word in words) / len(words)
        
        return {
            'avg_sentence_length': round(avg_sentence_length, 2),
            'avg_word_length': round(avg_word_length, 2),
            'total_words': len(words),
            'total_sentences': len(sentences)
        }

text_processor = TextProcessor()