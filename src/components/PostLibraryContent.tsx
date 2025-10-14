import { useState, useEffect } from "react"
import { Search, MoreHorizontal, Copy, Edit, Trash2, FileText, MessageCircle, Eye, Calendar as CalendarIcon } from "lucide-react"
import { ContentPost } from "@/types/content"
import { ContentService } from "@/lib/contentService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import PostDetailModal from "./PostDetailModal"

export default function PostLibraryContent() {
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const loadPosts = async () => {
    try {
      setLoading(true)
      const allPosts = await ContentService.getAllPosts()
      setPosts(allPosts)
      setFilteredPosts(allPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    let filtered = posts

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(post => 
        (post.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(post => post.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(post => post.content_type === typeFilter)
    }

    setFilteredPosts(filtered)
  }, [posts, searchQuery, statusFilter, typeFilter])

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      })
    } catch (error) {
      console.error('Error copying content:', error)
      toast({
        title: "Error",
        description: "Failed to copy content.",
        variant: "destructive",
      })
    }
  }

  const handleViewPost = (post: ContentPost) => {
    setSelectedPost(post)
    setIsDetailModalOpen(true)
  }

  const handleDeletePost = async (postId: string) => {
    try {
      await ContentService.deletePost(postId)
      toast({
        title: "Success",
        description: "Post deleted successfully.",
      })
      loadPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDuplicatePost = async (postId: string) => {
    try {
      await ContentService.duplicatePost(postId)
      toast({
        title: "Success",
        description: "Post duplicated successfully.",
      })
      loadPosts()
    } catch (error) {
      console.error('Error duplicating post:', error)
      toast({
        title: "Error",
        description: "Failed to duplicate post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: ContentPost['status']) => {
    switch (status) {
      case 'published': return 'default'
      case 'scheduled': return 'secondary'
      case 'draft': return 'outline'
      case 'archived': return 'destructive'
      default: return 'outline'
    }
  }

  const getTypeIcon = (type: ContentPost['content_type']) => {
    switch (type) {
      case 'create_post': return <MessageCircle className="h-4 w-4" />
      case 'lead_magnet': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 data-grid bg-noise">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative overflow-hidden mb-8">
          <div className="relative overflow-hidden z-0">
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 mb-2 animate-pulse-glow animate-scan relative z-10">
            Post Library
          </h1>
          <div className="h-px bg-gradient-to-r from-primary to-transparent mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Manage and organize all your content posts
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="futuristic-border glow-hover backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 futuristic-border"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 futuristic-border">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover backdrop-blur-md border shadow-lg futuristic-border">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 futuristic-border">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover backdrop-blur-md border shadow-lg futuristic-border">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="create_post">Create Post</SelectItem>
                      <SelectItem value="lead_magnet">Lead Magnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="border-0 bg-card/50 backdrop-blur-sm shadow-lg animate-data-pulse"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-primary flex-shrink-0">
                      {getTypeIcon(post.content_type)}
                    </div>
                    <CardTitle className="text-lg font-medium truncate max-w-[calc(100%-4rem)]">
                      {post.title || 'Untitled Post'}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover backdrop-blur-md border shadow-lg">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleCopyContent(post.content)
                      }}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Content
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleViewPost(post)
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicatePost(post.id)
                      }}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePost(post.id)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant={getStatusBadgeVariant(post.status)}>
                      {post.status}
                    </Badge>
                    <span>Created {format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                    {post.scheduled_date && (
                      <span className="text-primary font-medium">
                        Scheduled {format(new Date(post.scheduled_date), 'MMM d, yyyy')}
                      </span>
                    )}
                    {post.platform && (
                      <span className="capitalize">{post.platform}</span>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="px-1 py-0 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewPost(post)
                    }}
                    className="mt-4 w-full justify-center"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first post to get started"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedPost(null)
        }}
        onUpdate={loadPosts}
        onDelete={loadPosts}
      />
    </div>
  )
}