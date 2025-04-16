"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { VoicePlayer } from "@/components/voice/audio/voice-player"
import { VoiceRecorder } from "@/components/voice/audio/voice-recorder"
import { voiceApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Volume2, Mic, Save, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Default values to use as fallback
const DEFAULT_SETTINGS = {
  voiceActivation: true,
  wakeWord: "Hey Assistant",
  sensitivity: 0.7,
  voiceId: "en-US-Neural2-F",
  voicePitch: 0,
  voiceSpeed: 1,
  customVoiceExample: null,
}

// Update the settings state type to match the API response format
interface VoiceSettings {
  voiceActivation: boolean
  wakeWord: string
  sensitivity: number
  voiceId: string
  voicePitch: number
  voiceSpeed: number
  customVoiceExample: string | null
}

export function VoiceSettings() {
  const { toast } = useToast()
  
  // Update initial settings to match the type structure
  const [settings, setSettings] = useState<VoiceSettings>({
    voiceActivation: false,
    wakeWord: "Hey Assistant",
    sensitivity: 75,
    voiceId: "en-US-Neural2-F",
    voicePitch: 0,
    voiceSpeed: 1,
    customVoiceExample: null,
  })
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testPlaying, setTestPlaying] = useState(false)
  const [testingVoice, setTestingVoice] = useState(false)
  const [voiceTypes, setVoiceTypes] = useState<string[]>([])
  const [testSample, setTestSample] = useState<string | null>(null)
  const [testText, setTestText] = useState("Hello, this is a test of the voice settings.")
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  
  // Error handling
  const [error, setError] = useState<string | null>(null)
  const [usingDefaults, setUsingDefaults] = useState(false)
  
  // Fetch initial settings
  useEffect(() => {
    fetchSettings()
    fetchVoiceTypes()
  }, [])
  
  // Fetch settings from API
  const fetchSettings = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await voiceApi.getSettings()
      if (response.success && response.data) {
        // Map the API response to our component state structure
        setSettings({
          voiceActivation: response.data.voiceActivation,
          wakeWord: response.data.wakeWord,
          sensitivity: response.data.sensitivity,
          voiceId: response.data.voiceType,
          voicePitch: response.data.voiceSpeed, // Assuming this maps to pitch
          voiceSpeed: response.data.voiceSpeed,
          customVoiceExample: null, // This might need to be updated based on API
        })
        setUsingDefaults(false)
      } else {
        throw new Error(response.message || "Failed to fetch settings")
      }
    } catch (err) {
      console.error("Error fetching voice settings:", err)
      toast({
        title: "Error",
        description: "Could not load voice settings. Using defaults.",
        variant: "destructive",
      })
      setUsingDefaults(true)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch available voice types
  const fetchVoiceTypes = async () => {
    try {
      const response = await voiceApi.getVoiceTypes()
      if (response.success && response.data) {
        setVoiceTypes(response.data)
      }
    } catch (err) {
      console.error("Error fetching voice types:", err)
      toast({
        title: "Error",
        description: "Could not load available voice types.",
        variant: "destructive",
      })
    }
  }
  
  // Save settings to API
  const saveSettings = async () => {
    if (usingDefaults) {
      toast({
        title: "Cannot Save",
        description: "Cannot save settings while using defaults due to connection issues.",
        variant: "destructive",
      })
      return
    }
    
    setSaving(true)
    setError(null)
    
    try {
      await voiceApi.updateSettings(settings)
      toast({
        title: "Success",
        description: "Voice settings saved successfully.",
      })
    } catch (err) {
      console.error("Failed to save voice settings:", err)
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to save voice settings."
      
      setError(errorMessage)
      toast({
        title: "Error",
        description: "Failed to save voice settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }
  
  // Handle test voice
  const handleTestVoice = async () => {
    setTestingVoice(true)
    setTestSample(null)
    
    try {
      const result = await voiceApi.testVoice({
        text: testText,
        voiceId: settings.voiceId,
        pitch: settings.voicePitch,
        speed: settings.voiceSpeed,
      })
      
      // Convert the base64 audio data to a data URI if it exists
      if (result.audioData) {
        const audioDataUri = `data:audio/mp3;base64,${result.audioData}`
        setTestSample(audioDataUri)
      } else {
        setTestSample(null)
      }
    } catch (err) {
      console.error("Failed to test voice:", err)
      toast({
        title: "Error",
        description: "Failed to generate voice test sample.",
        variant: "destructive",
      })
    } finally {
      setTestingVoice(false)
    }
  }
  
  // Handle recorded audio
  const handleRecordingComplete = (audioData: string) => {
    setRecordedAudio(audioData)
    setSettings((prev) => ({
      ...prev,
      customVoiceExample: audioData,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Voice Settings</CardTitle>
        <CardDescription>
          Configure your voice assistant settings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {usingDefaults && !error && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Using Default Settings</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Unable to load your personalized settings. Using defaults instead. 
              Your changes won't be saved until the connection issues are resolved.
            </AlertDescription>
          </Alert>
        )}
        
        <div>
          <h3 className="text-lg font-medium">Voice Commands</h3>
          <div className="mt-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="voice-activation">Voice Activation</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable voice commands
                </p>
              </div>
              <Switch
                id="voice-activation"
                checked={settings.voiceActivation}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, voiceActivation: checked })
                }
              />
            </div>
            
            {settings.voiceActivation && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="wake-word">Wake Word</Label>
                  <Input
                    id="wake-word"
                    value={settings.wakeWord}
                    onChange={(e) =>
                      setSettings({ ...settings, wakeWord: e.target.value })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Phrase to activate voice commands (e.g., "Hey Assistant")
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sensitivity">Wake Word Sensitivity</Label>
                    <span className="text-sm">
                      {Math.round(settings.sensitivity * 100)}%
                    </span>
                  </div>
                  <Slider
                    id="sensitivity"
                    value={[settings.sensitivity * 100]}
                    min={30}
                    max={100}
                    step={5}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        sensitivity: value[0] / 100,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Higher sensitivity may lead to more false activations
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <h3 className="text-lg font-medium">Voice Output</h3>
          <div className="mt-3 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-type">Voice Type</Label>
              <select
                id="voice-type"
                value={settings.voiceId}
                onChange={(e) =>
                  setSettings({ ...settings, voiceId: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {voiceTypes.length > 0 ? (
                  voiceTypes.map((voice) => (
                    <option key={voice} value={voice}>
                      {voice}
                    </option>
                  ))
                ) : (
                  <option value={settings.voiceId}>
                    {settings.voiceId} (Default)
                  </option>
                )}
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-pitch">Voice Pitch</Label>
                <span className="text-sm">
                  {settings.voicePitch > 0
                    ? `+${settings.voicePitch}`
                    : settings.voicePitch}
                </span>
              </div>
              <Slider
                id="voice-pitch"
                value={[settings.voicePitch * 10 + 50]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    voicePitch: (value[0] - 50) / 10,
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                Adjust the pitch of the voice from lower to higher
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-speed">Voice Speed</Label>
                <span className="text-sm">{settings.voiceSpeed.toFixed(1)}x</span>
              </div>
              <Slider
                id="voice-speed"
                value={[settings.voiceSpeed * 50]}
                min={25}
                max={100}
                step={5}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    voiceSpeed: value[0] / 50,
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                Adjust the speaking rate from slower to faster
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-text">Test Text</Label>
              <Textarea
                id="test-text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Enter text to test the voice settings"
              />
              
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={handleTestVoice}
                  disabled={testingVoice || !testText.trim()}
                  variant="outline"
                  className="mt-2 w-fit"
                >
                  {testingVoice ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Volume2 className="mr-2 h-4 w-4" />
                  )}
                  Test Voice
                </Button>
                
                {testSample && (
                  <div className="mt-2 p-2 border rounded bg-muted/20">
                    <p className="text-sm text-muted-foreground mb-1">Voice Preview:</p>
                    <VoicePlayer
                      audioData={testSample}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label>Custom Voice Example (Optional)</Label>
              <div className="flex flex-col gap-2">
                <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
                
                {recordedAudio && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Preview:</span>
                    <VoicePlayer audioData={recordedAudio} />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Record a sample of your voice to help improve voice synthesis
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={fetchSettings} disabled={loading}>
          Reset
        </Button>
        <Button onClick={saveSettings} disabled={saving || usingDefaults}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
