import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LeadStatusBadgeProps {
  status: string
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "qualified":
        return "blue"
      case "presentation":
        return "purple"
      case "proposal":
        return "green"
      case "commercial":
        return "orange"
      case "legal":
        return "yellow"
      case "won":
        return "success"
      case "lost":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getLabel = () => {
    switch (status) {
      case "qualified":
        return "Qualified Lead"
      case "presentation":
        return "Presentation"
      case "proposal":
        return "Proposal"
      case "commercial":
        return "Commercial"
      case "legal":
        return "Legal"
      case "won":
        return "Won"
      case "lost":
        return "Lost"
      default:
        return status
    }
  }

  return (
    <Badge
      className={cn(
        {
          "bg-blue-500 hover:bg-blue-600": getVariant() === "blue",
          "bg-purple-500 hover:bg-purple-600": getVariant() === "purple",
          "bg-green-500 hover:bg-green-600": getVariant() === "green",
          "bg-orange-500 hover:bg-orange-600": getVariant() === "orange",
          "bg-yellow-500 hover:bg-yellow-600 text-black": getVariant() === "yellow",
          "bg-red-500 hover:bg-red-600": getVariant() === "destructive",
          "bg-emerald-500 hover:bg-emerald-600": getVariant() === "success",
        },
        className,
      )}
    >
      {getLabel()}
    </Badge>
  )
}
