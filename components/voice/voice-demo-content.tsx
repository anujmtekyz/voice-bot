"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoicePlayer } from "./audio/voice-player";
import { VoiceRecorder } from "./audio/voice-recorder";
import { voiceApi, voiceTranscriptionApi } from "@/lib/api";
import { playAudioFromBase64 } from "@/lib/voice-utils";

export function VoiceDemoContent() {
  const { toast } = useToast();
  const [testVoiceText, setTestVoiceText] = useState("Hello! This is a test of the voice assistant. How does it sound?");
  const [loading, setLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);

  // Test the voice with the current settings
  const handleTestVoice = async () => {
    if (!testVoiceText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to test the voice.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await voiceApi.testVoice(testVoiceText);
      
      if (response.success && response.audioData) {
        setAudioData(response.audioData);
        
        toast({
          title: "Voice Test",
          description: "Voice generated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to test voice. No audio returned.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to test voice:', error);
      toast({
        title: "Error",
        description: "Failed to test voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle recording complete
  const handleRecordingComplete = async (recordedAudioData: string) => {
    setTranscribing(true);
    setTranscription(null);
    
    try {
      const response = await voiceTranscriptionApi.transcribe(recordedAudioData, 'webm');
      
      if (response.success && response.text) {
        setTranscription(response.text);
        
        toast({
          title: "Transcription Complete",
          description: "Your voice has been transcribed successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to transcribe audio.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to transcribe audio:', error);
      toast({
        title: "Error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTranscribing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Voice Components Demo</h1>
        <p className="text-muted-foreground">
          Explore and test voice components and features
        </p>
      </div>

      <Tabs defaultValue="player">
        <TabsList>
          <TabsTrigger value="player">Voice Player</TabsTrigger>
          <TabsTrigger value="recorder">Voice Recorder</TabsTrigger>
          <TabsTrigger value="transcription">Transcription</TabsTrigger>
        </TabsList>

        <TabsContent value="player" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voice Player Demo</CardTitle>
              <CardDescription>
                Test the voice player with text-to-speech conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="test-voice-text" className="text-sm font-medium">
                    Text to convert to speech
                  </label>
                  <Input
                    id="test-voice-text"
                    value={testVoiceText}
                    onChange={(e) => setTestVoiceText(e.target.value)}
                    placeholder="Enter text to convert to speech"
                    disabled={loading}
                  />
                </div>

                <Button 
                  onClick={handleTestVoice} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating voice...
                    </>
                  ) : (
                    "Generate Voice"
                  )}
                </Button>

                {audioData && (
                  <VoicePlayer 
                    audioData={audioData} 
                    className="mt-4"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recorder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voice Recorder Demo</CardTitle>
              <CardDescription>
                Record your voice and play it back
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceRecorder 
                onRecordingComplete={(audioData) => {
                  toast({
                    title: "Recording Complete",
                    description: "Your voice recording is ready to play.",
                  });
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voice Transcription Demo</CardTitle>
              <CardDescription>
                Record your voice and convert it to text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <VoiceRecorder onRecordingComplete={handleRecordingComplete} />

                {transcribing && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Transcribing your voice...</span>
                  </div>
                )}

                {transcription && (
                  <div className="rounded-md border bg-accent/50 p-4">
                    <h3 className="mb-2 font-medium">Transcription Result:</h3>
                    <p className="text-sm">{transcription}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 