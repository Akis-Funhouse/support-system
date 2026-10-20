import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

export default function ItSystem() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>IT System Support</CardTitle>
          <CardDescription>You can create a ticket, describe the problem you're having and then send it in to our IT support team.</CardDescription>
        </CardHeader>

        <CardContent>
          <p>Ticket Content</p>
        </CardContent>

        <CardFooter>
          <p>Ticket Footer</p>
        </CardFooter>
        <Button variant="outline">Send ticket</Button>
      </Card>
    </div>
  )
}
