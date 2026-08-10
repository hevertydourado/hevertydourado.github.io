<!-- markdownlint-disable-next-line -->
<div align="center">

  # D0ur4tt0 - Cybersecurity Blog

  Technical blog focused on defensive security, incident response (DFIR), threat hunting, and security engineering.

  [![Live Blog](https://img.shields.io/badge/Website-blog.vigly.io-blue)](https://blog.vigly.io)
  [![GitHub](https://img.shields.io/badge/GitHub-hevertydourado-181717?logo=github)](https://github.com/hevertydourado)

</div>

## About the Project

This repository contains the source code for **D0ur4tt0 Cybersecurity Blog**, hosted on GitHub Pages at [blog.vigly.io](https://blog.vigly.io).

The blog aims to share technical write-ups, incident investigations, security engineering tutorials, and research focused on **Defensive Security / Blue Team**.

---

## Tech Stack

- **Jekyll**: Static site generator
- **Theme**: [Chirpy Jekyll Theme (Gem v7.6.0)](https://github.com/cotes2020/jekyll-theme-chirpy)
- **Deployment**: GitHub Pages + Cloudflare DNS
- **Tooling**: Markdown, Liquid, Sass/CSS, JavaScript

---

## 📝 How to Create CyberDefenders Write-Ups

To publish a new CyberDefenders or DFIR lab write-up:

1. **Copy the Write-Up Template:**
   Duplicate the template file located at `_drafts/cyberdefenders-template.md` into the `_posts/` directory.

2. **Name the File using Jekyll Naming Convention:**
   ```bash
   _posts/YYYY-MM-DD-cyberdefenders-[lab-name].md
   ```
   *Example: `_posts/2026-08-10-cyberdefenders-brave.md`*

3. **Fill in the Challenge Metadata & Investigation Steps:**
   - Update front matter `title`, `description`, `tags`, and cover image path.
   - Populate the **MITRE ATT&CK Mapping** and **Indicators of Compromise (IOCs)** tables.
   - Fill in the step-by-step investigation and answers.

4. **Commit and Push:**
   ```bash
   git add _posts/
   git commit -m "docs(writeup): add CyberDefenders [Lab Name] writeup"
   git push origin master
   ```
   *The post will automatically appear on the Home page and under the `/writeups/` tab.*

---

## Local Development

To run the blog locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hevertydourado/hevertydourado.github.io.git
   cd hevertydourado.github.io
   ```

2. **Install dependencies:**
   ```bash
   bundle install
   ```

3. **Start local server:**
   ```bash
   bundle exec jekyll serve
   ```
   Access the site at `http://localhost:4000`.

---

## License

This project is licensed under the [MIT](LICENSE) License.
