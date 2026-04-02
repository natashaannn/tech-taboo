import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { tabooList } from '../lib/data/tabooList'
import { generateSVG } from '../lib/generateSVG'
import { CATEGORIES } from '../lib/categories'

export function Packaging() {
  const [selectedVersion, setSelectedVersion] = useState('v1')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showBleed, setShowBleed] = useState(true)
  const [cardSize, setCardSize] = useState({ width: 610, height: 910 })
  const [output, setOutput] = useState<string>('')
  
  // Version definitions
  const versions = {
    v1: { name: 'Version 1', cardCount: 40, description: 'Original version with 40 cards' },
    v2: { name: 'Version 2', cardCount: 60, description: 'Extended version with 60 cards' },
    v3: { name: 'Version 3', cardCount: 80, description: 'Complete version with 80 cards' }
  }
  
  // Generate packaging layout
  const generatePackaging = () => {
    const version = versions[selectedVersion as keyof typeof versions]
    const cards = tabooList.slice(0, version.cardCount)
    
    // Generate packaging SVG with multiple cards arranged in a grid
    const packagingSVG = `
      <svg width="2480" height="3508" viewBox="0 0 2480 3508" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .packaging-text { 
              font-family: Arial, sans-serif; 
              font-size: 24px; 
              font-weight: bold; 
              fill: #17424A;
            }
            .info-text {
              font-family: Arial, sans-serif;
              font-size: 18px;
              fill: #666;
            }
          </style>
        </defs>
        
        <!-- Background -->
        <rect width="2480" height="3508" fill="#f8f8f8"/>
        
        <!-- Title -->
        <text x="1240" y="100" text-anchor="middle" class="packaging-text" style="font-size: 48px;">
          Techie Taboo - ${version.name}
        </text>
        
        <!-- Card grid -->
        ${cards.map((card, index) => {
            const row = Math.floor(index / 4)
            const col = index % 4
            const x = 240 + col * 600
            const y = 200 + row * 850
            
            return `
              <g transform="translate(${x}, ${y})">
                ${generateSVG({
                  id: `pack-card-${index}`,
                  top: { ...card.top },
                  bottom: { ...card.bottom },
                  createdAt: new Date()
                }, {
                  showBleed: false,
                  category: CATEGORIES[index % CATEGORIES.length]
                })}
              </g>
            `
        }).join('\n        ')}
        
        <!-- Footer info -->
        <text x="1240" y="3400" text-anchor="middle" class="info-text">
          ${version.cardCount} cards • ${selectedLanguage.toUpperCase()} • Made with 💜 by ragTech
        </text>
      </svg>
    `
    
    setOutput(packagingSVG)
  }
  
  // Generate panels (individual card faces for printing)
  const generatePanels = () => {
    const version = versions[selectedVersion as keyof typeof versions]
    const cards = tabooList.slice(0, version.cardCount)
    
    // Create front and back panels
    const frontCards = cards.map((card, index) => card.top)
    const backCards = cards.map((card, index) => card.bottom)
    
    const panelsSVG = `
      <svg width="2480" height="3508" viewBox="0 0 2480 3508" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .panel-label { 
              font-family: Arial, sans-serif; 
              font-size: 32px; 
              font-weight: bold; 
              fill: #17424A;
            }
          </style>
        </defs>
        
        <!-- Background -->
        <rect width="2480" height="3508" fill="white"/>
        
        <!-- Front Panel -->
        <g transform="translate(0, 100)">
          <text x="1240" y="0" text-anchor="middle" class="panel-label">Front Cards</text>
          ${frontCards.map((card) => {
            const row = Math.floor(frontCards.indexOf(card) / 4)
            const col = frontCards.indexOf(card) % 4
            const x = 240 + col * 600
            const y = 50 + row * 850
            
            return `
              <g transform="translate(${x}, ${y})">
                ${generateSVG({
                  id: `front-card-${frontCards.indexOf(card)}`,
                  top: { ...card },
                  bottom: { word: '', taboos: [] },
                  createdAt: new Date()
                }, {
                  showBleed: false,
                  category: CATEGORIES[frontCards.indexOf(card) % CATEGORIES.length]
                })}
              </g>
            `
          }).join('\n          ')}
        </g>
        
        <!-- Back Panel -->
        <g transform="translate(0, 1850)">
          <text x="1240" y="0" text-anchor="middle" class="panel-label">Back Cards</text>
          ${backCards.map((card) => {
            const row = Math.floor(backCards.indexOf(card) / 4)
            const col = backCards.indexOf(card) % 4
            const x = 240 + col * 600
            const y = 50 + row * 850
            
            return `
              <g transform="translate(${x}, ${y})">
                ${generateSVG({
                  id: `back-card-${backCards.indexOf(card)}`,
                  top: { word: '', taboos: [] },
                  bottom: { ...card },
                  createdAt: new Date()
                }, {
                  showBleed: false,
                  category: CATEGORIES[backCards.indexOf(card) % CATEGORIES.length]
                })}
              </g>
            `
          }).join('\n          ')}
        </g>
      </svg>
    `
    
    setOutput(panelsSVG)
  }
  
  // Export functions
  const exportSVG = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `packaging-${selectedVersion}-${selectedLanguage}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Packaging Generator</h1>
            <p className="text-muted-foreground">
              Generate print-ready packaging layouts for Techie Taboo cards
            </p>
          </div>
          
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Packaging Options</CardTitle>
              <CardDescription>
                Configure your packaging layout settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(versions).map(([key, version]) => (
                        <SelectItem key={key} value={key}>
                          {version.name} ({version.cardCount} cards)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Card Size</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={cardSize.width}
                      onChange={(e) => setCardSize(prev => ({ ...prev, width: parseInt(e.target.value) || 610 }))}
                      placeholder="Width"
                    />
                    <span className="flex items-center">×</span>
                    <Input
                      type="number"
                      value={cardSize.height}
                      onChange={(e) => setCardSize(prev => ({ ...prev, height: parseInt(e.target.value) || 910 }))}
                      placeholder="Height"
                    />
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
                <Button onClick={generatePackaging}>
                  Generate Packaging Layout
                </Button>
                <Button variant="outline" onClick={generatePanels}>
                  Generate Print Panels
                </Button>
                {output && (
                  <Button variant="secondary" onClick={exportSVG}>
                    Export as SVG
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Version Info */}
          <Card>
            <CardHeader>
              <CardTitle>Version Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(versions).map(([key, version]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{version.name}</h3>
                    <p className="text-sm text-muted-foreground">{version.description}</p>
                    <p className="text-sm font-medium mt-2">{version.cardCount} cards</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Output */}
          {output && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Packaging</CardTitle>
                <CardDescription>
                  Print-ready packaging layout (A4 size at 300 DPI)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-white overflow-auto max-h-screen">
                  <div dangerouslySetInnerHTML={{ __html: output }} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
