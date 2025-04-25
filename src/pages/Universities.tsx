
import { Button } from "@/components/ui/button";
import { UniversityTable } from "@/components/universities/UniversityTable";
import { PlusCircle } from "lucide-react";

export default function Universities() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Universities</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add University
        </Button>
      </div>
      
      <UniversityTable />
    </div>
  );
}
