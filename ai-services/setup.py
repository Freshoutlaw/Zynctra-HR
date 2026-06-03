from setuptools import setup, find_packages

setup(
    name="zynctra-ai-services",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "groq",
        "openai",
    ],
)
