import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)}
      {...props}
    />
  )
}

// Skeleton for cards
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-white p-6 shadow-sm", className)}>
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-1/4" />
      </div>
    </div>
  )
}

// Skeleton for table rows
function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

// Skeleton for table header
function TableHeaderSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <thead>
      <tr className="border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <th key={i} className="px-4 py-3 text-left">
            <Skeleton className="h-4 w-24" />
          </th>
        ))}
      </tr>
    </thead>
  )
}

// Skeleton for entire table
function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-lg border bg-white">
      <table className="w-full">
        <TableHeaderSkeleton columns={columns} />
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Skeleton for list items
function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-4 p-4", className)}>
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  )
}

// Skeleton for list
function ListSkeleton({ items = 5, className }: { items?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  )
}

// Skeleton for form fields
function FormFieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

// Skeleton for form
function FormSkeleton({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <FormFieldSkeleton key={i} />
      ))}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

// Skeleton for dashboard cards
function DashboardCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  )
}

// Skeleton for dashboard grid
function DashboardGridSkeleton({ cards = 4, className }: { cards?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {Array.from({ length: cards }).map((_, i) => (
        <DashboardCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Skeleton for chart
function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-white p-6 shadow-sm", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

// Skeleton for stats cards
function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <div className="mt-2">
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

// Skeleton for profile/avatar
function AvatarSkeleton({ size = "default", className }: { size?: "sm" | "default" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12"
  }
  
  return (
    <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
  )
}

// Skeleton for text lines
function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  )
}

// Skeleton for buttons
function ButtonSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-20 rounded-md", className)} />
}

// Skeleton for badges
function BadgeSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-6 w-16 rounded-full", className)} />
}

// Skeleton for progress bar
function ProgressSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-2 w-full rounded-full", className)} />
}

// Skeleton for tabs
function TabsSkeleton({ tabs = 3, className }: { tabs?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex space-x-2 border-b">
        {Array.from({ length: tabs }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

// Skeleton for modal/dialog
function ModalSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-white p-6 shadow-lg max-w-md", className)}>
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-16" />
        </div>
      </div>
    </div>
  )
}

export {
  Skeleton,
  CardSkeleton,
  TableRowSkeleton,
  TableHeaderSkeleton,
  TableSkeleton,
  ListItemSkeleton,
  ListSkeleton,
  FormFieldSkeleton,
  FormSkeleton,
  DashboardCardSkeleton,
  DashboardGridSkeleton,
  ChartSkeleton,
  StatsCardSkeleton,
  AvatarSkeleton,
  TextSkeleton,
  ButtonSkeleton,
  BadgeSkeleton,
  ProgressSkeleton,
  TabsSkeleton,
  ModalSkeleton,
}