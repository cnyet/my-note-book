# Capability: blog-module Specification

## Purpose

Defines the requirements for the content-rich Blog module.

## ADDED Requirements

### Requirement: Markdown Content Support

The Blog module MUST support rendering content from Markdown files with full syntax highlighting.

#### Scenario: Code Block Rendering

- GIVEN a blog post containing a code block
- WHEN rendering the post detail page
- THEN the code MUST be highlighted using the optimized "Abyss" theme
- AND it MUST include a "Copy Code" button

### Requirement: Reading Experience

The blog post layout MUST prioritize readability as per the Genesis design guide.

#### Scenario: Typography Standards

- GIVEN the blog detail page
- WHEN rendering body text
- THEN it MUST use the `Inter` font
- AND the line height MUST be between $1.6$ and $1.8$
- AND the maximum line width MUST NOT exceed $800px$
