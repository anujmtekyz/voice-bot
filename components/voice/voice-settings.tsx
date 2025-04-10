"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function VoiceSettings() {
  const [voiceType, setVoiceType] = useState("joanna")
  const [voiceSpeed, setVoiceSpeed] = useState(1)
  const [enableVoiceCommands, setEnableVoiceCommands] = useState(true)
  const [enableVoiceFeedback, setEnableVoiceFeedback] = useState(true)
  const [enableAmbientAwareness, setEnableAmbientAwareness] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Voice Assistant Settings</h1>
        <p className="text-muted-foreground">Customize how your voice assistant works</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Voice Preferences</CardTitle>
            <CardDescription>Customize the voice used for responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="voice-type">Voice Type</Label>
              <Select value={voiceType} onValueChange={setVoiceType}>
                <SelectTrigger id="voice-type">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joanna">Joanna (Female)</SelectItem>
                  <SelectItem value="matthew">Matthew (Male)</SelectItem>
                  <SelectItem value="salli">Salli (Female)</SelectItem>
                  <SelectItem value="joey">Joey (Male)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-speed">Voice Speed</Label>
                <span className="text-sm text-muted-foreground">{voiceSpeed}x</span>
              </div>
              <Slider
                id="voice-speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[voiceSpeed]}
                onValueChange={(value) => setVoiceSpeed(value[0])}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm">
                Test Voice
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Command Settings</CardTitle>
            <CardDescription>Configure how voice commands work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enable-voice-commands">Enable Voice Commands</Label>
              <Switch
                id="enable-voice-commands"
                checked={enableVoiceCommands}
                onCheckedChange={setEnableVoiceCommands}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enable-voice-feedback">Voice Feedback</Label>
              <Switch
                id="enable-voice-feedback"
                checked={enableVoiceFeedback}
                onCheckedChange={setEnableVoiceFeedback}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enable-ambient-awareness">Ambient Awareness</Label>
              <Switch
                id="enable-ambient-awareness"
                checked={enableAmbientAwareness}
                onCheckedChange={setEnableAmbientAwareness}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="command-sensitivity">Command Sensitivity</Label>
              <Slider id="command-sensitivity" min={1} max={10} step={1} value={[7]} onValueChange={() => {}} />
              <p className="text-xs text-muted-foreground">
                Higher sensitivity may detect more commands but with less accuracy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
