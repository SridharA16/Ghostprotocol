import React from 'react';
import { TrendingUp, Calendar, Edit, Target } from 'lucide-react';

interface ContentProductionOverviewProps {
  totalPosts: number;
  scheduledThisWeek: number;
}

export const ContentProductionOverview: React.FC<ContentProductionOverviewProps> = ({ 
  totalPosts, 
  scheduledThisWeek 
}) => {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-background via-background to-red-500/5 rounded-lg overflow-hidden border border-red-500/20 futuristic-border glow-hover">
      {/* Background grid */}
      <div className="absolute inset-0 data-grid opacity-20"></div>
      <div className="absolute inset-0 bg-noise opacity-10"></div>
      
      {/* Animated scanning line */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-scan"></div>
      </div>

      {/* Content Production Metrics */}
      <div className="relative h-full flex items-center justify-center p-6">
        <div className="grid grid-cols-2 gap-8 w-full max-w-md">
          {/* Total Posts Metric */}
          <div className="text-center space-y-2">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center animate-pulse-glow">
                <Edit className="h-8 w-8 text-red-400 drop-shadow-glow" />
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-16 h-16 mx-auto border-2 border-red-500/30 rounded-full animate-data-pulse"></div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-400 animate-pulse-glow">
                {totalPosts}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Posts
              </div>
            </div>
          </div>

          {/* Scheduled Posts Metric */}
          <div className="text-center space-y-2">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center animate-data-pulse">
                <Calendar className="h-8 w-8 text-blue-400 drop-shadow-glow" />
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-16 h-16 mx-auto border-2 border-blue-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-400 animate-data-pulse">
                {scheduledThisWeek}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                This Week
              </div>
            </div>
          </div>
        </div>

        {/* Central connection line */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-px bg-gradient-to-r from-red-500/50 via-primary/50 to-blue-500/50 animate-data-pulse"></div>
      </div>

      {/* Performance indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-mono uppercase tracking-wider">Production Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-3 w-3 text-red-400" />
            <span className="text-xs text-red-400 font-mono">+{Math.round((totalPosts / Math.max(1, totalPosts - 1)) * 100 - 100)}%</span>
          </div>
        </div>
      </div>

      {/* Corner brackets for futuristic feel */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-500/40"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-500/40"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-500/40"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-500/40"></div>
    </div>
  );
};