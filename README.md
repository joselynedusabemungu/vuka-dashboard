# VUKA

This repository contains the source code and development documentation for the Vuka. The website provides the web-based interface through which users can access the Vuka platform, create and manage their accounts, complete onboarding, view personalized content, track their progress, explore opportunities, and manage their profiles and setting

## Project Overview

Vuka is designed to provide users with a personalized digital experience based on information collected during registration and onboarding. The system matches the users interests to relevant social media content which helps them to build their skills and find relevant opportunities that they can explore.

## Key Features

**Registration**
Users can create an account by providing the required registration information.Additionally, they can also use a multi-factor authentication, which adds extra protection the users account.Upon successful registration, they are then taken to the onboarding page.

**Onboarding**
After registration, the users provide additional information that is, interests, goals and their mostly used social platforms.This enables us to match them with relevant social content.

**Dashboard**
The dashboard provides an overview of the user's activity and progress.

The dashboard displays information such as:

- Assessments scores
- Missions completed(videos watched)
- Progress

**Missions**
These are personalized videos that are generated after onboarding. The user is then matched with relevant social media content that they can use to build their skills.

**Assessments**
These are questions that the system generates from the videos that the users have watched. The system generates opportunities to the users based on the score the user has gotten from the assessments.

**Progress**
The Progress section provides users with information about their learning and activity progress.

This includes:

- Completed missions
- Completed assessments
- Overall progress

**Opportunities**
The Opportunities section presents opportunities that are relevant to the user's interests and goals.
These includes:

- Scholarships
- Boot-camps

### System Overview

```text
website/
├── app/
│   ├── home/
│   │   └── page.jsx
│   ├── navigation/
│   │   └── page.jsx
│   ├── settings/
│   │   └── page.jsx
│   ├── login/
│   │   └── page.jsx
│   ├── onboarding/
│   │   └── page.jsx
│   ├── progress/
│   │   └── page.jsx
│   ├── signup/
│   │   └── page.jsx
│   └── layout.jsx
├── lib/
│   └── api/
│       └── ...
├── public/
│   └── ...
├── package.json
├── next.config.js
└── README.md

```

### Installation

```bash
git clone git@github.com:akirachix/Beta_Dashboard.git
cd Beta_Dashboard

npm install

npm run dev

```
