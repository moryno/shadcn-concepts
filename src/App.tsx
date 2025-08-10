import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
})

// Step 2: Define TypeScript types from schema
// This ensures type safety throughout the application
type FormData = z.infer<typeof formSchema>

// Step 3: Define table data structure
interface TableData extends FormData {
  id: string
  createdAt: string
}

function App() {
  // Step 4: Set up state management for table data
  // Unlike Ant Design's dataSource prop, we manage state manually
  const [tableData, setTableData] = useState<TableData[]>([])

  // Step 5: Initialize react-hook-form with Zod validation
  // This replaces Ant Design's Form.useForm() hook
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      isActive: false,
    },
  })

  // Step 6: Handle form submission
  // Similar to Ant Design's onFinish prop but manually manages state
  function onSubmit(values: FormData) {
    console.log('Form submitted with values:', values)
    
    // Create new table entry with unique ID and timestamp
    const newEntry: TableData = {
      ...values,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString(),
    }

    // Update table data state
    setTableData(prev => [...prev, newEntry])
    
    // Reset form after successful submission
    form.reset()
    
    // Optional: Show success message
    alert('User added successfully!')
  }

  // Step 7: Handle form errors
  // Shadcn forms handle errors automatically through FormMessage components
  function onError(errors: any) {
    console.log('Form validation errors:', errors)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Shadcn Form & Table Demo</h1>
      
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
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
              
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
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <FormLabel>
                        Active User
                      </FormLabel>
                      <FormDescription>
                        Check this if the user account should be active immediately.
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
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No users registered yet. Fill out the form above to add users.
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{format(user.birthDate, 'PP')}</TableCell>
                    <TableCell className="capitalize">{user.department}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(user.createdAt), 'pp')}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default App