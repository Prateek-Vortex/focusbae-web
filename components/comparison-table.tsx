import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Product</TableHead>
            <TableHead>Focus Tracking</TableHead>
            <TableHead>LLM Agent</TableHead>
            <TableHead>Wellness Reminders</TableHead>
            <TableHead>Integrations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-muted/50">
            <TableCell className="font-medium">FocusBae</TableCell>
            <TableCell>
              <CheckCircle className="h-5 w-5 text-primary" />
            </TableCell>
            <TableCell>
              <CheckCircle className="h-5 w-5 text-primary" />
            </TableCell>
            <TableCell>
              <CheckCircle className="h-5 w-5 text-primary" />
            </TableCell>
            <TableCell className="flex items-center gap-1">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="text-sm">Coming soon</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">RescueTime</TableCell>
            <TableCell>
              <CheckCircle className="h-5 w-5 text-primary" />
            </TableCell>
            <TableCell>
              <XCircle className="h-5 w-5 text-gray-400" />
            </TableCell>
            <TableCell>
              <XCircle className="h-5 w-5 text-gray-400" />
            </TableCell>
            <TableCell>
              <XCircle className="h-5 w-5 text-gray-400" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Cluely</TableCell>
            <TableCell>
              <CheckCircle className="h-5 w-5 text-primary" />
            </TableCell>
            <TableCell>
              <XCircle className="h-5 w-5 text-gray-400" />
            </TableCell>
            <TableCell>
              <CheckCircle className="h-5 w-5 text-primary" />
            </TableCell>
            <TableCell className="flex items-center gap-1">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="text-sm">Limited</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Reclaim.ai</TableCell>
            <TableCell className="flex items-center gap-1">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="text-sm">Calendar only</span>
            </TableCell>
            <TableCell>
              <XCircle className="h-5 w-5 text-gray-400" />
            </TableCell>
            <TableCell>
              <XCircle className="h-5 w-5 text-gray-400" />
            </TableCell>
            <TableCell>
              <CheckCircle className="h-5 w-5 text-primary" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
