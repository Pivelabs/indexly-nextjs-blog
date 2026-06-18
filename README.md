# Indexly Sample Blog

Follow these step-by-step instructions to set up and run the project locally.

---

## Prerequisites

Before starting, ensure you have the following installed on your machine:

* **Node.js** (v18 or higher recommended)
* **pnpm** (Package Manager)
* **Git** configured with your SSH keys

---

## Setup Instructions

### 1. Clone the Repository

Clone the repository using SSH and navigate into the project directory:

```bash
git clone git@github.com:Pivelabs/indexly-sample-blog.git
cd indexly-sample-blog

```

### 2. Install Dependencies

Install the required dependencies using `pnpm`:

```bash
pnpm i

```

### 3. Configure Environment Variables

Copy the sample environment file to create your local configurations:

```bash
cp .env.sample .env

```

> **Note:** Open the newly created `.env` file in your code editor and fill in the required values as guided by the placeholders.

### 4. Run the Development Server

Start the local development server:

```bash
pnpm dev

```

The application should now be running locally. Check your terminal output for the local server URL (typically `http://localhost:3000`).