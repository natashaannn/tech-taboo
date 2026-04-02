import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { tabooList } from '../lib/data/tabooList'
import { generateSVG, generateMultipleSVGs } from '../lib/generateSVG'
import { CATEGORIES, detectCategory } from '../lib/categories'
import type { TabooCard } from '../types/taboo'

export function CardGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [customCard, setCustomCard] = useState({ top: '', bottom: '' })
  const [showBleed, setShowBleed] = useState(false)
  const [useCustomColor, setUseCustomColor] = useState(false)
  const [baseColor, setBaseColor] = useState('#17424A')
  const [output, setOutput] = useState<string>('')
  
  // Filter cards by category
  const filteredCards = selectedCategory === 'all' 
    ? tabooList 
    : tabooList.filter(card => 
        detectCategory(card.top.word) === selectedCategory || 
        detectCategory(card.bottom.word) === selectedCategory
      )
  
  // Generate random cards
  const generateRandomCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 6).map((card, index) => ({
      id: `card-${Date.now()}-${index}`,
      top: { ...card.top },
      bottom: { ...card.bottom },
      createdAt: new Date()
    }))
    
    const svgs = generateMultipleSVGs(selected, {
      showBleed,
      category: selectedCategory === 'all' ? undefined : selectedCategory
    })
    setOutput(svgs.join('\n'))
  }
  
  // Generate custom card
  const generateCustomCard = () => {
    if (!customCard.top.trim() || !customCard.bottom.trim()) return
    
    const card: TabooCard = {
      id: `custom-${Date.now()}`,
      top: {
        word: customCard.top,
        taboos: customCard.top.split(',').map(t => t.trim()).filter(t => t),
        category: detectCategory(customCard.top)
      },
      bottom: {
        word: customCard.bottom,
        taboos: customCard.bottom.split(',').map(t => t.trim()).filter(t => t),
        category: detectCategory(customCard.bottom)
      },
      createdAt: new Date()
    }
    
    const svg = generateSVG(card, {
      showBleed,
      category: selectedCategory === 'all' ? card.top.category : selectedCategory
    })
    
    setOutput(svg)
  }
  
  // Export functions
  const exportSVG = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'taboo-cards.svg'
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const exportPNG = async () => {
    if (!output) return
    
    // Create canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 1224
    canvas.height = 1832
    
    // Create image from SVG
    const img = new Image()
    const svg = new Blob([output], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svg)
    
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = pngUrl
          a.download = 'taboo-cards.png'
          a.click()
          URL.revokeObjectURL(pngUrl)
        }
      }, 'image/png')
      
      URL.revokeObjectURL(url)
    }
    
    img.src = url
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Techie Taboo Card Generator</h1>
            <p className="text-muted-foreground">
              Generate custom taboo cards for tech learning and team building
            </p>
          </div>
          
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Card Generation Options</CardTitle>
              <CardDescription>
                Configure your card generation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Base Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="h-10 w-20 rounded border border-input"
                      disabled={!useCustomColor}
                    />
                    <Switch
                      checked={useCustomColor}
                      onCheckedChange={setUseCustomColor}
                    />
                    <Label className="text-sm">Custom</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Show Bleed</Label>
                  <Switch
                    checked={showBleed}
                    onCheckedChange={setShowBleed}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button onClick={generateRandomCards}>
                  Generate Random Cards
                </Button>
                <Button variant="outline" onClick={generateCustomCard}>
                  Generate Custom Card
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Custom Card Input */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Card</CardTitle>
              <CardDescription>
                Create a custom card by entering words and taboo words (comma-separated)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="top-word">Top Word</Label>
                  <Textarea
                    id="top-word"
                    placeholder="React"
                    value={customCard.top}
                    onChange={(e) => setCustomCard(prev => ({ ...prev, top: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bottom-word">Bottom Word</Label>
                  <Textarea
                    id="bottom-word"
                    placeholder="State, useState, Redux, Props, Components"
                    value={customCard.bottom}
                    onChange={(e) => setCustomCard(prev => ({ ...prev, bottom: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Output */}
          {output && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Cards</CardTitle>
                <CardDescription>
                  Your generated taboo cards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button onClick={exportSVG}>Export as SVG</Button>
                  <Button variant="outline" onClick={exportPNG}>Export as PNG</Button>
                </div>
                <div 
                  className="border rounded-lg p-4 bg-white overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: output }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
