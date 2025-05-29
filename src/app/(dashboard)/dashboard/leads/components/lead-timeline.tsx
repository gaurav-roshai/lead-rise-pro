import { Check, FileText, MessageSquare, Phone, Mail, CalendarX } from "lucide-react"

export function LeadTimeline(props: any) {
  // Function to get the appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "phone":
        return Phone;
      case "email":
        return Mail;
      case "meeting":
        return MessageSquare;
      case "document":
        return FileText;
      default:
        return Check;
    }
  }

  if (!props.activities || props.activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CalendarX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg mb-2">No Activities Yet</h3>
        <p className="text-sm text-muted-foreground">
          There are no activities recorded for this lead yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {props.activities.slice().reverse().map((event: any, index: number) => {
        const IconComponent = getActivityIcon(event.activityType);
        return (
          <div key={event.id} className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <div
                className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-[#1d91d8] text-primary-foreground"}
              >
                <IconComponent className="h-5 w-5" />
              </div>
              {index < props.activities.length - 1 && (
                <div className="absolute top-10 w-0.5 bg-border h-[calc(100%+2rem)] mt-0" />
              )}
            </div>
            <div className="pb-8 pt-1">
              <div className="text-sm text-muted-foreground">{new Date(event.dateAdded).toLocaleDateString()}</div>
              <div className="font-medium">{event.activityTitle}</div>
              <div className="text-sm text-muted-foreground mt-1">{event.activityDescription}</div>
            </div>
          </div>
        );
      })}
    </div>
  )
}
