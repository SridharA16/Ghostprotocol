import { useState, useEffect } from "react";
import { ContentPost } from "@/types/content";
import { ContentService } from "@/lib/contentService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Copy, Calendar as CalendarIcon, Clock, Edit, Save, X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
// Force rebuild to fix Dialog reference issue

interface PostDetailModalProps {
  post: ContentPost | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export default function PostDetailModal({ post, isOpen, onClose, onUpdate, onDelete }: PostDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedPost, setEditedPost] = useState<Partial<ContentPost>>({});
  const [currentPost, setCurrentPost] = useState<ContentPost | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setCurrentPost(post);
      setEditedPost({
        title: post.title,
        content: post.content,
        status: post.status,
        platform: post.platform,
        tags: post.tags
      });
      if (post.scheduled_date) {
        const date = new Date(post.scheduled_date);
        setScheduledDate(date);
        setScheduledTime(format(date, "HH:mm"));
      } else {
        setScheduledDate(undefined);
        setScheduledTime("");
      }
    }
  }, [post]);

  const handleSave = async () => {
    if (!post || !editedPost.title || !editedPost.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    // Validate scheduling if status is scheduled
    if (editedPost.status === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      toast({
        title: "Error",
        description: "Date and time are required for scheduled posts",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let finalScheduledDate: string | null = null;
      
      if (editedPost.status === 'scheduled' && scheduledDate && scheduledTime) {
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const combinedDate = new Date(scheduledDate);
        combinedDate.setHours(hours, minutes, 0, 0);
        
        // Validate future date
        if (combinedDate <= new Date()) {
          toast({
            title: "Error",
            description: "Scheduled date must be in the future",
            variant: "destructive",
          });
          return;
        }
        
        finalScheduledDate = combinedDate.toISOString();
      }

      // Immediately update currentPost state for instant UI feedback
      const updatedStatePost = {
        ...post,
        title: editedPost.title!,
        content: editedPost.content!,
        status: editedPost.status!,
        platform: editedPost.platform,
        tags: editedPost.tags,
        scheduled_date: finalScheduledDate,
        updated_at: new Date().toISOString()
      };
      setCurrentPost(updatedStatePost);

      const updateData = {
        title: editedPost.title,
        content: editedPost.content,
        status: editedPost.status,
        platform: editedPost.platform,
        tags: editedPost.tags,
        scheduled_date: finalScheduledDate
      };

      const updatedPost = await ContentService.updatePost(post.id, updateData);
      
      // Final update with API response data
      setCurrentPost(updatedPost);

      toast({
        title: "Success",
        description: "Post updated successfully",
      });

      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsLoading(true);
    try {
      await ContentService.deletePost(post.id);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      onDelete?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!post?.content) return;
    
    try {
      await navigator.clipboard.writeText(post.content);
      toast({
        title: "Copied!",
        description: "Post content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      case 'archived': return 'destructive';
      default: return 'outline';
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              {isEditing ? "Edit Post" : currentPost?.title || "Untitled Post"}
            </DialogTitle>
            <Badge variant={getStatusBadgeVariant(currentPost?.status || post.status)}>
              {currentPost?.status || post.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedPost.title || ""}
                  onChange={(e) => setEditedPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editedPost.content || ""}
                  onChange={(e) => setEditedPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter post content"
                  className="min-h-[200px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedPost.status || ""}
                    onValueChange={(value) => {
                      setEditedPost(prev => ({ ...prev, status: value as any }));
                      // Clear scheduled date if changing away from scheduled
                      if (value !== 'scheduled') {
                        setScheduledDate(undefined);
                        setScheduledTime("");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={editedPost.platform || ""}
                    onValueChange={(value) => setEditedPost(prev => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    Schedule Date 
                    {editedPost.status === 'scheduled' ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">(optional)</span>
                    )}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={editedPost.status !== 'scheduled'}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : 
                         editedPost.status !== 'scheduled' ? "Only available for scheduled posts" : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={(date) => {
                          setScheduledDate(date);
                          // Auto-change status to scheduled when date is selected
                          if (date && editedPost.status !== 'scheduled') {
                            setEditedPost(prev => ({ ...prev, status: 'scheduled' }));
                          }
                        }}
                        disabled={(date) => date < new Date() || editedPost.status !== 'scheduled'}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time" className="flex items-center gap-2">
                    Schedule Time
                    {editedPost.status === 'scheduled' ? (
                      <span className="text-destructive">*</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">(optional)</span>
                    )}
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => {
                      setScheduledTime(e.target.value);
                      // Auto-change status to scheduled when time is selected
                      if (e.target.value && scheduledDate && editedPost.status !== 'scheduled') {
                        setEditedPost(prev => ({ ...prev, status: 'scheduled' }));
                      }
                    }}
                    disabled={editedPost.status !== 'scheduled'}
                    placeholder={editedPost.status !== 'scheduled' ? "Only for scheduled posts" : ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={editedPost.tags?.join(", ") || ""}
                  onChange={(e) => setEditedPost(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                  }))}
                  placeholder="social media, marketing, content"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Content</h3>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {currentPost?.content}
                </div>
              </div>

              {currentPost?.platform && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Platform</h3>
                  <Badge variant="outline">{currentPost.platform}</Badge>
                </div>
              )}

              {currentPost?.tags && currentPost.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPost.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentPost?.scheduled_date && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Scheduled For</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(currentPost.scheduled_date), "PPP")}
                    <Clock className="h-4 w-4 ml-2" />
                    {format(new Date(currentPost.scheduled_date), "HH:mm")}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-1">Created</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(currentPost?.created_at || post.created_at), "PPP 'at' HH:mm")}
                </p>
              </div>

              {(currentPost?.updated_at || post.updated_at) !== (currentPost?.created_at || post.created_at) && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(currentPost?.updated_at || post.updated_at), "PPP 'at' HH:mm")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                {(currentPost?.status || post.status) !== 'scheduled' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(true);
                      setEditedPost(prev => ({ ...prev, status: 'scheduled' }));
                    }}
                    className="flex items-center gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Schedule Post
                  </Button>
                )}
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Post
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}