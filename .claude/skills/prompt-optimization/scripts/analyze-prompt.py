#!/usr/bin/env python3
"""
Prompt Analysis Tool

This script helps analyze prompts for quality based on the Prompt Optimization guidelines.
It evaluates prompts against the key criteria outlined in the skill.
"""

import sys
import argparse
from typing import Dict, List, Tuple


def analyze_prompt(prompt_text: str) -> Dict[str, List[str]]:
    """
    Analyze a prompt based on the prompt optimization guidelines.

    Args:
        prompt_text: The prompt to analyze

    Returns:
        Dictionary containing analysis results categorized by guideline areas
    """
    results = {
        'clarity_and_precision': [],
        'context_provisioning': [],
        'structure_and_formatting': [],
        'tactical_considerations': []
    }

    # Check for clarity and precision issues
    clarity_issues = []

    # Check for vague terms
    vague_terms = ['thing', 'stuff', 'etc', 'etc.', 'some', 'various', 'different']
    found_vague = [term for term in vague_terms if term.lower() in prompt_text.lower()]
    if found_vague:
        clarity_issues.append(f"Contains vague terms: {', '.join(found_vague)}")

    # Check for unclear objectives
    if len(prompt_text.strip()) < 10:
        clarity_issues.append("Prompt is too brief to convey clear objectives")

    # Check for undefined terms (simple heuristic)
    capitalized_words = [word for word in prompt_text.split() if word.startswith('The ') and len(word) > 5]
    # This is a basic check - in practice you'd want a more sophisticated approach

    results['clarity_and_precision'] = clarity_issues

    # Check for context provisioning
    context_issues = []

    if not any(tech in prompt_text.lower() for tech in
               ['react', 'javascript', 'python', 'api', 'database', 'framework',
                'library', 'technology', 'platform', 'system', 'environment']):
        context_issues.append("Missing technology stack context")

    if not any(context_word in prompt_text.lower() for context_word in
               ['current', 'existing', 'problem', 'issue', 'bug', 'requirement',
                'constraint', 'limitation', 'goal', 'objective']):
        context_issues.append("Missing situational context")

    results['context_provisioning'] = context_issues

    # Check for structure and formatting
    structure_issues = []

    lines = prompt_text.split('\n')
    if len(lines) < 3 and len(prompt_text) > 50:
        structure_issues.append("Prompt is not well-structured into multiple lines/paragraphs")

    # Check for common structural elements
    structure_keywords = ['##', '#', '-', '*', '1.', '2.', 'first', 'then', 'finally', 'task:', 'requirements:', 'context:']
    has_structure = any(keyword.lower() in prompt_text.lower() for keyword in structure_keywords)
    if not has_structure and len(prompt_text) > 100:
        structure_issues.append("Prompt could benefit from better structure (headings, lists, sections)")

    results['structure_and_formatting'] = structure_issues

    # Check for tactical considerations
    tactical_issues = []

    if not any(role_word in prompt_text.lower() for role_word in
               ['as a', 'acting as', 'in the role of', 'from the perspective']):
        tactical_issues.append("Could benefit from role definition to guide response perspective")

    if not any(expectation_word in prompt_text.lower() for expectation_word in
               ['return', 'provide', 'give me', 'output', 'format', 'structure', 'should include']):
        tactical_issues.append("Could benefit from explicit expectation setting for output format")

    results['tactical_considerations'] = tactical_issues

    return results


def print_analysis(analysis_results: Dict[str, List[str]]):
    """Print the analysis results in a formatted way."""
    print("="*60)
    print("PROMPT ANALYSIS RESULTS")
    print("="*60)

    for category, issues in analysis_results.items():
        category_name = category.replace('_', ' ').title()
        print(f"\n{category_name}:")
        print("-" * (len(category_name) + 1))

        if issues:
            for issue in issues:
                print(f"  • {issue}")
        else:
            print("  ✓ No issues detected in this category")

    print("\n" + "="*60)
    print("IMPROVEMENT SUGGESTIONS")
    print("="*60)
    print("\nTo improve your prompt:")
    print("• Add specific context about your technology stack, project, or constraints")
    print("• Use clear, unambiguous language and define technical terms")
    print("• Structure your prompt with headings, lists, or numbered steps")
    print("• Clearly state your expectations for the response format")
    print("• Consider assigning a role to the AI (e.g., 'as a senior developer...')")


def main():
    parser = argparse.ArgumentParser(
        description="Analyze prompts for quality based on Prompt Optimization guidelines"
    )
    parser.add_argument(
        'prompt',
        nargs='?',
        help='The prompt to analyze. If not provided, will prompt for input.'
    )
    parser.add_argument(
        '-f', '--file',
        help='Read prompt from a file'
    )

    args = parser.parse_args()

    if args.file:
        with open(args.file, 'r') as f:
            prompt_text = f.read()
    elif args.prompt:
        prompt_text = args.prompt
    else:
        print("Enter the prompt to analyze (press Ctrl+D or Ctrl+Z when finished):")
        try:
            prompt_text = sys.stdin.read()
        except KeyboardInterrupt:
            print("\nOperation cancelled.")
            return 1

    if not prompt_text.strip():
        print("Error: No prompt provided to analyze.")
        return 1

    analysis = analyze_prompt(prompt_text)
    print_analysis(analysis)

    return 0


if __name__ == "__main__":
    sys.exit(main())