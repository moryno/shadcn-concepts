# Getting Started with Shadcn/UI Form & Table Components – A Beginner's Guide

## 📍 Overview

Every React developer transitioning from established UI libraries like Ant Design faces the challenge of adapting to new component patterns and APIs. This guide demonstrates how **Shadcn/UI** - a modern, headless component library - provides a flexible alternative for building forms and data tables. This beginner-friendly tutorial helps developers familiar with Ant Design understand Shadcn's approach to form validation, state management, and table rendering through a practical, runnable example.

## 🎯 Project Goals

- **Learn Shadcn/UI fundamentals** - Understanding the headless component approach vs traditional UI libraries
- **Create a working form-to-table application** - Demonstrating real-world data flow patterns
- **Document setup challenges** - Common issues and their solutions for smooth onboarding
- **Bridge Ant Design knowledge** - Helping developers translate familiar concepts to Shadcn patterns

## ✅ What You'll Learn

Master Shadcn/UI Form and Table components in 30 minutes with hands-on examples.

### What You'll Build

A user registration system that collects form data and displays it in a table. You'll learn:

- Form setup with multiple input types (text, email, date, select, checkbox)
- Form validation using Zod schemas
- State management for form-to-table data flow
- Error handling and loading states
- TypeScript integration for type safety

## Why Shadcn/UI?

**Technology Choice:** Shadcn/UI over traditional component libraries like Ant Design or Material-UI

**Why This Choice:**

- **Headless Architecture:** Full control over styling and behavior without being locked into specific design decisions
- **Copy-Paste Components:** Own your components instead of depending on external packages
- **Modern Stack:** Built on React Hook Form, Tailwind CSS, and Radix UI primitives
- **Type Safety:** First-class TypeScript support with excellent developer experience

**End Goal:** Build a production-ready form and table system that handles validation, state management, and user interactions with complete styling control.

## Quick Summary of Shadcn/UI

**What is it?**
Shadcn/UI is a component library that provides pre-built, customizable React components built on top of Radix UI primitives and styled with Tailwind CSS. Unlike traditional component libraries, Shadcn components are copied into your project, giving you full ownership and customization control.

**Where is it used?**
Modern web applications requiring flexible, accessible UI components. Companies building design systems, SaaS platforms, and custom web applications choose Shadcn for its flexibility and developer experience.

**Real-world example:** Vercel uses Shadcn/UI components in their dashboard and admin interfaces, allowing them to maintain consistent design while having complete control over component behavior and styling.

## Prerequisites

- Node.js 18+ installed
- Basic knowledge of React and TypeScript
- Familiarity with Ant Design Forms (helpful but not required)

## Step 1: Create Vite React Project

```bash
# Create new Vite project with React + TypeScript
npm create vite@latest shadcn-concept -- --template react-ts
cd shadcn-form-table
npm install
```

## Step 2: Install Shadcn/UI

```bash
npx shadcn@latest init
```

### Common Setup Issues & Solutions

#### Issue: "No import alias found in your tsconfig.json file"

**Problem:** Shadcn requires path aliases to work properly.

**Solution:** Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Issue: "Module not found: Can't resolve '@/components/ui/...'"

**Problem:** Vite doesn't recognize the path alias by default.

**Solution:** Update your `vite.config.ts`:

```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### Issue: TypeScript errors with path resolution

**Problem:** TypeScript can't find the aliased imports.

**Solution:** Install @types/node:

```bash
npm install -D @types/node
```

## Step 3: Install Required Shadcn Components

```bash
# Install all form-related components
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add button
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add table
npx shadcn@latest add label
npx shadcn@latest add card
```

## Step 4: Install Additional Dependencies

```bash
# Install date handling and form validation
npm install date-fns react-hook-form @hookform/resolvers zod
```

## Step 5: Project Structure

Your project should look like this:

```
src/
├── components/
│   └── ui/          # Shadcn components (auto-generated)
├── lib/
│   └── utils.ts     # Utility functions
├── App.tsx          # Main application
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Step 6: Complete Application Code

Replace your `src/App.tsx` with the following code:

```tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Step 1: Define form validation schema using Zod
// This is similar to Ant Design's form validation but uses Zod for type safety
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  birthDate: z.date({
    required_error: "A birth date is required.",
  }),
  department: z.string({
    required_error: "Please select a department.",
  }),
  isActive: z.boolean().default(false),
});

// Step 2: Define TypeScript types from schema
// This ensures type safety throughout the application
type FormData = z.infer<typeof formSchema>;

// Step 3: Define table data structure
interface TableData extends FormData {
  id: string;
  createdAt: string;
}

function App() {
  // Step 4: Set up state management for table data
  // Unlike Ant Design's dataSource prop, we manage state manually
  const [tableData, setTableData] = useState<TableData[]>([]);

  // Step 5: Initialize react-hook-form with Zod validation
  // This replaces Ant Design's Form.useForm() hook
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      isActive: false,
    },
  });

  // Step 6: Handle form submission
  // Similar to Ant Design's onFinish prop but manually manages state
  function onSubmit(values: FormData) {
    console.log("Form submitted with values:", values);

    // Create new table entry with unique ID and timestamp
    const newEntry: TableData = {
      ...values,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString(),
    };

    // Update table data state
    setTableData((prev) => [...prev, newEntry]);

    // Reset form after successful submission
    form.reset();

    // Optional: Show success message
    alert("User added successfully!");
  }

  // Step 7: Handle form errors
  // Shadcn forms handle errors automatically through FormMessage components
  function onError(errors: any) {
    console.log("Form validation errors:", errors);
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        Shadcn Form & Table Demo
      </h1>

      {/* Step 8: Form Card Component */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Registration Form</CardTitle>
          <CardDescription>
            Fill out the form below to add a new user to the table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 9: Shadcn Form Component Setup */}
          {/* Unlike Ant Design's Form component, Shadcn uses react-hook-form under the hood */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              {/* Step 10: Text Input Field */}
              {/* Similar to Ant Design's Form.Item + Input but with different syntax */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be displayed in the user table.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Step 11: Email Input Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Step 12: Date Picker Field */}
              {/* More complex than Ant Design's DatePicker, requires Popover + Calendar */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birth Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your date of birth is used to calculate your age.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Step 13: Select Dropdown Field */}
              {/* Similar to Ant Design's Select but with different API */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the department you belong to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Step 14: Checkbox Field */}
              {/* Different from Ant Design's Checkbox - uses different binding pattern */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active User</FormLabel>
                      <FormDescription>
                        Check this if the user account should be active
                        immediately.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Step 15: Submit Button */}
              {/* Similar to Ant Design's Button with htmlType="submit" */}
              <Button type="submit" className="w-full">
                Add User
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Step 16: Data Table Component */}
      {/* Unlike Ant Design's Table with dataSource prop, we manually map data */}
      <Card>
        <CardHeader>
          <CardTitle>Users Table ({tableData.length} entries)</CardTitle>
          <CardDescription>
            All submitted users will appear in this table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of registered users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No users registered yet. Fill out the form above to add
                    users.
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{format(user.birthDate, "PP")}</TableCell>
                    <TableCell className="capitalize">
                      {user.department}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "pp")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
```

## Step 7: Update Global Styles

Make sure your `src/index.css` includes the Shadcn base styles:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
  }
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

## Step 8: Run the Application

```bash
npm run dev

# Open browser to http://localhost:5173
```

## Key Differences from Ant Design

### Form Handling

- **Ant Design**: Uses `Form.useForm()` and `onFinish`
- **Shadcn**: Uses `react-hook-form` with `useForm()` and `handleSubmit`

### Validation

- **Ant Design**: Uses `rules` prop on Form.Item
- **Shadcn**: Uses Zod schema with `zodResolver`

### Form Fields

- **Ant Design**: Wraps inputs in `Form.Item` with `name` prop
- **Shadcn**: Uses `FormField` render prop pattern with `control`

### Table

- **Ant Design**: Declarative with `dataSource` and `columns` props
- **Shadcn**: Manual JSX mapping of data to table rows

## Common Edge Cases & Advanced Solutions

### 1. Date Picker Mobile Compatibility

```tsx
// Problem: Date picker doesn't work well on mobile devices
// Solution: Add mobile-specific configuration and fallbacks
<Calendar
  mode="single"
  selected={field.value}
  onSelect={field.onChange}
  disabled={(date) => date > new Date()}
  initialFocus
  className="rounded-md border"
  // Mobile optimization
  showOutsideDays={false}
  fixedWeeks={true}
/>
```

### 2. Form Reset Edge Cases

```tsx
// Problem: Form doesn't reset properly with complex nested data
// Solution: Provide complete default values and handle async resets
const handleFormReset = () => {
  form.reset({
    name: "",
    email: "",
    birthDate: undefined, // Important: use undefined for optional dates
    department: undefined,
    isActive: false,
  });

  // Clear any lingering validation errors
  form.clearErrors();
};

// Problem: Form state persists between route changes
// Solution: Reset form in useEffect
useEffect(() => {
  return () => {
    form.reset(); // Cleanup on unmount
  };
}, [form]);
```

### 3. Select Component Value Synchronization

```tsx
// Problem: Select doesn't properly sync with form state
// Solution: Explicitly handle value and onChange
<FormField
  control={form.control}
  name="department"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Department</FormLabel>
      <Select
        onValueChange={(value) => {
          field.onChange(value);
          // Optional: trigger other form updates
          form.trigger("department");
        }}
        value={field.value || ""} // Handle undefined values
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="">None Selected</SelectItem>{" "}
          {/* Always include empty option */}
          <SelectItem value="engineering">Engineering</SelectItem>
          {/* ... other options */}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 4. Checkbox Boolean Handling Complexities

```tsx
// Problem: Checkbox returns CheckedState (true | false | "indeterminate")
// Solution: Properly handle all possible states
<FormField
  control={form.control}
  name="isActive"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value === true} // Explicit boolean check
          onCheckedChange={(checked) => {
            // Handle indeterminate state
            if (checked === "indeterminate") {
              field.onChange(false);
            } else {
              field.onChange(checked === true);
            }
          }}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Active User</FormLabel>
      </div>
    </FormItem>
  )}
/>
```

### 5. Form Validation Timing and Performance

```tsx
// Problem: Validation fires too frequently, causing performance issues
// Solution: Configure validation modes strategically
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  mode: "onBlur", // Validate on blur instead of onChange
  reValidateMode: "onChange", // Re-validate on change after first validation
  shouldFocusError: true, // Automatically focus first error field
  shouldUnregister: false, // Keep unmounted field values
  shouldUseNativeValidation: false, // Use react-hook-form validation
});

// For expensive validation, debounce the validation
import { useDebouncedCallback } from "use-debounce";

const debouncedValidation = useDebouncedCallback((value: string) => {
  form.trigger("email"); // Manually trigger validation
}, 300);
```

### 6. Dynamic Schema Validation

```tsx
// Problem: Need conditional validation based on other field values
// Solution: Use Zod's refine and superRefine methods
const formSchema = z
  .object({
    userType: z.enum(["student", "teacher", "admin"]),
    email: z.string().email(),
    studentId: z.string().optional(),
  })
  .refine(
    (data) => {
      // Custom validation: students must have student ID
      if (data.userType === "student" && !data.studentId) {
        return false;
      }
      return true;
    },
    {
      message: "Student ID is required for student accounts",
      path: ["studentId"], // Show error on studentId field
    }
  );
```

### 7. Form Field Dependencies and Conditional Rendering

```tsx
// Problem: Need to show/hide fields based on other field values
// Solution: Use form.watch() to track field changes
function ConditionalForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Watch specific fields for changes
  const userType = form.watch("userType");
  const isStudent = userType === "student";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Base fields */}
        <FormField name="userType" control={form.control} render={({ field }) => (
          // ... select field for user type
        )} />

        {/* Conditional field - only show for students */}
        {isStudent && (
          <FormField
            name="studentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
```

## Advanced Tips

### Custom Validation Messages

```tsx
const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});
```

### Dynamic Form Fields

```tsx
// Add conditional fields based on other field values
const department = form.watch("department");

{
  department === "engineering" && (
    <FormField
      name="programmingLanguage"
      // ... additional field for engineers only
    />
  );
}
```

### Table Actions

```tsx
// Add edit/delete actions to table rows
<TableCell>
  <Button variant="outline" size="sm" onClick={() => handleEdit(user.id)}>
    Edit
  </Button>
</TableCell>
```

## Troubleshooting Common Setup Issues

### Issue: "Cannot find module '@/components/ui/...'"

**Problem:** Import alias not configured properly.

**Solution 1:** Verify `tsconfig.json` paths:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

**Solution 2:** Update `vite.config.ts`:

```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Solution 3:** Install required dev dependency:

```bash
npm install -D @types/node
```

### Issue: Form validation not working

**Problem:** Zod schema not properly connected to react-hook-form.

**Solution:** Verify resolver setup:

```tsx
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<FormData>({
  resolver: zodResolver(formSchema), // Must use zodResolver
  defaultValues: {
    // Provide defaults for all fields
    name: "",
    email: "",
    isActive: false,
  },
});
```

## Final Package.json Dependencies

Your final `package.json` should include these key dependencies:

```json
{
  "name": "shadcn-concepts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.1",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-slot": "^1.2.3",
    "autoprefixer": "^10.4.21",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.539.0",
    "postcss": "^8.5.6",
    "react": "^19.1.1",
    "react-day-picker": "^9.8.1",
    "react-dom": "^19.1.1",
    "react-hook-form": "^7.62.0",
    "tailwindcss": "^3.4.17",
    "zod": "^4.0.17"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@types/node": "^24.2.1",
    "@types/react": "^19.1.9",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^4.7.0",
    "eslint": "^9.32.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "tw-animate-css": "^1.3.6",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.39.0",
    "vite": "^7.1.0"
  }
}
```

## Running the Project

### For First-Time Setup:

```bash
# Clone
git clone
cd shadcn-concepts

npm install
npm run dev

```

### For Development:

```bash
npm run dev
```

## Migration from Ant Design - Key Differences

### Form API Comparison

| Feature        | Ant Design             | Shadcn/UI                            |
| -------------- | ---------------------- | ------------------------------------ |
| Form Hook      | `Form.useForm()`       | `useForm()` from react-hook-form     |
| Validation     | `rules` array          | Zod schema with `zodResolver`        |
| Field Wrapper  | `<Form.Item>`          | `<FormField render={...}>`           |
| Submit Handler | `onFinish` prop        | `handleSubmit(onSubmit)`             |
| Field Access   | `form.getFieldValue()` | `form.getValues()` or `form.watch()` |
| Reset Form     | `form.resetFields()`   | `form.reset()`                       |

### Table API Comparison

| Feature       | Ant Design             | Shadcn/UI                      |
| ------------- | ---------------------- | ------------------------------ |
| Data Source   | `dataSource` prop      | Manual state management        |
| Columns       | `columns` array config | Manual JSX table structure     |
| Loading       | `loading` prop         | Custom loading states          |
| Pagination    | Built-in `pagination`  | Manual pagination logic        |
| Row Selection | `rowSelection` prop    | Custom checkbox implementation |

**Problem-Solving and Learning Context Prompt:**
[Learning a New Programming Language with AI](https://ai.moringaschool.com/ai-software/learning-with-ai/learning-new-language/#_2_1_using_context_effectively)
[Learn a new framework, library or API](https://ai.moringaschool.com/ai-software/learning-with-ai/learning-new-language/#_2_1_using_context_effectively)

**Documentation Prompt:**
[Project README documentation.](https://ai.moringaschool.com/ai-software/ai-use-cases/usecases-documentation/#_prompt_1_project_readme_generation)

### 💭 Learning Reflections

**What AI Helped With:**

- **Concept Clarity:** AI provided a solid foundation for building forms and tables with Shadcn/UI, giving me type safety, proper validation, and complete control over styling and behavior while maintaining familiar patterns for developers coming from Ant Design.
- **Documentation Structure:** AI helped organize information in a logical, learner-friendly flow

**Productivity Impact:**

- Reduced learning time from estimated 2-3 days to 4-6 hours
- AI provided multiple implementation approaches, error handling, edge cases, allowing me to choose the most beginner-friendly

**Key Learning Insight:** AI helped in setting up Shadcn UI component and spinning of React application fast, excels at breaking down complex topics into digestible chunks and anticipating user questions, making it an excellent learning companion for new framework.

## Helpful Resources

### Official Documentation

- [Get started with Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite) - Complete guide
- [Import alias](https://ui.shadcn.com/docs/installation/vite) - All options explained
