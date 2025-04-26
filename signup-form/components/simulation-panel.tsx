"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Play, Pause, AlertTriangle } from "lucide-react"

interface SimulationPanelProps {
  onSimulate: () => void
  onToggleAutoSimulation: (isActive: boolean) => void
}

export function SimulationPanel({
  onSimulate,
  onToggleAutoSimulation
}: SimulationPanelProps) {
  const [isAutoSimulating, setIsAutoSimulating] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  
  const handleSimulate = async () => {
    setIsSimulating(true)
    await onSimulate()
    setIsSimulating(false)
  }
  
  const handleToggleAutoSimulation = () => {
    const newState = !isAutoSimulating
    setIsAutoSimulating(newState)
    onToggleAutoSimulation(newState)
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white">Simulation Controls</h3>
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full ${isAutoSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-500'} mr-2`}></span>
            <span className="text-xs text-gray-400">{isAutoSimulating ? 'Auto' : 'Manual'}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSimulating ? 'animate-spin' : ''}`} />
            Simulate Update
          </Button>
          
          <Button
            size="sm"
            variant={isAutoSimulating ? "destructive" : "outline"}
            className={isAutoSimulating ? "" : "border-white/30 text-white hover:bg-white/10"}
            onClick={handleToggleAutoSimulation}
          >
            {isAutoSimulating ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Auto
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Auto
              </>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 flex items-start mt-1">
          <AlertTriangle className="h-3 w-3 text-yellow-400 mr-1 mt-0.5" />
          <span>For demo purposes only. Simulates real-time updates via Ably.</span>
        </div>
      </div>
    </div>
  )
}
