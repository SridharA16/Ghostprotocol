import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, Copy, Edit3, Loader2, Sparkles, Save, RotateCcw, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ContentService } from "@/lib/contentService";

// Form schema for lead magnet generation
const formSchema = z.object({
  resourceType: z.string().min(1, "Please select a resource type"),
  resourceOutline: z.string().min(10, "Resource outline must be at least 10 characters"),
  engagementOptions: z.object({
    connect: z.boolean(),
    like: z.boolean(),
    repost: z.boolean(),
    comment: z.boolean(),
  }),
  commentKeyword: z.string().optional(),
}).refine((data) => {
  // If comment is checked, commentKeyword must be provided
  if (data.engagementOptions.comment && (!data.commentKeyword || data.commentKeyword.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Comment keyword is required when comment option is selected",
  path: ["commentKeyword"],
});

type FormData = z.infer<typeof formSchema>;

const resourceTypes = [
  'Info Document',
  'Automation Workflow', 
  'Video Masterclass',
  'Process Map',
  'Complete System Giveaway',
  'High Value Template'
];

export default function LeadMagnet() {
  const [generatedPost, setGeneratedPost] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [changeRequest, setChangeRequest] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();

  const leadMagnetWebhookUrl = import.meta.env.VITE_LEAD_MAGNET_WEBHOOK_URL;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resourceType: "",
      resourceOutline: "",
      engagementOptions: {
        connect: false,
        like: false,
        repost: false,
        comment: false,
      },
      commentKeyword: "",
    },
  });

  const commentEnabled = form.watch("engagementOptions.comment");

  // Clear comment keyword when comment is unchecked
  useEffect(() => {
    if (!commentEnabled) {
      form.setValue("commentKeyword", "");
    }
  }, [commentEnabled, form]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const webhookData = {
        action: "generate_leadmagnet",
        resourceType: data.resourceType,
        resourceOutline: data.resourceOutline,
        engagementOptions: {
          connect: data.engagementOptions.connect,
          like: data.engagementOptions.like,
          repost: data.engagementOptions.repost,
          comment: data.engagementOptions.comment,
          commentKeyword: data.engagementOptions.comment ? data.commentKeyword : undefined,
        }
      };

      console.log("Sending webhook data:", webhookData);
      
      if (!leadMagnetWebhookUrl) {
        throw new Error("Lead magnet webhook URL not configured");
      }

      const response = await fetch(
        leadMagnetWebhookUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setGeneratedPost(result.content || "Generated content will appear here...");
      setEditedContent(result.content || "");
      toast({
        title: "Success!",
        description: "Lead magnet post generated successfully.",
      });
    } catch (error) {
      console.error("Error generating lead magnet post:", error);
      toast({
        title: "Error",
        description: "Failed to generate lead magnet post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubmit = async () => {
    if (!changeRequest.trim()) {
      toast({
        title: "Error",
        description: "Please describe what changes you'd like to make.",
        variant: "destructive",
      });
      return;
    }

    setIsRegenerating(true);
    try {
      const formData = form.getValues();
      const webhookData = {
        action: "refine_leadmagnet",
        resourceType: formData.resourceType,
        resourceOutline: formData.resourceOutline,
        engagementOptions: {
          connect: formData.engagementOptions.connect,
          like: formData.engagementOptions.like,
          repost: formData.engagementOptions.repost,
          comment: formData.engagementOptions.comment,
          commentKeyword: formData.engagementOptions.comment ? formData.commentKeyword : undefined,
        },
        originalPost: generatedPost,
        changeRequest: changeRequest,
      };

      if (!leadMagnetWebhookUrl) {
        throw new Error("Lead magnet webhook URL not configured");
      }

      const response = await fetch(
        leadMagnetWebhookUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setGeneratedPost(result.content || "Updated content will appear here...");
      setEditedContent(result.content || "");
      setChangeRequest("");
      toast({
        title: "Success!",
        description: "Lead magnet post refined successfully.",
      });
    } catch (error) {
      console.error("Error refining post:", error);
      toast({
        title: "Error",
        description: "Failed to refine the post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = async () => {
    const content = editMode ? editedContent : generatedPost;
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Lead magnet post copied to clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleAddToCalendar = () => {
    if (scheduledDate) {
      toast({
        title: "Scheduled!",
        description: `Lead magnet post scheduled for ${format(scheduledDate, "PPP")}`,
      });
      setCalendarOpen(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      setGeneratedPost(editedContent);
    }
    setEditMode(!editMode);
  };

  const generateTitle = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      const words = firstLine.split(' ').slice(0, 8).join(' ');
      return words.length > 50 ? words.substring(0, 50) + '...' : words;
    }
    return 'Lead Magnet Post';
  };

  const handleSaveToLibrary = async () => {
    if (!postTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the post.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const content = editMode ? editedContent : generatedPost;
      const formData = form.getValues();
      
      const sourceData = {
        resourceType: formData.resourceType,
        resourceOutline: formData.resourceOutline,
        engagementOptions: formData.engagementOptions,
        commentKeyword: formData.commentKeyword
      };

      await ContentService.createPost({
        title: postTitle,
        content: content,
        content_type: 'lead_magnet',
        platform: selectedPlatform,
        tags: selectedTags,
        status: 'draft',
        source_data: sourceData
      });

      toast({
        title: "Success!",
        description: "Post saved to library successfully.",
      });
      
      setSaveDialogOpen(false);
      setPostTitle("");
      setSelectedTags([]);
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save post to library.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!postTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the post.",
        variant: "destructive",
      });
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      toast({
        title: "Error",
        description: "Please select both date and time for scheduling.",
        variant: "destructive",
      });
      return;
    }

    setIsScheduling(true);
    try {
      const content = editMode ? editedContent : generatedPost;
      const formData = form.getValues();
      
      const sourceData = {
        resourceType: formData.resourceType,
        resourceOutline: formData.resourceOutline,
        engagementOptions: formData.engagementOptions,
        commentKeyword: formData.commentKeyword
      };

      const [hours, minutes] = scheduledTime.split(':');
      const scheduledDateTime = new Date(scheduledDate);
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await ContentService.createPost({
        title: postTitle,
        content: content,
        content_type: 'lead_magnet',
        platform: selectedPlatform,
        tags: selectedTags,
        status: 'scheduled',
        scheduled_date: scheduledDateTime.toISOString(),
        source_data: sourceData
      });

      toast({
        title: "Success!",
        description: `Post scheduled for ${format(scheduledDateTime, "PPP 'at' p")}`,
      });
      
      setScheduleDialogOpen(false);
      setPostTitle("");
      setSelectedTags([]);
      setScheduledTime("");
    } catch (error) {
      console.error("Error scheduling post:", error);
      toast({
        title: "Error",
        description: "Failed to schedule post.",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-500/5 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        {/* <div className="text-center space-y-4"> */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Lead Magnet Generator</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent animate-pulse-glow">
            Lead Magnet AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create compelling lead magnet posts that drive engagement and generate leads with AI assistance
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-0">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Configure Your Lead Magnet</CardTitle>
                <CardDescription>
                  Set up your resource details and engagement preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Resource Type */}
                    <FormField
                      control={form.control}
                      name="resourceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Resource</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select resource type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {resourceTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Resource Outline */}
                    <FormField
                      control={form.control}
                      name="resourceOutline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource Outline</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={`• Main benefit/outcome\n• Key feature 1\n• Key feature 2\n• What's included`}
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Engagement Options */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Include in Post:</Label>
                      
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="engagementOptions.connect"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label className="text-sm font-normal">Connect</Label>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="engagementOptions.like"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label className="text-sm font-normal">Like</Label>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="engagementOptions.repost"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label className="text-sm font-normal">Repost</Label>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="engagementOptions.comment"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label className="text-sm font-normal">Comment</Label>
                            </FormItem>
                          )}
                        />

                        {/* Conditional Comment Keyword Field */}
                        {commentEnabled && (
                          <FormField
                            control={form.control}
                            name="commentKeyword"
                            render={({ field }) => (
                              <FormItem className="ml-6">
                                <FormLabel className="text-xs">Comment keyword</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter comment keyword"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Lead Magnet...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Lead Magnet Post
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Content Display Panel */}
          <div className="lg:col-span-2">
            {generatedPost ? (
              <div className="space-y-6">
                <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="text-xl">Generated Lead Magnet Post</CardTitle>
                      <CardDescription>
                        Review and customize your AI-generated content
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="h-6">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="gap-2 shadow-sm"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-[300px] p-4 text-base leading-relaxed"
                      />
                    ) : (
                      <div className="bg-muted/30 rounded-lg p-4 min-h-[300px]">
                        <pre className="text-base leading-relaxed whitespace-pre-wrap font-sans">
                          {generatedPost}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons Section */}
                {generatedPost && (
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      onClick={handleEditToggle}
                      className="h-12 gap-2 shadow-lg border-2"
                      size="lg"
                    >
                      {editMode ? (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4" />
                          Edit Post
                        </>
                      )}
                    </Button>

                    <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 gap-2 shadow-lg border-2"
                          size="lg"
                          onClick={() => {
                            const title = generateTitle(editMode ? editedContent : generatedPost);
                            setPostTitle(title);
                            setSaveDialogOpen(true);
                          }}
                        >
                          <Save className="h-4 w-4" />
                          Save to Library
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Save to Library</DialogTitle>
                          <DialogDescription>
                            Save your lead magnet post to the content library for future use.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="post-title">Post Title</Label>
                            <Input
                              id="post-title"
                              value={postTitle}
                              onChange={(e) => setPostTitle(e.target.value)}
                              placeholder="Enter a title for your post"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="platform">Platform</Label>
                            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex gap-2">
                              <Input
                                value={customTag}
                                onChange={(e) => setCustomTag(e.target.value)}
                                placeholder="Add a tag"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addCustomTag();
                                  }
                                }}
                              />
                              <Button type="button" variant="outline" onClick={addCustomTag}>
                                Add
                              </Button>
                            </div>
                            {selectedTags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedTags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => removeTag(tag)}
                                  >
                                    {tag} ×
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setSaveDialogOpen(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveToLibrary}
                              disabled={isSaving}
                              className="flex-1"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save to Library"
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 gap-2 shadow-lg border-2"
                          size="lg"
                          onClick={() => {
                            const title = generateTitle(editMode ? editedContent : generatedPost);
                            setPostTitle(title);
                            setScheduleDialogOpen(true);
                          }}
                        >
                          <Clock className="h-4 w-4" />
                          Schedule Post
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Schedule Lead Magnet Post</DialogTitle>
                          <DialogDescription>
                            Choose when to publish your lead magnet post and save it to your content library.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !scheduledDate && "text-muted-foreground"
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={scheduledDate}
                                    onSelect={setScheduledDate}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="time">Time</Label>
                              <Input
                                id="time"
                                type="time"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="schedule-title">Post Title</Label>
                            <Input
                              id="schedule-title"
                              value={postTitle}
                              onChange={(e) => setPostTitle(e.target.value)}
                              placeholder="Enter a title for your post"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="schedule-platform">Platform</Label>
                            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex gap-2">
                              <Input
                                value={customTag}
                                onChange={(e) => setCustomTag(e.target.value)}
                                placeholder="Add a tag"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addCustomTag();
                                  }
                                }}
                              />
                              <Button type="button" variant="outline" onClick={addCustomTag}>
                                Add
                              </Button>
                            </div>
                            {selectedTags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedTags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => removeTag(tag)}
                                  >
                                    {tag} ×
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setScheduleDialogOpen(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSchedulePost}
                              disabled={isScheduling}
                              className="flex-1"
                            >
                              {isScheduling ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Scheduling...
                                </>
                              ) : (
                                "Schedule Post"
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {/* Refinement Section */}
                <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Need Changes?</CardTitle>
                    <CardDescription>
                      Describe what you'd like to modify and regenerate the post
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Describe the changes you'd like to make..."
                      value={changeRequest}
                      onChange={(e) => setChangeRequest(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button 
                      onClick={handleResubmit}
                      disabled={isRegenerating || !changeRequest.trim()}
                      className="w-full"
                    >
                      {isRegenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Regenerate with Changes
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-0 h-[600px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Ready to Generate</h3>
                    <p className="text-muted-foreground max-w-md">
                      Configure your lead magnet details on the left and generate your AI-powered LinkedIn post
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}