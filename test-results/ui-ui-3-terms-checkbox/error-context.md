# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui.spec.ts >> ui 3 terms checkbox
- Location: tests/ui.spec.ts:38:5

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - img "Stonewake" [ref=e4]:
      - generic [aria-hidden] [ref=e7]: Stonewake
    - heading "Sign in" [level=1] [ref=e8]
    - paragraph [ref=e9]: Agentic market intelligence for banks
    - generic [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]: Email
        - textbox "Email" [ref=e13]:
          - /placeholder: you@bank.com
          - text: akomanov88@gmail.com
      - generic [ref=e14]:
        - generic [ref=e15]: Password
        - textbox "Password" [active] [ref=e16]: cMV5GbHdJTgWfgab2sri
      - generic [ref=e18]:
        - checkbox "I agree to the Evaluation Terms and the Terms of Service. The Privacy Policy explains how we process your data." [ref=e19]
        - checkbox [aria-hidden]
        - generic [ref=e20]:
          - text: I agree to the
          - link "Evaluation Terms" [ref=e21] [cursor=pointer]:
            - /url: https://stonewake.ai/evaluation-terms
          - text: and the
          - link "Terms of Service" [ref=e22] [cursor=pointer]:
            - /url: https://stonewake.ai/terms
          - text: . The
          - link "Privacy Policy" [ref=e23] [cursor=pointer]:
            - /url: https://stonewake.ai/privacy
          - text: explains how we process your data.
      - button "Sign in" [disabled]
      - paragraph [ref=e24]: Forgot your password? Ask your Stonewake contact for a new one.
    - paragraph [ref=e25]:
      - link "Imprint" [ref=e26] [cursor=pointer]:
        - /url: https://stonewake.ai/imprint
      - link "Privacy" [ref=e27] [cursor=pointer]:
        - /url: https://stonewake.ai/privacy
      - link "Public records notice" [ref=e28] [cursor=pointer]:
        - /url: https://stonewake.ai/public-records-notice
      - link "Terms" [ref=e29] [cursor=pointer]:
        - /url: https://stonewake.ai/terms
  - alert [ref=e30]
```