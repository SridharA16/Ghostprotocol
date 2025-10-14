import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar, Clock, Edit, Trash2 } from "lucide-react"
import { ContentPost } from "@/types/content"
import { ContentService } from "@/lib/contentService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { cn } from "@/lib/utils"
import PostDetailModal from "./PostDetailModal"

export default function ContentCalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar')
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const loadScheduledPosts = async () => {
    try {
      setLoading(true)
      const startOfMonthDate = startOfMonth(selectedDate)
      const endOfMonthDate = endOfMonth(selectedDate)
      const scheduledPosts = await ContentService.getScheduledPosts(startOfMonthDate, endOfMonthDate)
      setPosts(scheduledPosts)
    } catch (error) {
      console.error('Error loading scheduled posts:', error)
      toast({
        title: "Error",
        description: "Failed to load scheduled posts.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScheduledPosts()
  }, [selectedDate])

  const getPostsForDate = (date: Date): ContentPost[] => {
    return posts.filter(post => {
      if (!post.scheduled_date) return false
      return isSameDay(new Date(post.scheduled_date), date)
    })
  }

  const handleDeletePost = async (postId: string) => {
    try {
      await ContentService.deletePost(postId)
      toast({
        title: "Success",
        description: "Post deleted successfully.",
      })
      loadScheduledPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: "Error", 
        description: "Failed to delete post.",
        variant: "destructive",
      })
    }
  }

  const handleViewPost = (post: ContentPost) => {
    setSelectedPost(post)
    setIsDetailModalOpen(true)
  }

  const renderCalendarView = () => {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateRange = eachDayOfInterval({
      start: startDate,
      end: endDate
    })

    return (
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
        
        {/* Calendar Grid */}
        {dateRange.map((date, index) => {
          const dayPosts = getPostsForDate(date)
          const isCurrentMonth = isSameMonth(date, selectedDate)
          const isToday = isSameDay(date, new Date())
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-[80px] md:min-h-[120px] p-1 md:p-2 border rounded-lg relative",
                isCurrentMonth ? "bg-card" : "bg-muted/50",
                isToday && "ring-2 ring-primary"
              )}
            >
              <div className={cn(
                "text-sm font-medium mb-1",
                isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                isToday && "text-primary font-bold"
              )}>
                {format(date, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayPosts.slice(0, 2).map((post) => (
                  <Popover key={post.id}>
                    <PopoverTrigger asChild>
                      <div className="text-xs p-1 bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20 transition-colors truncate">
                        {post.title}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-popover backdrop-blur-md border shadow-lg">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                            {post.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.status}</Badge>
                          <Badge variant="secondary">{post.content_type.replace('_', ' ')}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewPost(post)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
                {dayPosts.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayPosts.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderTimelineView = () => {
    const sortedPosts = [...posts].sort((a, b) => {
      if (!a.scheduled_date || !b.scheduled_date) return 0
      return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    })

    return (
      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <Card key={post.id} className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <Badge variant="outline" className="flex-shrink-0">{post.status}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {post.scheduled_date && format(new Date(post.scheduled_date), 'MMM d, yyyy at h:mm a')}
                    </span>
                    <Badge variant="secondary">{post.content_type.replace('_', ' ')}</Badge>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handleViewPost(post)}>
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Edit</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeletePost(post.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {sortedPosts.length === 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scheduled posts</h3>
              <p className="text-muted-foreground">
                Schedule your first post to see it appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading calendar...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-500/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Calendar
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-2 animate-pulse-glow">
            Content Calendar
          </h1>
          <p className="text-lg text-muted-foreground">
            Plan and schedule your content strategy
          </p>
        </div>

        {/* Controls */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Timeline</span>
                </Button>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold min-w-[140px] text-center">
                  {format(selectedDate, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar/Timeline View */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 md:p-6">
            {viewMode === 'calendar' ? renderCalendarView() : renderTimelineView()}
          </CardContent>
        </Card>
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedPost(null)
        }}
        onUpdate={loadScheduledPosts}
        onDelete={loadScheduledPosts}
      />
    </div>
  )
}