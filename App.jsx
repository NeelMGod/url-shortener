import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Copy, Link, QrCode, BarChart3, Check, ExternalLink } from 'lucide-react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [analytics, setAnalytics] = useState(null)
  const [isPremium, setIsPremium] = useState(false)

  // Base62 encoding for URL shortening
  const base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  const generateShortCode = (length = 6) => {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += base62[Math.floor(Math.random() * base62.length)]
    }
    return result
  }

  const generateQRCode = (url) => {
    // Simple QR code placeholder - in a real app, you'd use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const shortenUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const shortCode = customAlias || generateShortCode()
      const shortened = `https://short.ly/${shortCode}`
      
      setShortenedUrl(shortened)
      setQrCode(generateQRCode(shortened))
      
      // Generate mock analytics for premium users
      if (isPremium) {
        setAnalytics({
          totalClicks: Math.floor(Math.random() * 1000),
          countries: [
            { name: 'United States', clicks: Math.floor(Math.random() * 300) },
            { name: 'United Kingdom', clicks: Math.floor(Math.random() * 200) },
            { name: 'Canada', clicks: Math.floor(Math.random() * 150) },
            { name: 'Germany', clicks: Math.floor(Math.random() * 100) },
          ],
          devices: [
            { type: 'Desktop', clicks: Math.floor(Math.random() * 400) },
            { type: 'Mobile', clicks: Math.floor(Math.random() * 350) },
            { type: 'Tablet', clicks: Math.floor(Math.random() * 100) },
          ]
        })
      }
    } catch (err) {
      setError('Failed to shorten URL. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => {
    setUrl('')
    setCustomAlias('')
    setShortenedUrl('')
    setQrCode('')
    setError('')
    setAnalytics(null)
    setCopied(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Link className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              URL Shortener
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform long URLs into short, shareable links instantly. No signup required.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!shortenedUrl ? (
            /* URL Input Form */
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  Shorten Your URL
                </CardTitle>
                <CardDescription>
                  Paste your long URL below and get a shortened version instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    type="url"
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <Input
                    type="text"
                    placeholder="Custom alias (optional)"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for auto-generated short code
                  </p>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button 
                  onClick={shortenUrl} 
                  disabled={isLoading}
                  className="w-full text-lg py-6"
                >
                  {isLoading ? 'Shortening...' : 'Shorten URL'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Results */
            <div className="space-y-6">
              {/* Shortened URL Result */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-2" />
                    URL Shortened Successfully!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Input
                      value={shortenedUrl}
                      readOnly
                      className="flex-1 bg-transparent border-none text-lg font-mono"
                    />
                    <Button
                      onClick={() => copyToClipboard(shortenedUrl)}
                      variant="outline"
                      size="sm"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={() => window.open(shortenedUrl, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Original URL: {url}
                  </div>
                </CardContent>
              </Card>

              {/* QR Code and Analytics Tabs */}
              <Tabs defaultValue="qr" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="qr" className="flex items-center">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                    {!isPremium && <Badge variant="secondary" className="ml-2">Premium</Badge>}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="qr">
                  <Card>
                    <CardHeader>
                      <CardTitle>QR Code</CardTitle>
                      <CardDescription>
                        Scan this QR code to access your shortened URL
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                      <img 
                        src={qrCode} 
                        alt="QR Code" 
                        className="border rounded-lg"
                      />
                      <Button 
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = qrCode
                          link.download = 'qr-code.png'
                          link.click()
                        }}
                        variant="outline"
                      >
                        Download QR Code
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Link Analytics</CardTitle>
                      <CardDescription>
                        {isPremium ? 
                          'Detailed analytics for your shortened URL' : 
                          'Upgrade to premium to access detailed analytics'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isPremium && analytics ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {analytics.totalClicks}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Total Clicks
                              </div>
                            </div>
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {analytics.countries.length}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Countries
                              </div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {analytics.devices.length}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Device Types
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3">Top Countries</h4>
                              <div className="space-y-2">
                                {analytics.countries.map((country, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <span>{country.name}</span>
                                    <Badge variant="secondary">{country.clicks} clicks</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Device Types</h4>
                              <div className="space-y-2">
                                {analytics.devices.map((device, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <span>{device.type}</span>
                                    <Badge variant="secondary">{device.clicks} clicks</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Premium Analytics</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Get detailed insights about your links including click tracking, 
                            geographic data, and device analytics.
                          </p>
                          <Button 
                            onClick={() => setIsPremium(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            Upgrade to Premium
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button onClick={reset} variant="outline">
                  Shorten Another URL
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p>© 2025 URL Shortener. Built with React and Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  )
}

export default App

