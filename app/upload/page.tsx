"use client";

import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Clock, Tag, Eye, Sparkles, Lightbulb, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { upload, ImageKitAbortError } from "@imagekit/next";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  
  // Video details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      if (file.size > 500 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Maximum file size is 500MB",
        });
        return;
      }
      setSelectedFile(file);
      setShowDetailsForm(true);
      startUpload(file);
    } else {
      toast.error("Invalid file type", {
        description: "Please select a video file",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Maximum file size is 500MB",
        });
        return;
      }
      setSelectedFile(file);
      setShowDetailsForm(true);
      startUpload(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const startUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    abortControllerRef.current = new AbortController();

    toast.info("Starting upload", {
      description: "Uploading to ImageKit...",
    });

    try {
      // Get authentication parameters
      const authRes = await fetch("/api/auth/imagekit-auth");
      
      if (!authRes.ok) {
        throw new Error("Authentication failed");
      }
      
      const auth = await authRes.json();
      const { token, signature, expire, publicKey } = auth;

      const uploadOptions = {
        file,
        fileName: file.name,
        publicKey,
        signature,
        expire,
        token,
        useUniqueFileName: true,
        folder: '/videos/',
        onProgress: (event: { loaded: number; total: number }) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        },
        abortSignal: abortControllerRef.current?.signal,
      };
      
      const res = await upload(uploadOptions);
      
      setUploadedVideoUrl(res.url || "");
      
      toast.success("Upload complete!", {
        description: "Now add video details and save",
      });
      
    } catch (err) {
      if (err instanceof ImageKitAbortError) {
        toast.info("Upload cancelled");
        handleReset();
      } else {
        toast.error("Upload failed", {
          description: err instanceof Error ? err.message : "Please try again",
        });
        setUploading(false);
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleSaveVideo = async () => {
    if (!title.trim()) {
      toast.error("Title required", {
        description: "Please enter a title for your video",
      });
      return;
    }

    if (!description.trim()) {
      toast.error("Description required", {
        description: "Please enter a description for your video",
      });
      return;
    }

    if (!uploadedVideoUrl) {
      toast.error("Video not uploaded", {
        description: "Please wait for upload to complete",
      });
      return;
    }

    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          videoUrl: uploadedVideoUrl,
          thumbnailUrl: uploadedVideoUrl,
          controls: true,
          transformation: {
            height: 1920,
            width: 1080,
            quality: 80,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save video");
      }

      const data = await response.json();
      
      console.log("Video saved to database:", data);

      toast.success("Video published!", {
        description: "Your PopReel is now live",
      });

      // Reset for next upload
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Failed to save video", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setUploading(false);
    setUploadProgress(0);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setShowDetailsForm(false);
    setTitle("");
    setDescription("");
    setUploadProgress(0);
    setUploadedVideoUrl("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-head text-6xl font-bold mb-3">Upload Video</h1>
          <p className="font-head text-lg text-muted-foreground max-w-2xl mx-auto">
            Create a new PopReel — pick a file, add details, and share your vibe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Upload Section */}
          <div className="lg:col-span-7">
            {/* Drag and Drop Upload Area */}
            <Card className="border-4 border-black rounded-2xl p-6 bg-card h-full w-xl">
              {!showDetailsForm ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-4 border-dashed rounded-2xl p-16 transition-all min-h-[500px] flex items-center justify-center ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-black bg-background"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-6 text-center w-full">
                    {/* Upload Icon */}
                    <div className="p-6 bg-yellow-400 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Upload className="h-20 w-20" />
                    </div>

                    {/* Text */}
                    <div className="space-y-2">
                      <h3 className="font-head text-3xl font-bold">
                        Drop your video here
                      </h3>
                      <p className="text-muted-foreground font-head text-base">
                        or click to browse your files
                      </p>
                    </div>

                    {/* File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />

                    {/* Browse Button */}
                    <Button
                      size="lg"
                      onClick={handleBrowseClick}
                      className="font-head text-lg px-8 py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Browse Files
                    </Button>

                    {/* Supported Formats */}
                    <div className="flex flex-wrap gap-3 justify-center mt-4">
                      <span className="px-4 py-2 bg-black text-yellow-400 border-2 border-black rounded-lg font-head text-sm font-bold">
                        MP4
                      </span>
                      <span className="px-4 py-2 bg-black text-yellow-400 border-2 border-black rounded-lg font-head text-sm font-bold">
                        MOV
                      </span>
                      <span className="px-4 py-2 bg-black text-yellow-400 border-2 border-black rounded-lg font-head text-sm font-bold">
                        AVI
                      </span>
                      <span className="px-4 py-2 bg-black text-yellow-400 border-2 border-black rounded-lg font-head text-sm font-bold">
                        Max 100MB
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Video Details Form - Shows in same box */
                <div className="space-y-6">
                  {/* File Info with Icon */}
                  <div className="flex items-center gap-4 p-4 bg-blue-50 border-2 border-blue-600 rounded-xl">
                    <div className="p-3 bg-yellow-400 border-2 border-black rounded-lg flex-shrink-0">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-head text-lg font-bold truncate">{selectedFile?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile && (selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploading && !uploadedVideoUrl && (
                    <div className="space-y-3 p-5 bg-yellow-50 border-4 border-yellow-600 rounded-xl shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]">
                      <div className="flex items-center justify-between">
                        <span className="font-head text-base">Uploading to ImageKit...</span>
                        <span className="font-head text-lg font-bold">{uploadProgress}%</span>
                      </div>
                      <div className="h-5 w-full border-2 border-black rounded-lg bg-white overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Please wait while your video uploads...</span>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {uploadedVideoUrl && (
                    <div className="p-5 bg-green-50 border-4 border-green-600 rounded-xl shadow-[4px_4px_0px_0px_rgba(22,163,74,1)]">
                      <p className="font-head text-lg text-green-700 mb-1">✓ Upload Complete!</p>
                      <p className="text-sm text-muted-foreground">Add details below and save your video.</p>
                    </div>
                  )}

                  {/* Title Input */}
                  <div className="space-y-2">
                    <Label htmlFor="video-title" className="font-head text-base">
                      Title *
                    </Label>
                    <Input
                      id="video-title"
                      placeholder="Enter an engaging title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border-2 font-head"
                    />
                  </div>

                  {/* Description Textarea */}
                  <div className="space-y-2">
                    <Label htmlFor="video-description" className="font-head text-base">
                      Description *
                    </Label>
                    <textarea
                      id="video-description"
                      placeholder="Describe your video..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="px-4 py-3 w-full rounded border-2 shadow-md transition focus:outline-hidden focus:shadow-xs min-h-32 font-sans"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    {!uploadedVideoUrl && (
                      <Button
                        onClick={handleCancelUpload}
                        variant="outline"
                        className="flex-1 font-head border-2"
                        disabled={!uploading}
                      >
                        Cancel Upload
                      </Button>
                    )}

                    {uploadedVideoUrl && (
                      <>
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="flex-1 font-head border-2"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveVideo}
                          className="flex-1 font-head shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                          Save Video
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right: Quick Tips Section */}
          <div className="lg:col-span-5">
            <Card className="border-4 border-black rounded-2xl p-6 bg-yellow-50 sticky top-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-black">
                <div className="p-2.5 bg-yellow-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="font-head text-2xl font-bold">Quick Tips</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-400 border-2 border-black rounded-lg flex-shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-head text-base font-bold mb-1">Keep it Short</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Videos under 3 minutes get 2x more engagement</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-400 border-2 border-black rounded-lg flex-shrink-0">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-head text-base font-bold mb-1">Use Tags Wisely</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Add 5-10 relevant tags to boost discoverability</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-400 border-2 border-black rounded-lg flex-shrink-0">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-head text-base font-bold mb-1">First Impression</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">The first frame is your thumbnail - make it count!</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-400 border-2 border-black rounded-lg flex-shrink-0">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-head text-base font-bold mb-1">Quality Matters</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Good lighting and clear audio = more views</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

