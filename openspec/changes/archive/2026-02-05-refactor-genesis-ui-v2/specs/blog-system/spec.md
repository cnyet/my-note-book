# Spec: blog-system

## MODIFIED Requirements

### Requirement: Article Reading Experience
The system MUST provide a high-fidelity reading experience for blog articles.

#### Scenario: Read Article Detail
Given a blog article
When a user clicks on an article card
Then the system SHALL navigate to `/blog/[slug]`
And the system SHALL render the article content with proper typography and syntax highlighting.

#### Scenario: Dynamic Table of Contents
Given a blog article with multiple headings
When a user reads the article
Then the system SHALL display a sticky Table of Contents (TOC) with a scanline indicator showing the current active section.

#### Scenario: Enhanced Syntax Highlighting
Given a blog article with code blocks
When the article is rendered
Then the system SHALL apply high-fidelity syntax highlighting with language indicators and line numbering following the Genesis theme.
