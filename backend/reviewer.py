import os
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from models import ResumeReview
from langchain_groq import ChatGroq
load_dotenv()

PROMPT_TEMPLATE = """
You are an expert resume reviewer and career coach with 15+ years of experience.

Analyze the resume below and return structured feedback.

{format_instructions}

Rules:
- Be specific — reference actual content from the resume
- Score honestly out of 10
- Improvement tips must be concrete and actionable

Resume:
\"\"\"
{resume_text}
\"\"\"

Return ONLY valid JSON matching the schema. No extra text.
"""

def review_resume(resume_text: str) -> ResumeReview:
    parser = PydanticOutputParser(pydantic_object=ResumeReview)
    prompt = PromptTemplate(
        template=PROMPT_TEMPLATE,
        input_variables=["resume_text"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.3,
    api_key=os.getenv("GROQ_API_KEY")
)
    chain = prompt | llm | parser
    return chain.invoke({"resume_text": resume_text})
