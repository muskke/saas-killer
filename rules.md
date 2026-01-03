Role: Senior Backend Engineer
Task: Build a pSEO Data Pipeline using Node.js.
Goal: Create a "Software Alternative" directory.

Step 1 (Data Source): 
Write a script using `axios` to query the public **GitHub API**. 
Search for repositories with topics like "open-source-alternative", "self-hosted", or "privacy-focused".
Sort by stars (descending) to filter out garbage.

Step 2 (Enrichment):
For each repo found, extract:
- Repo Name (e.g., "AppFlowy")
- Description
- Star Count
- Topics/Tags
- Last Commit Date (Vital! If > 1 year, discard it. We don't promote dead projects.)

Step 3 (The "Value Add"):
Use a simple OpenAI call (or DeepSeek via API) to generate a 50-word summary for EACH repo explaining: "Why this is a good alternative to [Proprietary Software Name]?"
(e.g., "Why is AppFlowy a good alternative to Notion?")

Step 4 (Output):
Save this data into a structured JSON file `data/alternatives.json`. 
I will later map this JSON to Next.js dynamic routes `[software-name].tsx`.