# ISKA RMS - Property Management System

## Project info

**Created by**: Ian Katana  
**Website**: https://iankatana.com

## 🚨 CRITICAL BUSINESS RULES

### **Student Booking & Invoice Creation Workflow**
This is a **MANDATORY BUSINESS RULE** that must be preserved in all future development.

**📋 Essential Workflow:**
1. When a student booking is created, invoices are **AUTOMATICALLY** generated
2. **Deposit Invoice:** £99 (fixed amount)
3. **Main Invoice:** Total booking amount
4. **Mini Invoices:** One per installment (if installment plan selected)
5. **Progress Tracking:** Real-time calculation based on payments

**⚠️ CRITICAL:** This automatic invoice creation process must **NEVER** be broken or removed.

**📖 Full Documentation:** See `STUDENT_BOOKING_INVOICE_WORKFLOW.md` for complete details.

---

## How can I edit this code?

There are several ways of editing your application.

**Use the Development Environment**

Simply run `npm run dev` to start the development server and begin working on the project.

Changes made locally will be reflected in real-time with hot reloading.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will be reflected in the repository.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project can be deployed using various hosting platforms such as Vercel, Netlify, or any other static hosting service.

For production deployment, build the project using `npm run build` and deploy the generated `dist` folder.

## Can I connect a custom domain to my project?

Yes, you can!

Most hosting platforms allow you to connect custom domains. Refer to your hosting provider's documentation for specific instructions on domain configuration.
