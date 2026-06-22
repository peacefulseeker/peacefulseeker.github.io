---
name: Alexey Vorobyov
role: Senior Software Engineer
theme:
  name: timeline
  sidebarPosition: right
profile:
  photo: /profile.jpg
  location: Remote / Latvia
  links:
    - label: LinkedIn
      url: https://www.linkedin.com/in/vorobyovalexey/
    - label: GitHub
      url: https://github.com/peacefulseeker
summary_short: " \n
    Senior software engineer with 7+ years building robust SaaS across monolithic and microservices architectures. \n
    Full-stack depth in Python (FastAPI, Pydantic, SQLAlchemy) and TypeScript (React, Node.js), on AWS and/or Azure Cloud. \n
    Seeking B2B opportunities to drive impactful, scalable work. \n
"
skills:
  - "Python, FastAPI, SQLAlchemy"
  - "JS/TS, React, Node.js"
  - "AWS, Azure, Terraform"
  - "Sentry, Grafana, OpenTelemetry"
languages:
  - "English (C1)"
  - "Latvian (C1)"
  - "Russian (Native)"
hobbies:
  - "Hiking / Trekking"
  - "Functional workouts & running"
  - "Playing Piano"
  - "Landscape photography"
  - "Reading books"
experience:
  - role: "Senior Software Engineer (B2B)"
    company: "Healthtech Startup"
    location: "Remote"
    start: "October 2025"
    end: "Present"
    onepage_highlights_num: 3
    highlights:
      - "Built core services in a FastAPI payment-calculation platform that automates monthly capitation processing for value-based-care organizations, replacing a slow manual reconciliation workflow."
      - "Specialized in backend engineering — FastAPI services, PostgreSQL, ETL pipelines, and AWS infrastructure — while also contributing to the TypeScript/Fastify UI/backend monorepo."
      - "Collaborated with client engineers to migrate from a legacy monolith to a service-oriented architecture, owning data-integrity and cutover work for the payments domain."
      - "Built a data projection-sync system bridging the payment service with the company-wide data lake, establishing a reusable ingestion pattern that unlocked downstream analytics and reporting on payment data."
      - "Designed a multi-step payment-calculation orchestrator with re-run support, turning ad-hoc payment processing into a repeatable, recoverable pipeline."
      - "Migrated the payment service to async database operations and hardened connection pooling, materially increasing throughput on large monthly capitation runs."
      - "Hardened production reliability by introducing database transaction guardrails, diagnosing infrastructure incidents, and resolving high-priority failures in financial report generation."
      - "Strengthened security and PHI protection through database privilege separation and sanitization of logging output on rollback paths."
    tech:
      - Python
      - FastAPI
      - Pydantic
      - SQLAlchemy
      - React
      - TypeScript
      - "Node.js/Fastify"
      - TanStack
      - Turborepo
      - PostgreSQL
      - AWS
      - Terraform
      - Docker
      - OpenTelemetry
  - role: "Senior Software Engineer"
    company: "Arvato Systems"
    location: "Latvia / Hybrid"
    start: "December 2024"
    end: "October 2025"
    onepage_highlights_num: 2
    highlights:
      - "Developed a ChatGPT-like RAG application for enterprise customers, enabling AI-powered applications over proprietary data (knowledge bases, documents, databases) with focus on performance, security, and cost-efficiency."
      - "Developed a performant and scalable PDF parsing solution as an Azure durable function for locating page numbers for specific text chunks."
      - "Maintained and developed new features for an API-as-a-service for building RAG-based flows."
    tech:
      - Python
      - FastAPI
      - Pydantic
      - "Azure Cloud"
      - "AI / LLM tools"
  - role: "Software Engineer"
    company: "FinTech Startup"
    location: "Latvia / Hybrid"
    start: "April 2024"
    end: "July 2024"
    onepage_include: false
    highlights:
      - "Contributed to a project for merchant risk score estimation based on factors such as payments from high-risk countries and multi-currency cross-border payments."
      - "Identified and advocated for SQL query optimization early before feature release while processing large volumes of payment rows."
    tech:
      - Ruby
      - "Ruby on Rails"
      - "Google Cloud"
      - Kibana
      - Grafana
  - role: "Software Engineer"
    company: "Prezi"
    location: "Latvia / Remote"
    start: "June 2020"
    end: "March 2024"
    onepage_highlights_num: 4
    highlights:
      - "Developed and maintained payment and subscription flows, including transforming user subscription accounts based on license type."
      - "Improved fraud prevention logic in trial payment flows and extended it to upgrade/renewal flows, reducing fraudulent chargebacks."
      - "Implemented cookie consent for EU visitors via third-party integration on top-funnel pages."
      - "Introduced Facebook Conversions API tracking from the backend, improving conversion data accuracy in analytics dashboards."
      - "Supported A/B tests on main traffic-receiving pages (prezi.com, /design, /product, /video) to identify layout and copy variants that improved business metrics."
      - "Integrated Invisible reCAPTCHA on sign-up pages; an experiment showed a 17% increase in registrations compared to visible reCAPTCHA."
      - "Shipped backend logic for downloading business invoices via authentication-less links in email campaigns."
      - "Maintained internal CMS and CRM; supported micro-services modernization (Python 2.7 upgrades, CI/CD migrations to GitHub Actions from Jenkins)."
    tech:
      - "Python / Django"
      - "React / TypeScript"
      - "AWS S3"
      - "RDS PostgreSQL"
      - "Java / Gherkin"
      - Grafana
  - role: "Software Engineer"
    company: "Infogram"
    location: "Riga"
    start: "2018"
    end: "June 2020"
    highlights:
      - "Led development of the infogram.com homepage and /templates pages built with Next.js."
      - "Introduced an integrations panel in the Infogram editor, allowing users to connect to database sources such as MySQL and PostgreSQL."
      - "Led UI modernization of the Prezi Design editor, which became part of the Prezi product suite."
      - "Migrated support.infogram.com to the Zendesk Help Center platform."
    tech:
      - React
      - "Node.js"
      - "Next.js"
  - role: "Web Developer"
    company: "Sehner International"
    location: "Riga / Hamburg"
    start: "August 2016"
    end: "December 2017"
    onepage_include: false
    highlights:
      - 'Developed and maintained pflegegrad-berechnen.de, a tool for calculating healthcare degrees for seniors in Germany — it reached the top SERP position for "pflegegrad berechnen".'
      - "Maintained sehner.international and pflegemarkt.com business websites."
      - "Developed customized WordPress theme websites for clients."
    tech:
      - PHP
      - WordPress
education:
  - degree: Bachelor
    institution: "Riga Technical University"
    location: Riga
    start: "2013"
    end: "2016"
    url: "https://nda.rtu.lv/en/view/16218"
    note: "Graduate paper"
certifications:
  - name: "AWS Certified Cloud Practitioner"
    issuer: "AWS Training & Certification"
    start: "December 2022"
    end: "December 2028"
    credentialId: "K2EV8P3CS2B410WR"
    url: "https://cp.certmetrics.com/amazon/en/public/verify/credential/K2EV8P3CS2B410WR"
  - name: "Microsoft Certified: Azure Fundamentals"
    start: "May 2025"
    url: "https://learn.microsoft.com/api/credentials/share/en-gb/alebyov/19158BE66DF6497F?sharingId=AFEDF744F9C79C11"
  - name: "Various Tech Courses"
    issuer: "Udemy"
    start: "2015"
    end: "present"
    url: "https://www.udemy.com/user/alexeyvorobyov/"
  - name: "Various Tech Courses"
    issuer: "Coursera"
    start: "2015"
    end: "present"
    url: "https://www.coursera.org/user/24d401e1022bf7551a05a07cefa7c4ed"
  - name: "Python Skills"
    issuer: "PyBites"
    start: "January 2021"
    end: "November 2021"
    url: "https://codechalleng.es/profiles/peacefulseeker"
---

## Summary

A strategic senior software engineer with over 7 years of experience in software engineering, specializing in building and maintaining robust SaaS applications across both monolithic and microservices architectures. My technical expertise spans the full stack, with a proficiency in Python (FastAPI, Pydantic, SQLAlchemy), modern TypeScript/JavaScript ecosystems (React, Node.js/Fastify, TanStack Query), and AWS infrastructure. I have decent experience with PostgreSQL, Docker, microservices architectures, and monorepo development patterns. I also bring experience from working with Ruby, PHP, and Azure Cloud in earlier roles.

Known for delivering resilient, customer-centric solutions within agile environments, I excel at translating complex business requirements into scalable technical implementations. I am seeking B2B opportunities where I can contribute to impactful and purposeful projects, leverage my experience to drive innovation, collaborate with talented professionals, and mentor young talent while continuing to expand my own technical capabilities.
